'use strict'
const AWS = require('aws-sdk');

const S3Mgr = require('./lib/s3Mgr');
const EventMgr = require('./lib/eventMgr');
const UportMgr = require('./lib/uPortMgr');

const V1EventPostHandler = require('./api-v1/event_post');
const V1EventGetHandler = require('./api-v1/event_get');

let s3Mgr = new S3Mgr();
let eventMgr = new EventMgr(s3Mgr);
let uPortMgr = new UportMgr();

let v1EventPostHandler = new V1EventPostHandler(uPortMgr,eventMgr);
module.exports.event_post = (event, context, callback) => { preHandler(v1EventPostHandler, event,context,callback) }

let v1EventGetHandler = new V1EventGetHandler(uPortMgr, eventMgr);
module.exports.event_get = (event, context, callback) => { preHandler(v1EventGetHandler, event, context, callback) }

const preHandler = (handler,event,context,callback) =>{
  console.log(event)
  if(!s3Mgr.isSecretsSet() ){
    const kms = new AWS.KMS();
    kms.decrypt({
      CiphertextBlob: Buffer(process.env.SECRETS, 'base64')
    }).promise().then(data => {
      const decrypted = String(data.Plaintext)
      s3Mgr.setSecrets(JSON.parse(decrypted))
      doHandler(handler,event,context,callback)
    })
  }else{
    doHandler(handler,event,context,callback)
  }
}

const doHandler = (handler,event,context,callback) =>{
  handler.handle(event,context,(err,resp)=>{
    let response;
    if(err==null){
      response = {
          statusCode: 200,
          body: JSON.stringify({
            status: 'success',
            data: resp
          })
        }
    }else{
      //console.log(err);
      let code=500;
      if(err.code) code=err.code;
      let message=err;
      if(err.message) message=err.message;

      response = {
        statusCode: code,
        body: JSON.stringify({
          status: 'error',
          message: message
        })
      }
    }

    callback(null, response)
  })

}
