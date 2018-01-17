import multihash from 'multi-hash'
import SHA256  from 'crypto-js/sha256'

class EventMgr {

    constructor(s3Mgr) {
        this.s3Mgr=s3Mgr;
    }

    async getIndex(mnid){
        let index
        try{
            let rawIndex=await this.s3Mgr.read(mnid,'index.json')
            index=JSON.parse(rawIndex);
        }catch(err){
            if(err.code=='NoSuchKey'){
                index=[]
            }else{
                throw(err)
            }
        }
        return index;
    }

    async getEventsFrom(mnid, eventId){
      if(!mnid) throw('no mnid')
      if(!eventId) throw('no eventId')

      //Get from mnid/index.json
      let index=await this.getIndex(mnid);

      let hashedIndex = {}
      index.map(function(key,index) {
        hashedIndex[key] = index
      })
      let from = hashedIndex[eventId]
      return index.slice(from, from + index.length);
    }


    async lastId(mnid){
        if(!mnid) throw('no mnid')

        //Get from mnid/index.json
        let index=await this.getIndex(mnid);

        return index.length==0 ? null : index[index.length-1];
    }

    async getId(eventData){
        //Calc hash of eventData (IPFS style please)
        let hash=SHA256(JSON.stringify(eventData))
        let ipfsHash=multihash.encode(hash.toString());
        return ipfsHash;
    }

    async store(mnid,eventId,eventData){
        //Store eventData in mnid/eventId.json
        await this.s3Mgr.store(mnid,eventId,JSON.stringify(eventData))

        //Add eventId to mnid/index.json
        let index=await this.getIndex(mnid);
        index.push(eventId)
        await this.s3Mgr.store(mnid,'index.json',JSON.stringify(index))

        return;
    }

}

module.exports = EventMgr;
