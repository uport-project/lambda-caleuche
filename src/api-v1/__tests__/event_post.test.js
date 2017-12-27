const EventPostHandler = require('../event_post');

describe('EventPostHandler', () => {

    let sut;
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
            expect(err.message).toEqual('no event_token')
            done();
        })
    })

    test('handle invalid token', done => {
        sut.handle({body: JSON.stringify({event_token: 'asdf'})},{},(err,res)=>{
            expect(err).not.toBeNull()
            expect(err.code).toEqual(401)
            expect(err.message).toEqual('Invalid token')
            done();
        })
    })



});
