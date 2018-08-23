class EventGetHandler {
  constructor(uPortMgr, eventMgr) {
    this.uPortMgr = uPortMgr;
    this.eventMgr = eventMgr;
  }

  async handle(event, context, cb) {
    if (!event.headers) {
      cb({ code: 403, message: "no headers" });
      return;
    }
    if (!event.headers["Authorization"]) {
      cb({ code: 403, message: "no authorization header" });
      return;
    }

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

    let payload;
    try {
      let dtoken = await this.uPortMgr.verifyToken(parts[1]);
      payload = dtoken.payload;
    } catch (error) {
      console.log("Error on this.uportMgr.verifyToken");
      console.log(error);
      cb({ code: 401, message: "Invalid token" });
      return;
    }

    let mnid = payload.iss;
    let previous = payload.previous;

    if (event.pathParameters && event.pathParameters.id) {
      let eventId;
      let evt;
      eventId = event.pathParameters.id;
      try {
        evt = await this.eventMgr.read(mnid, eventId);
        cb(null, { events: evt });
        return;
      } catch (error) {
        console.log("Error on this.eventMgr.read");
        console.log(error);
        cb({ code: 500, message: error.message });
        return;
      }
    } else {
      //fetch all the events since the previous
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

      try {
        let eventsFrom = await this.eventMgr.getEventsFrom(mnid, previous);
        paginatedIndex = await this.paginate(eventsFrom, page, perPage);
        for (let i = 0; i < paginatedIndex.length; i++) {
          try {
            evt = await this.eventMgr.read(mnid, paginatedIndex[i]);
            events.push(evt);
          } catch (error) {
            console.log("Error on this.eventMgr.read");
            console.log(error);
            cb({ code: 500, message: error.message });
            return;
          }
        }
        cb(null, { events: events, total: eventsFrom.length });
      } catch (error) {
        console.log("Error on this.eventMgr.getIndex");
        console.log(error);
        cb({ code: 500, message: error.message });
        return;
      }
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
