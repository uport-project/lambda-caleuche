class V1EventGetHandler {
    constructor(uPortMgr, eventMgr) {
        this.uPortMgr = uPortMgr
        this.eventMgr = eventMgr
    }

    async handle(event, context, cb) {

        let eventId
        if (event.path && event.path.id){
            //Read evevent
            eventId = event.path.id
            try {
                await this.eventMgr.read(mnid, eventId)
                console.log("event stored: " + eventId)
            } catch (error) {
                console.log("Error on this.eventMgr.store")
                console.log(error)
                cb({ code: 500, message: error.message })
                return;
            }
        } else {
            //fetch all the events
        }
    }
}

module.exports = V1EventGetHandler
