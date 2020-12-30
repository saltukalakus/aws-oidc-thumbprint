"use strict";
const { aws_iam } = require("./lib/aws");
const openssl = require('openssl-nodejs');
const crypto = require('crypto');
const config = require('./config');

module.exports.handler = (event, context) => {
  console.log("Lambda executed..");
  const domainName = config().OIDC_LOGIN_DOMAIN;
  return openssl(['s_client', '-connect', domainName, '-showcerts'], function (err, buffer) {
    let certificateString = buffer.toString();
    let certStart = locations("-----BEGIN CERTIFICATE-----", certificateString);
    let certEnd = locations("-----END CERTIFICATE-----", certificateString);
    certStart = certStart[certStart.length - 1];
    certEnd = certEnd[certEnd.length - 1];
    certificateString = certificateString.slice(certStart + 28, certEnd);

    const sha1sum = getCertificateFingerprintSha1(certificateString);

    const options = {
      OpenIDConnectProviderArn: config().APP_OIDC_IAM_ARN
    };
    const iam = aws_iam();
    return iam.getOpenIDConnectProvider(options, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        const certOnAWS = data.ThumbprintList[data.ThumbprintList.length - 1];
        if (certOnAWS !== sha1sum) {
          console.log("UPDATE AWS CERT!!!");
          let newCerts = data.ThumbprintList;
          newCerts = newCerts.concat(sha1sum);
          const updateParams = {
            OpenIDConnectProviderArn: config().APP_OIDC_IAM_ARN,
            ThumbprintList: newCerts
          };
          return iam.updateOpenIDConnectProviderThumbprint(updateParams, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log('Cert successfully updated', data); // successful response
          });
        }
      }
    });
  });

  function locations(substring, string) {
    let a = [], i = -1;
    while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i);
    return a;
  }

  function getCertificateFingerprintSha1(certString) {
    const rawCert = Buffer.from(certString, "base64");
    const sha1sum = crypto.createHash("sha1").update(rawCert).digest("hex");
    return sha1sum;//.toUpperCase().replace(/(.{2})(?!$)/g, "$1:");
  }
};