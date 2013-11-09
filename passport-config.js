var appConfig = {};

// oauth 1.0
appConfig.fitbit = {};
appConfig.fitbit.type='oauth-1.0';
appConfig.fitbit.authorizationUrl = 'http://www.fitbit.com/oauth/authorize';
appConfig.fitbit.requestTokenUrl = 'http://api.fitbit.com/oauth/request_token';
appConfig.fitbit.accessTokenUrl = 'http://www.fitbit.com/oauth/access_token';
appConfig.fitbit.baseUrl = 'https://api.fitbit.com/1'; 
appConfig.fitbit.defaultLoadUrl = '/user/-/profile.json'; 
appConfig.fitbit.userIdPath = 'user.encodedId'; 
appConfig.fitbit.clientId = '1cf532fb0592432a9f66debe91704023';
appConfig.fitbit.clientSecret = '9e8964f700a84755a9d1522c1adcab52'; 
appConfig.fitbit.callbackUrl = 'https://proxy-dataupco.rhcloud.com/auth/fitbit/callback';

/*
// oauth 2.0 (no request url)
appConfig.fitbit = {};
appConfig.fitbit.type='oauth-2.0';
appConfig.fitbit.authorizationUrl = 'http://www.fitbit.com/oauth/authorize';
appConfig.fitbit.accessTokenUrl = 'http://www.fitbit.com/oauth/access_token';
appConfig.fitbit.defaultLoadUrl = 'https://api.fitbit.com/1/user/-/profile.json'; 
appConfig.fitbit.clientId = '';
appConfig.fitbit.clientSecret = '';
appConfig.fitbit.callbackUrl = 'https://proxy-dataupco.rhcloud.com/fitbit/callback';
*/

module.exports = appConfig;
