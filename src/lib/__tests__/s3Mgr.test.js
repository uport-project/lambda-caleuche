
const S3Mgr = require('../s3Mgr');

describe('S3Mgr', () => {

    let sut;
    let mnid='2fakemnid'
    let eventId='2eventId'
    let event={
        previous: 'previousId',
        event: 'event data'
    }

    beforeAll(() => {
        sut = new S3Mgr();
    });


    test('empty constructor', () => {
        expect(sut).not.toBeUndefined();
    });

    test('is isSecretsSet', () => {
        let secretSet=sut.isSecretsSet()
        expect(secretSet).toEqual(false);
    });

    test('store() no mnid', (done) =>{
        sut.store(null,eventId,event)
        .then((resp)=> {
            fail("shouldn't return"); done()
        })
        .catch( (err)=>{
            expect(err).toEqual('no key')
            done()
        })
    });

    test('store() no eventId', (done) =>{
        sut.store(mnid,null,event)
        .then((resp)=> {
            fail("shouldn't return"); done()
        })
        .catch( (err)=>{
            expect(err).toEqual('no filename')
            done()
        })
    });

    test('store() no event', (done) =>{
        sut.store(mnid,eventId,null)
        .then((resp)=> {
            fail("shouldn't return"); done()
        })
        .catch( (err)=>{
            expect(err).toEqual('no data')
            done()
        })
    });

    test('store() no bucket set', (done) =>{
        sut.store(mnid,eventId,event)
        .then((resp)=> {
            fail("shouldn't return"); done()
        })
        .catch( (err)=>{
            expect(err).toEqual('no bucket set')
            done()
        })
    });

    test('delete() no mnid', (done) => {
        sut.store(null)
            .then((resp) => {
                fail("shouldn't return"); done()
            })
            .catch((err) => {
                expect(err).toEqual('no key')
                done()
            })
    });

    test('delete() no filename', (done) => {
        sut.delete(mnid, null)
            .then((resp) => {
                fail("shouldn't return"); done()
            })
            .catch((err) => {
                expect(err).toEqual('no filename')
                done()
            })
    });

    test('delete() no bucket set', (done) => {
        sut.delete(mnid, eventId)
            .then((resp) => {
                fail("shouldn't return"); done()
            })
            .catch((err) => {
                expect(err).toEqual('no bucket set')
                done()
            })
    });



})
