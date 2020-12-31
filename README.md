# aws-oidc-thumbprint
AWS OIDC Identity Provider needs to pin the login domain certificate. You may find more details regarding this feature [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html)

This tool helps to avoid service distribution by updating the AWS configuration for the certificate thumbprint if the login domain certificate changes. This is useful aspecially if you don't have a control for when the certificate is rotated for the identity provider login domain. E.g. if you are using an identity as a service solution (IaaS) like Auth0, Okta, Azure you may not have the control for the certificate rotation. 

The tool is build as a Lambda function which runs every X minutes configured with RUN_LAMBDA_EVERY_X_MIN env variable to check the cert changes and update the thumbprint if needed.

The script sends logs to [AWS CloudWatch](https://aws.amazon.com/cloudwatch/) for certificate rotation. Optionally, you can also send notifications to Slack with [Incomming Webhooks](https://api.slack.com/messaging/webhooks).

**By using this tool you are working-around a security feature. Though it may not be very common to pin the login domain certicate, you are accepting the associated the risks.**

## Conf

Configure the env variables, by copying the template as .env.yml and fill the necessary variables.

```bash
mv .env.yml.sample .env.yml
```

## Setup

```bash
yarn
```

## Deploy to AWS with Serverless

```bash
serverless deploy
```

## Cleanup

```bash
serverless remove
```
