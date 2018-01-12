
const EventMgr = require('../eventMgr');

describe('EventMgr', () => {

    let sut;
    let mnid='2fakemnid'
    let s3Mgr;
    let eventData = {name: "Cristobal"};

    beforeAll(() => {
        sut = new EventMgr(s3Mgr);
    });

    test('default constructor', () => {
        expect(sut).not.toBeUndefined();
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
      sut.getId(eventData)
      .then((resp)=> {
        expect(resp).toEqual("QmdNq6fsVZgmHoUknGHdwrm27uYBrTDBfLw2ZWsppyD27y")
        done();
      })
    });



})
