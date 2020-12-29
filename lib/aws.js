"use strict";

const awsxray = require("aws-xray-sdk-core");
const aws = (process.env.XRAY_OFF || stage === "testing") ? require("aws-sdk") : awsxray.captureAWS(require("aws-sdk"));

module.exports.aws_iam = ((awsServices) => {
  if(!awsServices.iam){
    awsServices.iam = new aws.IAM({region:'us-east-1'});
  }
  return awsServices.iam;
}).bind(null, awsServices);