const Conf = {
  APP_IAM_AWS_REGION: process.env.APP_IAM_AWS_REGION,
  APP_OIDC_IAM_ARN: process.env.APP_OIDC_IAM_ARN,
  OIDC_LOGIN_DOMAIN: process.env.OIDC_LOGIN_DOMAIN
}

module.exports.config = () => {
  return Conf
}