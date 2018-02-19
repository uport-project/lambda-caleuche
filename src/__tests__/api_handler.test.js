import AWS from "aws-sdk";
import MockAWS from "aws-sdk-mock";
MockAWS.setSDKInstance(AWS);

const apiHandler = require('../api_handler');

describe('apiHandler', () => {


    beforeAll(()=>{
        MockAWS.mock("KMS", "decrypt", Promise.resolve({Plaintext:"{}"}));
        process.env.SECRETS="badSecret"
    })

    test('event_post()', done => {
        apiHandler.event_post({},{},(err,res)=>{
            expect(err).toBeNull()
            expect(res).not.toBeNull()

            done();
        })
    });

});
