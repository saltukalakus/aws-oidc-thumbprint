"use strict";

const aws = require("aws-sdk");
const config = require('../config');
let awsServices;

module.exports.aws_iam = ((awsServices) => {
  if (!awsServices.iam) {
    awsServices.iam = new aws.IAM({ region: config().APP_IAM_AWS_REGION });
  }
  return awsServices.iam;
}).bind(null, awsServices);