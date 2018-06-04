import multihash from "multi-hash";
import SHA256 from "crypto-js/sha256";

class EventMgr {
  constructor(s3Mgr) {
    this.s3Mgr = s3Mgr;
  }

  async getIndex(mnid) {
    let index = [];
    try {
      let rawIndex = await this.s3Mgr.read(mnid, "index.json");
      index = JSON.parse(rawIndex);
    } catch (err) {
      if (err.code !== "NoSuchKey") {
        throw err;
      }
    }
    return index;
  }

  async getEventsFrom(mnid, eventId) {
    if (!mnid) throw "no mnid";

    //Get from mnid/index.json
    let index = await this.getIndex(mnid);

    if (!eventId) {
      return index;
    }
    let hashedIndex = {};
    index.map(function(key, index) {
      hashedIndex[key] = index;
    });
    let from = hashedIndex[eventId] + 1;
    return index.slice(from, from + index.length);
  }

  async lastId(mnid) {
    if (!mnid) throw "no mnid";

    //Get from mnid/index.json
    let index = await this.getIndex(mnid);

    return index.length === 0 ? null : index[index.length - 1];
  }

  async getId(eventData) {
    //Calc hash of eventData (IPFS style please)
    let hash = SHA256(JSON.stringify(eventData));
    let ipfsHash = multihash.encode(hash.toString());
    return ipfsHash;
  }

  async read(mnid, eventId) {
    let envelope = {};

    //Read event from S3
    let body;
    let evt = await this.s3Mgr.read(mnid, eventId);

    try {
      body = JSON.parse(evt);
    } catch (e) {
      throw "error in eventMgr.read" + e.message();
    }
    //Fix old events full jwt payload
    if (body.iss && body.event) {
      body = body.event;
    }

    // Add event hash to the response
    envelope.hash = eventId;
    envelope.event = body;

    return envelope;
  }

  async store(mnid, eventId, eventData) {
    //Store eventData in mnid/eventId.json
    await this.s3Mgr.store(mnid, eventId, JSON.stringify(eventData));

    //Add eventId to mnid/index.json
    let index = (await this.getIndex(mnid)) || [];
    index = [...index, eventId];
    await this.s3Mgr.store(mnid, "index.json", JSON.stringify(index));

    return index;
  }

  async delete(mnid, eventId) {
    if (!mnid) throw "no mnid";

    let index = await this.getIndex(mnid);
    if (eventId) {
      //delete a single event from storage
      await this.s3Mgr.delete(mnid, eventId);
      //remove eventId from mnix/index.json
      index = index.filter(item => item !== eventId);
      await this.s3Mgr.store(mnid, "index.json", JSON.stringify(index));
    } else {
      //remove all of the events (the index)
      await this.s3Mgr.deleteMultiple(
        mnid,
        index.map(item => {
          return { Key: item };
        })
      );
      await this.s3Mgr.store(mnid, "index.json", JSON.stringify({}));
    }

    return;
  }
}

module.exports = EventMgr;
