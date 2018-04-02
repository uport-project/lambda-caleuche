const AWS = require("aws-sdk");

class S3Mgr {
  constructor() {
    AWS.config.update({ region: "us-west-2" });
    this.s3 = new AWS.S3({ apiVersion: "2006-03-01" });
    this.bucket = null;
  }

  isSecretsSet() {
    return this.bucket !== null;
  }

  setSecrets(secrets) {
    this.bucket = secrets.BUCKET;
  }

  async read(key, filename, createIfNotExists = false) {
    let fullKey = key + "/" + filename;
    let params = {
      Bucket: this.bucket,
      Key: fullKey
    };
    let obj = await this.s3.getObject(params).promise();
    console.log(obj.Body.toString("utf-8"));
    return obj.Body.toString("utf-8");
  }

  async store(key, filename, data) {
    if (!key) throw "no key";
    if (!filename) throw "no filename";
    if (!data) throw "no data";
    if (!this.bucket) throw "no bucket set";

    //Store event (a json object) in S3
    let fullKey = key + "/" + filename;
    let params = {
      Bucket: this.bucket,
      Key: fullKey,
      Body: data
    };
    let obj = await this.s3.putObject(params).promise();
    console.log(obj);
    return obj;
  }

  async delete(key, filename) {
    if (!key) throw "no key";
    if (!filename) throw "no filename";
    if (!this.bucket) throw "no bucket set";

    let fullKey = key + "/" + filename;
    let params = {
      Bucket: this.bucket,
      Key: fullKey,
      Body: data
    };
    let data = await this.s3.deleteObject(params).promise();
    console.log(data);
    return data;
  }

  async deleteMultiple(key, objList) {
    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property
    if (!key) throw "no key";
    if (!objList) throw "no object list";
    if (!this.bucket) throw "no bucket set";
    let params = {
      Bucket: this.bucket,
      Delete: { Objects: index, Quiet: true }
    };
    let data = await this.s3.deleteObjects(params).promise();
    console.log(data);
    return data;
  }
}

module.exports = S3Mgr;
