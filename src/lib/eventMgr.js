
class EventMgr {
    
    constructor(s3Mgr) {
        this.s3Mgr=s3Mgr;
    }


    async lastId(mnid){
        if(!mnid) throw('no mnid') 

        //Get in S3
        
        return null;
    }

}

module.exports = EventMgr;