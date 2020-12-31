const Conf = {
  APP_AWS_REGION: process.env.APP_AWS_REGION,
  APP_OIDC_IAM_ARN: process.env.APP_OIDC_IAM_ARN,
  OIDC_LOGIN_DOMAIN: process.env.OIDC_LOGIN_DOMAIN
}

function Config() {
  return Conf
}

export default Config
