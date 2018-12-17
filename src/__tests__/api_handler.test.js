import AWS from "aws-sdk";
import MockAWS from "aws-sdk-mock";
MockAWS.setSDKInstance(AWS);

const apiHandler = require('../api_handler');
let eventToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1MTU3MDEwOTYsInByZXZpb3VzIjoiUW1SVVVxcmlBMzRwVnYzSEtROVFBanFmUExIOENEbUNudXJyalBaaXIydDNmQiIsImV2ZW50Ijp7InR5cGUiOiJBRERfQ09OTkVDVElPTiIsImFkZHJlc3MiOiIyb3pzRlFXQVU3Q3BIWkxxdTJ3U1liSkZXekROQjI2YW9DRiIsImNvbm5lY3Rpb25UeXBlIjoiY29udHJhY3RzIiwiY29ubmVjdGlvbiI6IjB4MmNjMzE5MTJiMmIwZjMwNzVhODdiMzY0MDkyM2Q0NWEyNmNlZjNlZSJ9LCJpc3MiOiJkaWQ6ZXRocjoweDhlNWE0OWQ5ZTViYWMxODE2OTM2MGY5N2RkODlkYjRjNWQ3YTExYTEifQ.sm7DyTno-5_5WBndXSf3U3rq4XTmhyWM_wmePX9ZHXxpUW2NJtUKexIlyGFVrO3onN0qGkE1-o0Aec4un7TW6AE';

describe('apiHandlerWithEncryptedSecret', () => {

  beforeAll(() => {
    MockAWS.mock("KMS", "decrypt", Promise.resolve({Plaintext: "{}"}));
    process.env.SECRETS="badSecret";
  });

  test('event_post()', done => {
    apiHandler.event_post({},{},(err,res)=>{
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    })
  });

  test('event_get()', done => {
    apiHandler.event_get({},{},(err,res)=>{
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    })
  });

  test('event_delete()', done => {
    apiHandler.event_delete({},{},(err,res)=>{
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    })
  });

  afterAll(() => {
    process.env.SECRETS = null;
    MockAWS.restore();
  })
});

describe('apiHandlerDecryptionError', () => {

  beforeAll(()=>{
    MockAWS.mock("KMS", "decrypt", Promise.reject("fail"));
    process.env.SECRETS="badSec";
  });

  test('event_post()WithFailedDecryption', done => {
    apiHandler.event_post({},{},(err,res)=>{
      expect(err).not.toBeNull();
      expect(res).toBeNull();

      done();
    })
  });

  afterAll(() => {
    process.env.SECRETS=null;
  });
});

describe('apiHandlerWithUnencryptedSecret', () => {

  beforeAll(() => {
    MockAWS.mock("KMS", "decrypt", Promise.resolve({Plaintext: "{}"}));
    process.env.SECRETS = '{"Plaintext": ""}';
  });

  test('event_post()', done => {
    apiHandler.event_post({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    })
  });

  test('event_get()', done => {
    apiHandler.event_get({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    })
  });

  test('event_delete()', done => {
    apiHandler.event_delete({}, {}, (err, res) => {
      expect(err).toBeNull();
      expect(res).not.toBeNull();

      done();
    })
  });
});

