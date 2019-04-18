class EventGetHandler {
  constructor(uPortMgr, eventMgr) {
    this.uPortMgr = uPortMgr;
    this.eventMgr = eventMgr;
  }

  async handle(event, context, cb) {
    //Check if headers are there
    if (!event.headers) {
      cb({ code: 403, message: "no headers" });
      return;
    }
    //Check if Authorization header is there
    if (!event.headers["Authorization"]) {
      cb({ code: 403, message: "no authorization header" });
      return;
    }

    //Parsing Authorization header
    let authHead = event.headers["Authorization"];

    let parts = authHead.split(" ");
    if (parts.length !== 2) {
      cb({ code: 401, message: "Format is Authorization: Bearer [token]" });
      return;
    }
    let scheme = parts[0];
    if (scheme !== "Bearer") {
      cb({ code: 401, message: "Format is Authorization: Bearer [token]" });
      return;
    }

    const token=parts[1];

    //Check token signature
    let payload;
    try {
      let dtoken = await this.uPortMgr.verifyToken(token);
      payload = dtoken.payload;
    } catch (error) {
      console.log("Error on this.uportMgr.verifyToken");
      console.log(error);
      cb({ code: 401, message: "Invalid token" });
      return;
    }

    let iss = payload.iss;
    let previous = payload.previous;

    console.log("iss: " +iss)
    console.log("previous: " +previous)

    //Check if retrieving one event or multiple
    if (event.pathParameters && event.pathParameters.id) {
    
      //Single event
      let eventId;
      let evt;
      eventId = event.pathParameters.id;

      console.log("Getting eventId: " +eventId)

      try {
        evt = await this.eventMgr.read(iss, eventId);
        cb(null, { events: evt });
        return;
      } catch (error) {
        console.log("Error on this.eventMgr.read");
        console.log(error);
        cb({ code: 500, message: error.message });
        return;
      }

    } else {
      console.log("Getting all events");

      //Fetch all the events since the previous
      let paginatedIndex;
      let evt;
      let page;
      let perPage;
      let events = [];

      if (event.page && event.per_page) {
        page = event.page;
        perPage = event.per_page;
      } else {
        //provide defaults
        page = 1;
        perPage = 100;
      }
      console.log("page: "+page);
      console.log("perPage: "+perPage);

      let eventsFrom;
      try {
        //Get events since previous for iss
        eventsFrom = await this.eventMgr.getEventsFrom(iss, previous);
      }catch(error){
        console.log("Error on this.eventMgr.getEventsFrom");
        console.log(error);
        cb({ code: 500, message: error.message });
        return;
      }
      console.log("eventsFrom: "+eventsFrom);

      //Paginate
      //TODO: Change paginate to eventMgr.getEventsFrom()
      paginatedIndex = await this.paginate(eventsFrom, page, perPage);
      console.log("paginatedIndex: "+paginatedIndex);

      //Loop thru index and read events.
      for (let i = 0; i < paginatedIndex.length; i++) {
        try {
          //TODO: Change to parallel Promise processing (Promise.all())
          evt = await this.eventMgr.read(iss, paginatedIndex[i]);
          console.log("events for page("+i+"): "+JSON.stringify(evt));
          events.push(evt);
        } catch (error) {
          console.log("Error on this.eventMgr.read");
          console.log(error);
          cb({ code: 500, message: error.message });
          return;
        }
      }
      const ret={ events: events, total: eventsFrom.length }
      console.log("returning: " + JSON.stringify(ret));
      cb(null, ret);
    }
  }

  async paginate(events = [], page = 1, perPage = 100) {
    let first;
    let subset;

    if (Array.isArray(events)) {
      if (page < 2) {
        first = 1;
      } else {
        first = perPage * page - 1;
      }
      subset = events.slice(first - 1, first - 1 + perPage);
      return subset;
    } else {
      return events;
    }
  }
}

module.exports = EventGetHandler;
