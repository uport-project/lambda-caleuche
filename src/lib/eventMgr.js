
class EventMgr {
    
    constructor(s3Mgr) {
        this.s3Mgr=s3Mgr;
    }


    async lastId(mnid){
        if(!mnid) throw('no mnid') 

        //Get from mnid/index.json
        
        return null;
    }

    async getId(eventData){
        //Calc hash of eventData (IPFS style please)
        return 1;
    }

    async store(mnid,eventId,eventData){
        //Store eventData in mnid/eventId.json

        //Add eventId to mnid/index.json

        
        return;
    }

}

module.exports = EventMgr;