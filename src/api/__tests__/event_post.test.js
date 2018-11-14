const EventPostHandler = require('../event_post');

describe('EventPostHandler', () => {


    let sut;
    let eventToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1MTU3MDEwOTYsInByZXZpb3VzIjoiUW1SVVVxcmlBMzRwVnYzSEtROVFBanFmUExIOENEbUNudXJyalBaaXIydDNmQiIsImV2ZW50Ijp7InR5cGUiOiJBRERfQ09OTkVDVElPTiIsImFkZHJlc3MiOiIyb3pzRlFXQVU3Q3BIWkxxdTJ3U1liSkZXekROQjI2YW9DRiIsImNvbm5lY3Rpb25UeXBlIjoiY29udHJhY3RzIiwiY29ubmVjdGlvbiI6IjB4MmNjMzE5MTJiMmIwZjMwNzVhODdiMzY0MDkyM2Q0NWEyNmNlZjNlZSJ9LCJpc3MiOiJkaWQ6ZXRocjoweDhlNWE0OWQ5ZTViYWMxODE2OTM2MGY5N2RkODlkYjRjNWQ3YTExYTEifQ.sm7DyTno-5_5WBndXSf3U3rq4XTmhyWM_wmePX9ZHXxpUW2NJtUKexIlyGFVrO3onN0qGkE1-o0Aec4un7TW6AE'
    const validTokenPayload = {
        "iat": 1515701096,
        "previous": "QmRUUqriA34pVv3HKQ9QAjqfPLH8CDmCnurrjPZir2t3fB",
        "event": {
          "type": "ADD_CONNECTION",
          "address": "2ozsFQWAU7CpHZLqu2wSYbJFWzDNB26aoCF",
          "connectionType": "contracts",
          "connection": "0x2cc31912b2b0f3075a87b3640923d45a26cef3ee"
        },
        "iss": "did:ethr:0x8e5a49d9e5bac18169360f97dd89db4c5d7a11a1"
      }


    let uPortMgrMock = {
        verifyToken: jest.fn( (token) => {
          return Promise.resolve({ payload: validTokenPayload })
        })
      }
      
    let eventMgrMock={
      lastId: jest.fn(() => {
        return Promise.resolve("QmRUUqriA34pVv3HKQ9QAjqfPLH8CDmCnurrjPZir2t3fB")
      }),
      getId: jest.fn(() => {
        return Promise.resolve("QmNzA2Y2u6Q1GVwo6XzHP9gBcfzxohbGU7tfPAGZGZ4E4G")
      }),
      store: jest.fn(() => { return Promise.resolve("OK") })
    };
    

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
        uPortMgrMock.verifyToken.mockImplementationOnce( (token) => {
            return Promise.reject("bad token")
        });
        sut.handle({body: JSON.stringify({event_token: 'a.s.df'})},{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(401)
            expect(err.message).toEqual('Invalid token')
            done();
        })
    })

    test('handle no event', done => {
        uPortMgrMock.verifyToken.mockImplementationOnce( (token) => {
            return Promise.resolve({ payload: {} })
        });
        sut.handle({ body: JSON.stringify({ event_token: eventToken })}, {}, (err, res) => {
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toEqual('no event')
            done();
        })
    })

    test('handle failed eventMgr.lastId', done => {
        eventMgrMock.lastId.mockImplementationOnce( () => {
            return Promise.reject({ message: "fail"})
        });
        sut.handle({ body: JSON.stringify({ event_token: eventToken })}, {}, (err, res) => {
            expect(err).not.toBeNull()
            expect(err.code).toEqual(500)
            expect(err.message).toEqual('fail')
            done();
        })
    })

    test('handle bad lastId', done => {
        eventMgrMock.lastId.mockImplementationOnce( () => {
            return Promise.resolve("QmOtherPrevious")
        });
        sut.handle({ body: JSON.stringify({ event_token: eventToken })}, {}, (err, res) => {
            expect(err).not.toBeNull()
            expect(err.code).toEqual(409)
            expect(err.message).toEqual('previous is not the latest id')
            done();
        })
    })

    test('handle failed eventMgr.getId', done => {
        eventMgrMock.getId.mockImplementationOnce( () => {
            return Promise.reject({ message: "fail getId"})
        });
        sut.handle({ body: JSON.stringify({ event_token: eventToken })}, {}, (err, res) => {
            expect(err).not.toBeNull()
            expect(err.code).toEqual(500)
            expect(err.message).toEqual('fail getId')
            done();
        })
    })

    test('handle failed eventMgr.store', done => {
        eventMgrMock.store.mockImplementationOnce( () => {
            return Promise.reject({ message: "fail store"})
        });
        sut.handle({ body: JSON.stringify({ event_token: eventToken })}, {}, (err, res) => {
            expect(err).not.toBeNull()
            expect(err.code).toEqual(500)
            expect(err.message).toEqual('fail store')
            done();
        })
    })

    test('happy path', done => {
        sut.handle({ body: JSON.stringify({ event_token: eventToken })}, {}, (err, res) => {
            expect(err).toBeNull()
            expect(res).toEqual({id: "QmNzA2Y2u6Q1GVwo6XzHP9gBcfzxohbGU7tfPAGZGZ4E4G" })
            done();
        })
    })



});
