
class S3Mgr {
    
    constructor() {
        this.bucket=null;
    }

    isSecretsSet(){
        return (this.bucket !== null);
    }

    setSecrets(secrets){
        this.bucket=secrets.BUCKET;
    }


    async store(mnid,eventId,event){
        if(!mnid) throw('no mnid')    
        if(!eventId) throw('no eventId')
        if(!event) throw('no event')
        if(!this.bucket) throw('no bucket set')


        //Store event (a json object) in S3
        return
    }

}

module.exports = S3Mgr;