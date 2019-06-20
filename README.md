# serverless-binary-cors

A Serverless framework plugin to enable proper CORS when APIGateway has binary media types configured

## Install

```
npm install serverless-binary-cors
or
yarn add serverless-binary-cors
```

## Note

This is an early implementation of this plugin. So far it's working for all my use cases, but has not been tested in many other configurations. It could need additional work to handle all possible setups. Your contributions are appreciated.

## The Problem

When enabling Binary Media Types in API Gateway, the most flexible setting is to use `*/*` as it does not require a client to send an `Accept:` header. However, this then starts causing `OPTIONS` methods to begin failing with 500 errors due API Gateway not knowing how to encode the response.

## The Solution

After multiple calls with AWS Support (as this is totally undocumented), we landed on a solution which is to modify the Integration Response of the MOCK integration that is used to handle these OPTIONS methods. The trick is to use an actual binary Content-Type in the Mapping Templates.

![Mapping Template](https://i.ibb.co/3hTvK2n/API-Gateway.png)

Getting this to configure with Serverless requires modifying the underlying CloudFormation templates.

This plugin makes those nessisary modification.
