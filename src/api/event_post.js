
class EventPostHandler {
  constructor (uPortMgr,eventMgr) {
    this.uPortMgr = uPortMgr
    this.eventMgr = eventMgr
  }

  async handle(event,context, cb) {

    //Parse body
    let body;
    try{
        body = JSON.parse(event.body)
    } catch(e){
        cb({code:403, message:'no json body: '+e.toString()})
        return;
    }


    // Check if event_token is present
    if (!(body.event_token)) {
      cb({code: 403, message: 'no event_token'})
      return
    }

    let payload;
    try{
      let dtoken=await this.uPortMgr.verifyToken(body.event_token)
      payload=dtoken.payload
    } catch (error){
      console.log("Error on this.uportMgr.verifyToken")
      console.log(error)
      cb({code: 401, message: 'Invalid token'})
      return;
    }

    // Check if event is present
    if (!(payload.event)) {
      cb({code: 403, message: 'no event'})
      return
    }


    let mnid=payload.iss

    //Check if previous is the last event
    try{
      let lastId=await this.eventMgr.lastId(mnid)
      console.log("lastId for the mnid '"+mnid+"' is: "+lastId)
      if (lastId!=payload.previous){
        cb({code: 409, message: 'previous is not the latest id', data: lastId})
        return
      }
    } catch (error){
      console.log("Error on this.eventMgr.lastId")
      console.log(error)
      cb({code: 500, message: error.message})
      return;
    }

    //Get eventId
    let eventId
    try{
      eventId=await this.eventMgr.getId(payload)
      console.log("eventId is: "+eventId)
    } catch (error){
      console.log("Error on this.eventMgr.getId")
      console.log(error)
      cb({code: 500, message: error.message})
      return;
    }


    //Store event
    try{
      await this.eventMgr.store(mnid,eventId,payload.event)
      console.log("event stored: "+eventId)
    } catch (error){
      console.log("Error on this.eventMgr.store")
      console.log(error)
      cb({code: 500, message: error.message})
      return;
    }

    //Return eventId
    cb(null,{id: eventId});


  }

}

module.exports = EventPostHandler
