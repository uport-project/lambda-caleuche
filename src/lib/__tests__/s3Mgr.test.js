import AWS from "aws-sdk";
import MockAWS from "aws-sdk-mock";
MockAWS.setSDKInstance(AWS);
const S3Mgr = require("../s3Mgr");

MockAWS.mock('S3', 'getObject', () => {});
MockAWS.mock('S3', 'putObject', () => {});
MockAWS.mock('S3', 'deleteObject', () => {});
MockAWS.mock('S3', 'deleteObjects', () => {});
MockAWS.restore('S3', 'getObject');
MockAWS.restore('S3', 'putObject');
MockAWS.restore('S3', 'deleteObject');
MockAWS.restore('S3', 'deleteObjects');

describe("S3Mgr", () => {
  let sut;
  let mnid = "2fakemnid";
  let eventId = "2eventId";
  let bucket = "fakebucket";
  let event = '{"previous": "previousId", "event": "event data"}';
  let eventList = [{
      Key: eventId
    },
      {
        Key: eventId
      }
    ];

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

  beforeAll(() => {
    sut = new S3Mgr();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("is isSecretsSet", () => {
    let secretSet = sut.isSecretsSet();
    expect(secretSet).toEqual(false);
  });

  describe("no bucket set", () => {

    test("read()", done => {
      sut
        .read(mnid, eventId)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no bucket set");
          done();
        });
    });

    test("store()", done => {
      sut
        .store(mnid, eventId, event)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no bucket set");
          done();
        });
    });

    test("delete()", done => {
      sut
        .delete(mnid, eventId)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no bucket set");
          done();
        });
    });

    test("deleteMultiple()", done => {
      sut
        .deleteMultiple(mnid, [])
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no bucket set");
          done();
        });
    });
  })

  test("setSecrets", () => {
    expect(sut.isSecretsSet()).toEqual(false);
    sut.setSecrets({ BUCKET: bucket });
    expect(sut.isSecretsSet()).toEqual(true);
    expect(sut.bucket).not.toBeUndefined();
    expect(sut.bucket).toEqual(bucket);
  });


  describe("read()", () => {
    
    test("no key", done => {
      sut
        .read(null, eventId)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no key");
          done();
        });
    });
  
    test("no filename", done => {
      sut
        .read(mnid, null)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no filename");
          done();
        });
    });

    test("AWS credentials error", done => {
      sut
        .read(mnid, eventId)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("credentials not passed");
          done();
        });
    });
  
  });

  

  describe("store()", () => {

    test("no key", done => {
      sut
        .store(null, eventId, event)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no key");
          done();
        });
    });
  
    test("no filename", done => {
      sut
        .store(mnid, null, event)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no filename");
          done();
        });
    });
  
    test("no data", done => {
      sut
        .store(mnid, eventId, null)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no data");
          done();
        });
    });

    test("AWS credentials error", done => {
      sut
        .store(mnid, eventId, event)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("credentials not passed");
          done();
        });
    });
      
  });


  describe("delete()", () => {

    test("no key", done => {
      sut
        .delete(null, eventId)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no key");
          done();
        });
    });
  
    test("no filename", done => {
      sut
        .delete(mnid, null)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no filename");
          done();
        });
    });

    test("AWS credentials error", done => {
      sut
        .delete(mnid, eventId)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("credentials not passed");
          done();
        });
    });

  });

  describe("deleteMultiple()", () => {

    test("no key", done => {
      sut
        .deleteMultiple()
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no key");
          done();
        });
    });
  
    test("no object list", done => {
      sut
        .deleteMultiple(mnid)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("no object list");
          done();
        });
    });

    test("AWS credentials error", done => {
      sut
        .deleteMultiple(mnid, eventList)
        .then(resp => {
          fail("shouldn't return");
          done();
        })
        .catch(err => {
          expect(err).toEqual("credentials not passed");
          done();
        });
    });
  
  });

  describe("Every operation without error", () => {

    beforeEach(() => {
      MockAWS.mock("S3", "getObject", Promise.resolve({ Body: 'data' }));
      MockAWS.mock("S3", "putObject", Promise.resolve({ Body: 'data' }));
      MockAWS.mock("S3", "deleteObject", Promise.resolve({}));
      MockAWS.mock('S3', 'deleteObjects', Promise.resolve({}));
      sut.setSecrets({ BUCKET: bucket });
    });

    test("read without error", done => {
      sut
        .read(mnid, eventId)
        .then(resp => {
          expect(resp).toEqual('data');
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });

    test("store without error", done => {
      sut
        .store(mnid, eventId, event)
        .then(resp => {
          expect(resp).toEqual({ Body: 'data'});
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });

    test("delete without error", done => {
      sut
        .delete(mnid, eventId)
        .then(resp => {
          expect(resp).not.toBeNull();
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });

    test("deleteMultiple without error", done => {
      sut
        .deleteMultiple(mnid, eventList)
        .then(resp => {
          expect(resp).not.toBeNull();
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });

    afterAll(() => {
      MockAWS.restore();
    })
  });

});
