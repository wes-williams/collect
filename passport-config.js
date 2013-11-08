var appConfig = {};

// oauth 1.0
appConfig.fitbit = {};
appConfig.fitbit.type='oauth-1.0';
appConfig.fitbit.authorizationUrl = 'http://www.fitbit.com/oauth/authorize';
appConfig.fitbit.requestTokenUrl = 'http://api.fitbit.com/oauth/request_token';
appConfig.fitbit.accessTokenUrl = 'http://www.fitbit.com/oauth/access_token';
appConfig.fitbit.defaultLoadUrl = 'https://api.fitbit.com/1/user/-/profile.json'; 
appConfig.fitbit.userIdPath = 'user.encodedId'; 
appConfig.fitbit.clientId = '3f9ee2e269be43d397cd98acf7c53853';
appConfig.fitbit.clientSecret = '58d8fd9bb9ed491c9ca7a26681141ba6'; 
//appConfig.fitbit.callbackUrl = 'http://127.0.0.1:8080/auth/fitbit/callback';
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
