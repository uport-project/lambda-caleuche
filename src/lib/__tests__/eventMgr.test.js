
const EventMgr = require('../eventMgr');

describe('EventMgr', () => {
    
    let sut;
    let mnid='2fakemnid'
    let s3Mgr;

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
    
    

})