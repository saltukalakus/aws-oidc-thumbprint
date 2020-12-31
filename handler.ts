import AWS from "aws-sdk";
import axios from 'axios';
const sslCertificate = require('get-ssl-certificate-tmp');

import Config from './config';

exports.run = async () => {
  const conf = Config();
  const headers = {
    'Content-Type': 'application/json'
  }
  const cert = await sslCertificate.get(conf.OIDC_LOGIN_DOMAIN, 5000, 443, "https:", true);
  let fingerprint = cert.issuerCertificate.fingerprint.toLowerCase().replace(/:/g, '');

  AWS.config.update({ region: conf.APP_AWS_REGION })
  const iam = new AWS.IAM()
  const options = {
    OpenIDConnectProviderArn: conf.APP_OIDC_IAM_ARN
  };
  iam.getOpenIDConnectProvider(options, (err, data) => {
    if (err) {
      console.log(conf.ERROR_MSG, err, err.stack);
      if (conf.SLACK_WEB_HOOK) {
        axios.post(conf.SLACK_WEB_HOOK, { "text": conf.ERROR_MSG }, {
          headers: headers
        }).then(() => { }).catch(() => { });
      }
    }
    else {
      if (data.ThumbprintList.indexOf(fingerprint) === -1) {
        console.log(conf.STARTING_UPDATE_MSG);
        if (conf.SLACK_WEB_HOOK) {
          axios.post(conf.SLACK_WEB_HOOK, { "text": conf.STARTING_UPDATE_MSG }, {
            headers: headers
          }).then(() => { }).catch(() => { });
        }
        data.ThumbprintList[0] = fingerprint;
        const updateParams = {
          OpenIDConnectProviderArn: conf.APP_OIDC_IAM_ARN,
          ThumbprintList: data.ThumbprintList
        };
        iam.updateOpenIDConnectProviderThumbprint(updateParams, function (err, data) {
          if (err) {
            console.log(conf.ERROR_MSG, err, err.stack);
            if (conf.SLACK_WEB_HOOK) {
              axios.post(conf.SLACK_WEB_HOOK, { "text": conf.ERROR_MSG }, {
                headers: headers
              }).then(() => { }).catch(() => { });
            }
          } else {
            console.log(conf.UPDATE_COMPLETED_MSG, data);
            if (conf.SLACK_WEB_HOOK) {
              axios.post(conf.SLACK_WEB_HOOK, { "text": conf.UPDATE_COMPLETED_MSG }, {
                headers: headers
              }).then(() => { }).catch(() => { });
            }
          }
        });
      }
    }
  });
};