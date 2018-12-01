# How to run caleuche in a local express server

Here are the steps to run your own instance of caleuche on a local express server.

## Get the code

You can clone the repo from github:

```
git clone git@github.com:uport-project/lambda-caleuche.git
```

Then install the dependencies:

```
npm install
```

and finally run the tests to check everything is ok:
```
npm test
```

## S3 storage

* Create an S3 bucket.

* Make a secret file named `aws-secrets.js` for the bucket name in the root directory of the app. The contents of the file should be:

```javascript
module.exports.secrets = {
    "BUCKET": "<bucket_name>"
}
```

## Run the express app

Finally, you can build and run the express app by:

```
npm run build-dev
```
This will make a `dist` folder with the target files.

```
npm run start-dev
```
The server is running on `http://localhost:3000/`.
