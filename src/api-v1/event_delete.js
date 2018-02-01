class V1EventDeleteHandler {
    constructor(uPortMgr, eventMgr) {
        this.uPortMgr = uPortMgr
        this.eventMgr = eventMgr
    }

    async handle(event, context, cb) {
        if(!event.headers){
          cb({code: 403, message:'no headers'})
          return;
        }
        if(!event.headers['Authorization']){
          cb({code: 403, message:'no authorization header'})
          return;
        }

        let authHead=event.headers['Authorization']

        let parts = authHead.split(' ')
        if (parts.length !== 2) {
          cb({code: 401, message:'Format is Authorization: Bearer [token]'})
          return;
        }
        let scheme = parts[0];
        if (scheme !== 'Bearer') {
          cb({code: 401, message:'Format is Authorization: Bearer [token]'})
          return;
        }

        let payload
        try {
            let dtoken = await this.uPortMgr.verifyToken(parts[1])
            payload = dtoken.payload
        } catch (error) {
            console.log("Error on this.uportMgr.verifyToken")
            console.log(error)
            cb({ code: 401, message: 'Invalid token' })
            return;
        }

        let mnid = payload.iss

        if (event.pathParameters && event.pathParameters.id){
            let eventId;
            let evt;
            eventId = event.pathParameters.id
            try {
                evt = await this.eventMgr.delete(mnid, eventId)
                cb(null)
                return;
            } catch (error) {
                console.log("Error on this.eventMgr.delete")
                console.log(error)
                cb({ code: 500, message: error.message })
                return;
            }
        } else {
          cb({ code: 400, message: "No event id"});
          return;
        }

    }


}

module.exports = V1EventDeleteHandler
