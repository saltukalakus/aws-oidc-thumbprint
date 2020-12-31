# aws-oidc-thumbprint

AWS's OIDC Identity Provider integration helps to integrate external identity providers to authenticate for AWS resource. Likely due to the sensitivity of the functionality, they require to pin the login domain certificate of the upstream identity provider. See this link [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html) for more details.

This tool helps to avoid service distribution by updating the AWS configuration for the certificate thumbprint if the login domain certificate changes. This is useful especially if you don't have control for the login domain certificate rotation. For E.g. if you are using identity as a service solution (IaaS) like Auth0, Okta, Azure you likely have less control for the domain certificates.

As a simple solution, the solution here spins up a Lambda function that runs every X minutes configured with RUN_LAMBDA_EVERY_X_MIN env variable to check the certificate changes on the login domain and updates the thumbprint on AWS if needed.

Event notifications are sent to [AWS CloudWatch](https://aws.amazon.com/cloudwatch/). Optionally, you can also send them to Slack with [Incoming Webhooks](https://api.slack.com/messaging/webhooks) integration.

**By using this tool you are working-around a security feature. Though it may not be very common to pin the login domain certificate, you are accepting the associated risks. Please check your identity vendor first to see if they can provide a better solution.**


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
