"use strict";
import AWS from "aws-sdk";
const sslCertificate = require('get-ssl-certificate-fork');
import Config from './config';

exports.run = async (event, context) => {
  const conf = Config();
  const cert = await sslCertificate.get(conf.OIDC_LOGIN_DOMAIN, 5000, 443, "https:", true);
  let fingerprint = cert.issuerCertificate.fingerprint.toLowerCase().replace(/:/g, '');
  console.log(fingerprint);

  AWS.config.update({ region: conf.APP_AWS_REGION })
  const iam = new AWS.IAM()
  const options = {
    OpenIDConnectProviderArn: conf.APP_OIDC_IAM_ARN
  };
  iam.getOpenIDConnectProvider(options, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
      console.dir(data);
      console.dir(data.ThumbprintList);
      if (data.ThumbprintList.indexOf(fingerprint) === -1) {
        console.log("UPDATE AWS CERT!!!");
        data.ThumbprintList[0] = fingerprint;
        const updateParams = {
          OpenIDConnectProviderArn: conf.APP_OIDC_IAM_ARN,
          ThumbprintList: data.ThumbprintList
        };
        iam.updateOpenIDConnectProviderThumbprint(updateParams, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else console.log('Cert successfully updated', data); // successful response
        });
      }
    }
  });
};