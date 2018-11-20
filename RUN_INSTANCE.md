# How to run own caleuche

Here are the steps to run your own instance of caleuche.

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

Caleuche is a serverless application, so it runs on different platforms. 

## AWS Lambda + S3 storage

Amazon Web Services provide a serverless platform called Lambda Functions. To deploy caleuche instance on your AWS account:

* Change the file `serverless.yml` and change (or confirm) the region on the provider section:
```
provider:
  name: aws
  runtime: nodejs6.10
  stage: develop
  region: us-west-2
```

* Create a S3 bucket.


* Create a KMS key on AWS: https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html 


* Using the `keyId` just created, create secrets file for your AWS account.
You need to set the following variables

| Variable Name | Description                                | 
|---------------|--------------------------------------------|
| BUCKET        | S3 bucket name where the events are stored |


```
sls encrypt -n SECRETS:BUCKET -v <bucket_name> -k <keyId>
```
This will create `kms-secrets-develop.<region>.yml` fiile

If you want to create a secrets file for `master` stage 
```
sls encrypt -n SECRETS:BUCKET -v <bucket_name> -k <keyId> --stage master
```

* Finally deploy the functions:
```
sls deploy
```
This will deploy the lambda function on `develop` stage. 
If you want to create it on `master`:
```
sls deploy --stage master
```

Pay attention to the URL. This is your instance URL. You can add it to AWS Gateway too.






