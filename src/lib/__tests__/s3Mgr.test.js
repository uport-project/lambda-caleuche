const S3Mgr = require("../s3Mgr");

describe("S3Mgr", () => {
  let sut;
  let mnid = "2fakemnid";
  let eventId = "2eventId";
  let bucket = "fakebucket";
  let event = {
    previous: "previousId",
    event: "event data"
  };
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
    sut.s3 = {
      deleteObjects: jest.fn(() => {
        return Promise.resolve("ok");
      })
    };
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("is isSecretsSet", () => {
    let secretSet = sut.isSecretsSet();
    expect(secretSet).toEqual(false);
  });

  test("store() no mnid", done => {
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

  test("store() no eventId", done => {
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

  test("store() no event", done => {
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

  test("store() no bucket set", done => {
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

  test("delete() no mnid", done => {
    sut
      .store(null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no key");
        done();
      });
  });

  test("delete() no filename", done => {
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

  test("delete() no bucket set", done => {
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

  test("deleteMultiple() no  key", done => {
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

  test("deleteMultiple() no object list", done => {
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
});
