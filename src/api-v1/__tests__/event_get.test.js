const EventGetHandler = require('../event_get');
const UportMgr = require('../../lib/uPortMgr');

describe('EventGetHandler', () => {

    let sut;
    let evt = {
        type: "ADD_OWN_CLAIMS",
        address: "2ooxJ6wWuxQ14iihQMM4sssereWcPE4sWQH",
        claims: {
            "name": "Pelle Braendgaard Recovery",
            "email": null,
            "country": null,
            "avatar": null,
            "phone": null
        }
    }
    let evtIndex = [
      "QmRqAU4MGHrm7sj89UPwZZ2sfJ2suL758hc8mTyB1sfQ6r",
      "QmRWjSDMuMPuPvysjddGLxZH88Rt3v316bA1S7tFMzXP6A",
      "QmNzA2Y2u6Q1GVwo6XzHP9gBcfzxohbGU7tfPAGZGZ4E4G",
      "QmdVmAQ8SEc1xDY3sCAsGxQeYJcwZ84adnfDgGmvZsQsFY",
      "QmbgRnNicPvTGApVhaY59YTtyNJkWHh6mDiXX5cHhiUoiP",
      "Qmef2P32j5jMwjhkZ2L3a8qvETeTCxtRiGYLkD3ZmLAbB2",
      "QmSBSkvrsqzi5P3fVYYUsNMXZVKuVGtKbD9HkAZkRxbMPQ",
      "QmWuk4syE82P4ut266A49MaNoGoQcwg8XTQkTkKGg3fpVH"
    ]
    let evtFrom = "QmNzA2Y2u6Q1GVwo6XzHP9gBcfzxohbGU7tfPAGZGZ4E4G"
    let uportMgrMock = new UportMgr();
    let eventMgrMock = {
        lastId: jest.fn(),
        getEventsFrom: jest.fn(() => { return Promise.resolve( evtIndex.slice(2,2+6) ) }),
        getIndex: jest.fn(() => { return Promise.resolve( evtIndex ) }),
        read: jest.fn(() => {
            return Promise.resolve(evt) })
    }
    let validToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiIyb294SjZ3V3V4UTE0aWloUU1NNHNzc2VyZVdjUEU0c1dRSCIsImlhdCI6MTUxNTcwMTA5OSwicHJldmlvdXMiOiJRbVJNdmdMSENMYmJFck5YRkgzeWJhNW1wVms2NHV5U1JBaXNNYnAyQVV0RDNKIiwiZXhwIjoxNTE1Nzg3NDk5fQ._ki2ihwOIclqCXShjbh2J0A3mNw3uHnjV5UlB4J6Y7pCImc413_wxzCP1wjQ9tN1Rfzih7GeDvL3huWUy2t9Mg"
    let eventId = "QmUVu19cZBLyHver2Aa77RMuwBnsDKSUdpmjqBu86L9dBG"

    beforeAll(() => {
        sut = new EventGetHandler(uportMgrMock, eventMgrMock);
    });

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('handle null event', done => {
        sut.handle({}, {}, (err, res) => {
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toBeDefined()
            done();
        })
    });

    test('handle empty header', done => {
        sut.handle({ headers: "{}" }, {}, (err, res) => {
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toEqual('no authorization header')
            done();
        })
    })

    test('handle malformed auth header', done => {
        sut.handle({ headers:{Authorization: 'Token'} }, {}, (err, res) => {
            expect(err).not.toBeNull()
            expect(err.code).toEqual(401)
            expect(err.message).toEqual('Format is Authorization: Bearer [token]')
            done();
        })
    })

    test('handle mispelled Bearer, in auth', done => {
        sut.handle({ headers:{Authorization: 'Bier Token'} }, {}, (err, res) => {
            expect(err).not.toBeNull()
            expect(err.code).toEqual(401)
            expect(err.message).toEqual('Format is Authorization: Bearer [token]')
            done();
        })
    })

    test('handle invalid token', done => {
        sut.handle({ headers:{Authorization: 'Bearer asdf'} }, {}, (err, res) => {
            expect(err).not.toBeNull()
            expect(err.code).toEqual(401)
            expect(err.message).toEqual('Invalid token')
            done();
        })
    })

    test('handle valid token', done => {
      let mockedDate = new Date('2018-01-12');
      Date.now = jest.genMockFunction().mockReturnValue(mockedDate)
        sut.handle({ headers: { Authorization: 'Bearer '+validToken } }, {}, (err, res) => {
            expect(err).toBeNull()
            expect(res).not.toBeNull()
            done();
        })
    })

    test('get paginated events', done => {
      let mockedDate = new Date('2018-01-12');
      Date.now = jest.genMockFunction().mockReturnValue(mockedDate)
      sut.eventMgr.read = jest.fn(() => {
        return Promise.resolve(evt)
      })
      sut.handle({
        headers: { Authorization: 'Bearer '+validToken },
        page: 2,
        per_page: 2
      }, {}, (err, res) => {
        expect(err).toBeNull()
        expect(res.total).toEqual(6)
        expect(res.events).not.toBeNull()
        expect(res.events.length).toEqual(2)
        done();
      })
    })

    test('get single event', done => {
      let mockedDate = new Date('2018-01-12');
      Date.now = jest.genMockFunction().mockReturnValue(mockedDate)
      sut.eventMgr.read = jest.fn(() => {
        return Promise.resolve(evt)
      })
      sut.handle({
        headers: { Authorization: 'Bearer '+validToken },
        pathParameters: {id: eventId}
      }, {}, (err, res) => {
        expect(err).toBeNull()
        expect(res).toEqual({events: evt})
        done();
      })
    })

    test('handle pagination', done => {
      let index = [1,2,3,4,5,6,7,8,9]
      sut.paginate(index, 2, 2)
      .then((resp)=> {
        expect(resp).toEqual([3,4])
        done();
      })
    })

});
