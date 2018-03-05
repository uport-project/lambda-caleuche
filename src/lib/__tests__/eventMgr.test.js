
const EventMgr = require('../eventMgr');

describe('EventMgr', () => {

    let sut;
    let mnid='2fakemnid'
    let singleEventData = {name: "Cristobal"};
    let singleEventHash = "QmdNq6fsVZgmHoUknGHdwrm27uYBrTDBfLw2ZWsppyD27y"
    let evtIndex = [
      "QmRqAU4MGHrm7sj89UPwZZ2sfJ2suL758hc8mTyB1sfQ6r",
      "QmRWjSDMuMPuPvysjddGLxZH88Rt3v316bA1S7tFMzXP6A",
      "QmNzA2Y2u6Q1GVwo6XzHP9gBcfzxohbGU7tfPAGZGZ4E4G",
      "QmdVmAQ8SEc1xDY3sCAsGxQeYJcwZ84adnfDgGmvZsQsFY",
      "QmbgRnNicPvTGApVhaY59YTtyNJkWHh6mDiXX5cHhiUoiP",
      "Qmef2P32j5jMwjhkZ2L3a8qvETeTCxtRiGYLkD3ZmLAbB2",
      "QmSBSkvrsqzi5P3fVYYUsNMXZVKuVGtKbD9HkAZkRxbMPQ",
      "QmWuk4syE82P4ut266A49MaNoGoQcwg8XTQkTkKGg3fpVH"
    ];
    let evtFrom = "QmNzA2Y2u6Q1GVwo6XzHP9gBcfzxohbGU7tfPAGZGZ4E4G";
    let s3Mgr = {
        read: jest.fn()
    };

    beforeAll(() => {
        sut = new EventMgr(s3Mgr);
    });

    test('default constructor', () => {
        expect(sut).not.toBeUndefined();
    });


    test('lastId() with mnid', (done) =>{
      s3Mgr.read.mockImplementation(()=>{ return Promise.resolve(JSON.stringify(evtIndex)) })

        sut.lastId(mnid)
        .then((resp)=> {
            expect(resp).toEqual("QmWuk4syE82P4ut266A49MaNoGoQcwg8XTQkTkKGg3fpVH")
            done();
        })
    });

    test('lastId() no mnid', (done) =>{
        sut.lastId(null)
        .then((resp)=> {
            fail("shouldn't return"); done()
        })
        .catch( (err)=>{
            expect(err).toEqual('no mnid')
            done()
        })
    });

    test('getId()', (done) =>{
      sut.getId(singleEventData)
      .then((resp)=> {
        expect(resp).toEqual(singleEventHash)
        done();
      })
    });

    test('getIndex()', (done) =>{
      s3Mgr.read.mockImplementation(()=>{ return Promise.resolve(JSON.stringify(evtIndex)) })

      sut.getIndex(mnid)
      .then((resp)=> {
        expect(resp).toEqual(evtIndex)
        done();
      })
    });


    test('getEventsFrom() no mnid', (done) =>{
        sut.getEventsFrom(null, evtFrom)
        .then((resp)=> {
            fail("shouldn't return"); done()
        })
        .catch( (err)=>{
            expect(err).toEqual('no mnid')
            done()
        })
    });

    test('getEventsFrom() no eventId', (done) =>{
        sut.getEventsFrom(mnid, null)
        .then((resp)=> {
            expect(resp).toEqual(evtIndex)
            expect(resp.length).toEqual(8)
            done()
        })

    });

    test('getEventsFrom()', (done) =>{
      sut.getEventsFrom(mnid, evtFrom)
      .then((resp)=> {
        expect(resp).toEqual(evtIndex.slice(3,3+6))
        expect(resp.length).toEqual(5)
        done();
      })
    });


    test('read()', (done) =>{
      s3Mgr.read.mockImplementation(()=>{
          return Promise.resolve(JSON.stringify(singleEventData))
    })

      let mockEnvelope = {
        hash: singleEventHash,
        event: singleEventData
      }

      sut.read(mnid, singleEventHash)
      .then((resp)=> {
        expect(resp).toEqual(mockEnvelope)
        done();
      })
    });

})
