const EventPostHandler = require('../event_post');
const UportMgr = require('../../lib/uPortMgr');

describe('EventPostHandler', () => {

    let sut;
    let uPortMgrMock = new UportMgr();
    let eventMgrMock={
      lastId: jest.fn(() => {
        return Promise.resolve("QmRUUqriA34pVv3HKQ9QAjqfPLH8CDmCnurrjPZir2t3fB")
      }),
      getId: jest.fn(() => {
        return Promise.resolve("QmNzA2Y2u6Q1GVwo6XzHP9gBcfzxohbGU7tfPAGZGZ4E4G")
      }),
      store: jest.fn(() => { return Promise.resolve("OK") })
    };
    let eventToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1MTU3MDEwOTYsInByZXZpb3VzIjoiUW1SVVVxcmlBMzRwVnYzSEtROVFBanFmUExIOENEbUNudXJyalBaaXIydDNmQiIsImV2ZW50Ijp7InR5cGUiOiJBRERfQ09OTkVDVElPTiIsImFkZHJlc3MiOiIyb3pzRlFXQVU3Q3BIWkxxdTJ3U1liSkZXekROQjI2YW9DRiIsImNvbm5lY3Rpb25UeXBlIjoiY29udHJhY3RzIiwiY29ubmVjdGlvbiI6IjB4MmNjMzE5MTJiMmIwZjMwNzVhODdiMzY0MDkyM2Q0NWEyNmNlZjNlZSJ9LCJpc3MiOiJkaWQ6ZXRocjoweDhlNWE0OWQ5ZTViYWMxODE2OTM2MGY5N2RkODlkYjRjNWQ3YTExYTEifQ.sm7DyTno-5_5WBndXSf3U3rq4XTmhyWM_wmePX9ZHXxpUW2NJtUKexIlyGFVrO3onN0qGkE1-o0Aec4un7TW6AE'

    beforeAll(() => {
      sut = new EventPostHandler(uPortMgrMock, eventMgrMock);
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('handle null body', done => {
        sut.handle({},{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toBeDefined()
            done();
        })
    });

    test('handle empty body', done => {
        sut.handle({body: "{}"},{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toEqual('no event_token')
            done();
        })
    })

    test('handle invalid token', done => {
        sut.handle({body: JSON.stringify({event_token: 'a.s.df'})},{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(401)
            expect(err.message).toEqual('Invalid token')
            done();
        })
    })

    test('handle valid token', done => {
      let mockedDate = new Date('2018-01-12');
      Date.now = jest.genMockFunction().mockReturnValue(mockedDate)

        sut.handle({ body: JSON.stringify({ event_token: eventToken })}, {}, (err, res) => {
            expect(err).toBeNull()
            expect(res).toEqual({id: "QmNzA2Y2u6Q1GVwo6XzHP9gBcfzxohbGU7tfPAGZGZ4E4G" })
            done();
        })
    })



});
