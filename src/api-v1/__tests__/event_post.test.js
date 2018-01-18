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
    let eventToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiIyb294SjZ3V3V4UTE0aWloUU1NNHNzc2VyZVdjUEU0c1dRSCIsImlhdCI6MTUxNTcwMTA5NiwicHJldmlvdXMiOiJRbVJVVXFyaUEzNHBWdjNIS1E5UUFqcWZQTEg4Q0RtQ251cnJqUFppcjJ0M2ZCIiwiZXZlbnQiOnsidHlwZSI6IkFERF9PV05fQ0xBSU1TIiwiYWRkcmVzcyI6IjJvb3hKNndXdXhRMTRpaWhRTU00c3NzZXJlV2NQRTRzV1FIIiwiY2xhaW1zIjp7Im5hbWUiOiJQZWxsZSBCcmFlbmRnYWFyZCBSZWNvdmVyeSIsImVtYWlsIjpudWxsLCJjb3VudHJ5IjpudWxsLCJhdmF0YXIiOm51bGwsInBob25lIjpudWxsfX0sImV4cCI6MTUxNTc4NzQ5Nn0.2dEecb7Efs4UopA8l65zQG_cx2mqOLzWodMHEGIN_i61M_POCFAQR68QrmZNC_zv7xFv0HmE_CwWk30vcawyYQ'

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
