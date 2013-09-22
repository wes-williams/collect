var appConfig = {};

// oauth 1.0
appConfig.fitbit = {};
appConfig.fitbit.type='oauth-1.0';
appConfig.fitbit.authorizationUrl = 'http://www.fitbit.com/oauth/authorize';
appConfig.fitbit.requestTokenUrl = 'http://api.fitbit.com/oauth/request_token';
appConfig.fitbit.accessTokenUrl = 'http://www.fitbit.com/oauth/access_token';
appConfig.fitbit.defaultLoadUrl = 'https://api.fitbit.com/1/user/-/profile.json'; 
appConfig.fitbit.clientId = '9eea4071a9eb48f8976fff54d4758223';
appConfig.fitbit.clientSecret = 'b2e1182719ef494badcbdfe422811fa2';
appConfig.fitbit.callbackUrl = 'https://proxy-dataupco.rhcloud.com/fitbit/callback';

/*
// oauth 2.0 (no request url)
appConfig.fitbit = {};
appConfig.fitbit.type='oauth-2.0';
appConfig.fitbit.authorizationUrl = 'http://www.fitbit.com/oauth/authorize';
appConfig.fitbit.accessTokenUrl = 'http://www.fitbit.com/oauth/access_token';
appConfig.fitbit.defaultLoadUrl = 'https://api.fitbit.com/1/user/-/profile.json'; 
appConfig.fitbit.clientId = '9eea4071a9eb48f8976fff54d4758223';
appConfig.fitbit.clientSecret = 'b2e1182719ef494badcbdfe422811fa2';
appConfig.fitbit.callbackUrl = 'https://proxy-dataupco.rhcloud.com/fitbit/callback';
*/

module.exports = appConfig;
