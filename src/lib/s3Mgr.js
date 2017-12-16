const AWS = require('aws-sdk');

class S3Mgr {
    
    constructor() {
        AWS.config.update({region: 'us-west-2'});
        this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
        this.bucket=null;
    }

    isSecretsSet(){
        return (this.bucket !== null);
    }

    setSecrets(secrets){
        this.bucket=secrets.BUCKET;
    }

    async read(key,filename,createIfNotExists=false){
        let fullKey=key+"/"+filename
        let params = {
            Bucket: this.bucket, 
            Key: fullKey
        };
        let obj=await this.s3.getObject(params).promise()
        console.log(obj.Body)
        return obj.Body; 
    }


    async store(key,filename,data){
        if(!key) throw('no key')    
        if(!filename) throw('no filename')
        if(!data) throw('no data')
        if(!this.bucket) throw('no bucket set')


        //Store event (a json object) in S3
        let fullKey=key+"/"+filename
        let params = {
            Bucket: this.bucket, 
            Key: fullKey,
            Body: data
        };
        let obj=await this.s3.putObject(params).promise()
        console.log(obj)
        return obj
    }

}

module.exports = S3Mgr;