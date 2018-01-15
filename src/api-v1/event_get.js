class V1EventGetHandler {
    constructor(uPortMgr, eventMgr) {
        this.uPortMgr = uPortMgr
        this.eventMgr = eventMgr
    }

    async handle(event, context, cb) {
        //Parse body
        let body;
        try {
            body = JSON.parse(event.body)
        } catch (e) {
            cb({ code: 403, message: 'no json body: ' + e.toString() })
            return;
        }

        // Check if event_token is present
        if (!(body.event_token)) {
            cb({ code: 403, message: 'no event_token' })
            return
        }

        let payload;
        try {
            let dtoken = await this.uPortMgr.verifyToken(body.event_token)
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
                evt = await this.eventMgr.read(mnid, eventId)
                cb(null, {events: evt})
                return;
            } catch (error) {
                console.log("Error on this.eventMgr.read")
                console.log(error)
                cb({ code: 500, message: error.message })
                return;
            }
        } else {
            //fetch all the events
            let index
            let paginatedIndex
            let evt
            let page
            let perPage
            let events = []

            let params = event.pathParameters

            if (params && params.page && params.per_page){
              page = params.page
              perPage = params.per_page
            } else {
              //provide defaults
              page = 1
              perPage = 100
            }

            try {
                index = await this.eventMgr.getIndex(mnid)
                paginatedIndex = await this.paginate(index, page, perPage)
                for (let i = 0; i < paginatedIndex.length; i++) {
                    try {
                        evt = await this.eventMgr.read(mnid, paginatedIndex[i])
                        events.push(evt)
                    } catch (error) {
                        console.log("Error on this.eventMgr.read")
                        console.log(error)
                        cb({ code: 500, message: error.message })
                        return;
                    }
                }
                cb(null, {events: events})
            } catch (error) {
                console.log("Error on this.eventMgr.getIndex")
                console.log(error)
                cb({ code: 500, message: error.message })
                return;
            }
        }

    }

    async paginate(events, page = 1, per_page = 100){
      let firstEvent
      let subset

      if ( page < 2 ){
        firstEvent = 0
      } else {
        firstEvent = ( per_page * page ) - 1
      }
      subset = events.slice(firstEvent - 1,firstEvent  - 1 + per_page)
      return subset;
    }

}

module.exports = V1EventGetHandler
