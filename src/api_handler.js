"use strict";
const AWS = require("aws-sdk");

const S3Mgr = require("./lib/s3Mgr");
const EventMgr = require("./lib/eventMgr");
const UportMgr = require("./lib/uPortMgr");

const EventPostHandler = require("./api/event_post");
const EventGetHandler = require("./api/event_get");
const EventDeleteHandler = require("./api/event_delete");

let s3Mgr = new S3Mgr();
let eventMgr = new EventMgr(s3Mgr);
let uPortMgr = new UportMgr();
let setSecret = '';

const doHandler = (handler, event, context, callback) => {
  handler.handle(event, context, (err, resp) => {
    let response;
    if (err == null) {
      response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Headers": "snaphuntjwttoken",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
        },
        body: JSON.stringify({
          status: "success",
          data: resp
        })
      };
    } else {
      let code = err.code;
      let message = err.message;

      response = {
        statusCode: code,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Headers": "snaphuntjwttoken",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
        },
        body: JSON.stringify({
          status: "error",
          message: message
        })
      };
    }

    callback(null, response);
  });
};

const preHandler = (handler, event, context, callback) => {
  //console.log(event)
  if (!s3Mgr.isSecretsSet() || setSecret !== process.env.SECRETS) {
    const kms = new AWS.KMS();
    setSecret = process.env.SECRETS;
    try {
      // If SECRETS is unencrypted, it will be in JSON format
      let secrets = JSON.parse(process.env.SECRETS);
      s3Mgr.setSecrets(secrets);
      doHandler(handler, event, context, callback);
    } catch (err) {
        kms
        .decrypt({
          CiphertextBlob: Buffer(process.env.SECRETS, "base64")
        })
        .promise()
        .then(data => {
          const decrypted = String(data.Plaintext);
          s3Mgr.setSecrets(JSON.parse(decrypted));
          doHandler(handler, event, context, callback);
        })
        .catch(err => {
          callback(err, null);
        });
    }
  } else {
    doHandler(handler, event, context, callback);
  }
};

let eventPostHandler = new EventPostHandler(uPortMgr, eventMgr);
module.exports.event_post = (event, context, callback) => {
  preHandler(eventPostHandler, event, context, callback);
};

let eventGetHandler = new EventGetHandler(uPortMgr, eventMgr);
module.exports.event_get = (event, context, callback) => {
  preHandler(eventGetHandler, event, context, callback);
};

let eventDeleteHandler = new EventDeleteHandler(uPortMgr, eventMgr);
module.exports.event_delete = (event, context, callback) => {
  preHandler(eventDeleteHandler, event, context, callback);
};
