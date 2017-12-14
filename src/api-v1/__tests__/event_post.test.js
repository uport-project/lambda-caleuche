const EventPostHandler = require('../event_post');

describe('EventPostHandler', () => {
    
    let sut;
    let previousId='QmeventHash'
    let sampleEvent={
        action: 'SAMPLE_ACCTION'
    }
    let eventMgrMock={ lastId: jest.fn()};

    beforeAll(() => {
        sut = new EventPostHandler(eventMgrMock);
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
            expect(err.message).toEqual('no previous')
            done();
        })
    })

    test('handle no previous', (done) =>{
        let event={
            body: JSON.stringify({event: sampleEvent})
        }
        sut.handle(event,{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toEqual('no previous')
            done();
        })
    });

    test('handle no event', (done) =>{
        let event={
            body: JSON.stringify({previous: previousId})
        }
        sut.handle(event,{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(403)
            expect(err.message).toEqual('no event')
            done();
        })
    });
    
    test('fail on eventMgr.lastId', done => {
        eventMgrMock.lastId.mockImplementation(()=>{ 
            throw(new Error("eventMgr error"))   
        })
        let event={
            body: JSON.stringify({
                event: sampleEvent,
                previous: previousId
            })
        }
        
        sut.handle(event,{},(err,res)=>{
            expect(err).not.toBeNull();
            expect(err.code).toEqual(500)
            expect(err.message).toEqual("eventMgr error")
            expect(res).toBeUndefined();
            done();
        })
    })

    
});