import express from 'express';
import bodyParser from 'body-parser';
import api_handler from './src/api_handler';
import secrets from './aws-secrets';

const app = express();
app.use(bodyParser.json());

// Headers to enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const PORT = 3000;

let toTitleCase = (str) => {
    return str.replace(
        /([^\W_]+[^\s-]*) */g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

let getCallback = (res) => {
    return (err, response) => {
        if (err === null) {
            res.send(response);
        } else {
            res.send(err);
        }
    }
}

// GET request handler
let eventGet = (req, res) => {
    let event = {};
    event.headers = {};
    let headers = req.headers;
    Object.keys(headers).forEach(key => {
        event.headers[toTitleCase(key)] = headers[key];
    });
    event.pathParameters = req.params;
    event.page = req.body.page;
    event.per_page = req.body.per_page;
    api_handler.event_get(event, null, getCallback(res));
}

// POST request handler
let eventPost = (req, res) => {
    let event;
    event.headers = {}
    let headers = req.headers;
    Object.keys(headers).forEach(key => {
        event.headers[toTitleCase(key)] = headers[key];
    });
    api_handler.event_post(event, null, getCallback(res));
}

// DELETE by ID request handler
let eventDelete = (req, res) => {
    let event = {};
    event.headers = {};
    let headers = req.headers;
    Object.keys(headers).forEach(key => {
        event.headers[toTitleCase(key)] = headers[key];
    });
    event.pathParameters = req.params;
    api_handler.event_delete(event, null, getCallback(res));
}

// DELETE all request handler
let eventDeleteAll = (req, res) => {
    let event = {};
    event.headers = {};
    let headers = req.headers;
    Object.keys(headers).forEach(key => {
        event.headers[toTitleCase(key)] = headers[key];
    });
    api_handler.event_delete(event, null, getCallback(res));
}

// routes
app.get('/event/:id', eventGet);
app.get('/v1/event/:id', eventGet);
app.post('/event', eventPost);
app.post('/v1/event', eventPost);
app.delete('/event/:id', eventDelete);
app.delete('/event', eventDeleteAll);

// Start app
app.listen(PORT, () => {
    process.env.SECRETS = JSON.stringify(secrets.secrets);
    console.log('Listening on port', PORT);
});
