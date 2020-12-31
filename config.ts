const Conf = {
  APP_AWS_REGION: process.env.APP_AWS_REGION,
  APP_OIDC_IAM_ARN: process.env.APP_OIDC_IAM_ARN,
  OIDC_LOGIN_DOMAIN: process.env.OIDC_LOGIN_DOMAIN,
  SLACK_WEB_HOOK: process.env.SLACK_WEB_HOOK,
  STARTING_UPDATE_MSG: process.env.STARTING_UPDATE_MSG,
  UPDATE_COMPLETED_MSG: process.env.UPDATE_COMPLETED_MSG,
  ERROR_MSG: process.env.ERROR_MSG
}

function Config() {
  return Conf
}

export default Config
