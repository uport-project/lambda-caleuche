# lambda-caleuche
Caleuche. Event Hub Service

## Description
This lambda functions allow the backup and sync of uPort mobile app events.
"The Caleuche" is a mythical ghost ship of the north Chilote mythology and local folklore of the Chiloé Island, in Chile.

![Caleuche bad recreation](https://i.ytimg.com/vi/dn9PpNy7GL4/maxresdefault.jpg)

## API Description

### Post Event 
The post event endpoint allows the uPort mobile app to send an event. 
The lambda function stores the event in an S3 bucket and publish the event in the SNS topic of the MNID of the user.

Future improvements:
* Store encrypted events
* Store on user owned storage (Cognito+s3, Dropbox, etc)
* Use Ethereum Whisper to publish/subscribe

#### Endpoints

POST /v1/event

#### Body

```
{
    event_token: <jwt token of the event>
}
```

The `event_token` is a MNID signed jwt of the event wanted to post. The payload of the event_token is:
```
{
    event: <event data>
    previous: <previous event hash>
}
```


#### Response

| Status |     Message    |                                                   |
|:------:|----------------|---------------------------------------------------|
| 200    | Ok.            | Check started and saved                           |
| 401    | Invalid JWT    | Posted token is invalid (signature, expired, etc) |
| 403    | Missing data   | no `event` or no `previous`                           |
| 409    | Bad previous   | `previous` is not the latest id                   |
| 500    | Internal Error | Internal Error                                    |

The response data follows the [`jsend`](https://labs.omniti.com/labs/jsend) standard. 

#### Response data
```
{
  status: 'success',
  message: {
    id: <id/hash of the accepted event>
  }
}
```

### Sequence Diagram

![Event Post Seq](./diagrams/img/v1.event_post.seq.png)


