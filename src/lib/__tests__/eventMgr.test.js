const EventMgr = require("../eventMgr");

describe("EventMgr", () => {
  let sut;
  let mnid = "2fakemnid";
  
  let evtFrom = "QmNzA2Y2u6Q1GVwo6XzHP9gBcfzxohbGU7tfPAGZGZ4E4G";
  let singleEventData = { name: "Cristobal" };
  let singleOldEventData = {
    iss: evtFrom,
    event: { name: "Cristobal" }
  };
  
  let singleEventHash = "QmdNq6fsVZgmHoUknGHdwrm27uYBrTDBfLw2ZWsppyD27y";
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
  
  let s3MgrMock = {
    read: jest.fn(() => {
      return Promise.resolve(JSON.stringify(evtIndex));
    }),
    store: jest.fn(() => {
      return Promise.resolve("ok");
    }),
    delete: jest.fn(),
    deleteMultiple: jest.fn()
  };

  beforeAll(() => {
    sut = new EventMgr(s3MgrMock);
  });

  test("default constructor", () => {
    expect(sut).not.toBeUndefined();
  });


  describe("getIndex()", () => {
    test("no mnid", done => {
      sut
        .getIndex(null)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no mnid");
          done();
        });
    });

    test("fail s3Mgr.read", done => {
      s3MgrMock.read.mockImplementationOnce( () => {
        return Promise.reject("fail")
      });
      sut
        .getIndex(mnid)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("fail");
          done();
        });
    });

    test("fail s3Mgr.read with NoSuchKey", done => {
      s3MgrMock.read.mockImplementationOnce( () => {
        return Promise.reject({code: "NoSuchKey"})
      });
      sut.getIndex(mnid)
        .then(resp => {
          expect(resp).toEqual([]);
          done();
        })
    });
    
    test("happy path", done => {
      sut.getIndex(mnid).then(resp => {
        expect(resp).toEqual(evtIndex);
        done();
      });
    });
  
  });

  describe("getEventsFrom()", () => {
    test("no mnid", done => {
      sut
        .getEventsFrom(null, evtFrom)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no mnid");
          done();
        });
    });
  
    test("no eventId", done => {
      sut.getEventsFrom(mnid, null).then(resp => {
        expect(resp).toEqual(evtIndex);
        expect(resp.length).toEqual(8);
        done();
      });
    });
  
    test("happy path", done => {
      sut.getEventsFrom(mnid, evtFrom).then(resp => {
        expect(resp).toEqual(evtIndex.slice(3, 3 + 6));
        expect(resp.length).toEqual(5);
        done();
      });
    });
  });

  describe("lastId()", () =>{
    
    test("no mnid", done => {
      sut
        .lastId(null)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no mnid");
          done();
        });
    });

    test("happy path", done => {
      sut.lastId(mnid).then(resp => {
        expect(resp).toEqual("QmWuk4syE82P4ut266A49MaNoGoQcwg8XTQkTkKGg3fpVH");
        done();
      });
    });

    test("happy path with no index", done => {
      s3MgrMock.read.mockImplementationOnce( () => {
        return Promise.reject({code: "NoSuchKey"})
      });
      sut.lastId(mnid).then(resp => {
        expect(resp).toBeNull();
        done();
      });
    });
  })

  

  test("getId()", done => {
    sut.getId(singleEventData).then(resp => {
      expect(resp).toEqual(singleEventHash);
      done();
    });
  });


  describe("read()", () => {

    test("no mnid", done => {
      sut
        .read(null,null)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no mnid");
          done();
        });
    });

    test("no eventId", done => {
      sut
        .read(mnid,null)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no eventId");
          done();
        });
    });

    test("fail s3Mgr.read", done => {
      s3MgrMock.read.mockImplementationOnce( () => {
        return Promise.reject("fail")
      });
      sut
        .read(mnid,singleEventHash)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("fail");
          done();
        });
    });

    test("old event fix", done => {
      s3MgrMock.read.mockImplementationOnce(() => {
        return Promise.resolve(JSON.stringify(singleOldEventData));
      });
  
      let mockEnvelope = {
        hash: singleEventHash,
        event: singleEventData
      };
  
      sut.read(mnid, singleEventHash).then(resp => {
        expect(resp).toEqual(mockEnvelope);
        done();
      });
    });

    
    test("happy path", done => {
      s3MgrMock.read.mockImplementationOnce(() => {
        return Promise.resolve(JSON.stringify(singleEventData));
      });
  
      let mockEnvelope = {
        hash: singleEventHash,
        event: singleEventData
      };
  
      sut.read(mnid, singleEventHash).then(resp => {
        expect(resp).toEqual(mockEnvelope);
        done();
      });
    });
  
  })

  describe("store()", () => {

    test("fail s3Mgr.store(eventData)", done => {
      s3MgrMock.store.mockImplementationOnce( () => {
        return Promise.reject("fail")
      });
      sut
      .store(mnid, singleEventHash, singleEventData)
      .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("fail");
          done();
        });
    });

    test("fail s3Mgr.read(index)", done => {
      s3MgrMock.read.mockImplementationOnce( () => {
        return Promise.reject("fail")
      });
      sut
      .store(mnid, singleEventHash, singleEventData)
      .then(resp => {
        expect(resp).toEqual([singleEventHash]);
        done();
      });
    });


    test("happy path", done => {
      sut
        .store(mnid, singleEventHash, singleEventData)
        .then(resp => {
          expect(resp).toEqual([...evtIndex, singleEventHash]);
          done();
        });
    });
  
  })
  
  describe("delete()", () => {

    test("no mnid", done => {
      sut.delete(null, null)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no mnid");
          done();
        });
    });
    
    test("happy path single", done => {
      sut.delete(mnid, evtFrom).then(resp => {
        expect(s3MgrMock.delete).toBeCalled();
        expect(s3MgrMock.delete).toBeCalledWith(mnid, evtFrom);
        done();
      });
    });
  
    test("happy path multiple", done => {
      sut.delete(mnid).then(resp => {
        expect(s3MgrMock.deleteMultiple).toBeCalled();
        expect(s3MgrMock.deleteMultiple).toBeCalledWith(
          mnid,
          evtIndex.map(item => {
            return { Key: item };
          })
        );
        done();
      });
    });
  



  })


});
