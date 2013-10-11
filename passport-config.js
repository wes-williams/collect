var appConfig = {};

// oauth 1.0
appConfig.fitbit = {};
appConfig.fitbit.type='oauth-1.0';
appConfig.fitbit.authorizationUrl = 'http://www.fitbit.com/oauth/authorize';
appConfig.fitbit.requestTokenUrl = 'http://api.fitbit.com/oauth/request_token';
appConfig.fitbit.accessTokenUrl = 'http://www.fitbit.com/oauth/access_token';
appConfig.fitbit.defaultLoadUrl = 'https://api.fitbit.com/1/user/-/profile.json'; 
appConfig.fitbit.userIdPath = 'user.encodedId'; 
appConfig.fitbit.clientId = '6b9642ee29274dd892840cf41b96510e';
appConfig.fitbit.clientSecret = 'b82d667c14494949a84ebd548a8299bb';
appConfig.fitbit.callbackUrl = 'http://127.0.0.1:8080/auth/fitbit/callback';
//appConfig.fitbit.callbackUrl = 'https://proxy-dataupco.rhcloud.com/auth/fitbit/callback';

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
