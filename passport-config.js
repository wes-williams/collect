var appConfig = {};

///////////////
// oauth 1.0
///////////////

// fitbit - https://wiki.fitbit.com/display/API/Fitbit+API

appConfig.fitbit = {};
appConfig.fitbit.type='oauth-1.0';
appConfig.fitbit.authorizationUrl = 'http://www.fitbit.com/oauth/authorize';
appConfig.fitbit.requestTokenUrl = 'http://api.fitbit.com/oauth/request_token';
appConfig.fitbit.accessTokenUrl = 'http://www.fitbit.com/oauth/access_token';
appConfig.fitbit.baseUrl = 'https://api.fitbit.com/1'; 
appConfig.fitbit.defaultLoadUrl = '/user/-/profile.json'; 
appConfig.fitbit.userIdPath = 'user.encodedId'; 
appConfig.fitbit.clientId = '';
appConfig.fitbit.clientSecret = '';
appConfig.fitbit.callbackUrl = 'https://proxy-dataupco.rhcloud.com/auth/fitbit/callback';

// twitter - https://dev.twitter.com/docs/api/1.1

appConfig.twitter = {};
appConfig.twitter.type='oauth-1.0';
appConfig.twitter.authorizationUrl = 'https://api.twitter.com/oauth/authorize';
appConfig.twitter.requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
appConfig.twitter.accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
appConfig.twitter.baseUrl = 'http://api.twitter.com/1.1'; 
appConfig.twitter.defaultLoadUrl = '/account/verify_credentials.json'; 
appConfig.twitter.userIdPath = 'screen_name'; 
appConfig.twitter.clientId = '';
appConfig.twitter.clientSecret = '';
appConfig.twitter.callbackUrl = 'https://proxy-dataupco.rhcloud.com/auth/twitter/callback';

///////////////
// oauth 2.0  (no request url)
///////////////

/*
// github - http://developer.github.com/

appConfig.github = {};
appConfig.github.type='oauth-2.0';
appConfig.github.authorizationUrl = 'https://github.com/login/oauth/authorize';
appConfig.github.accessTokenUrl = 'https://github.com/login/oauth/access_token';
appConfig.github.baseUrl = 'https://api.github.com'; 
appConfig.github.defaultLoadUrl = '/user'; 
appConfig.github.userIdPath = 'login'; 
appConfig.github.clientId = '';
appConfig.github.clientSecret = '';
appConfig.github.callbackUrl = 'https://proxy-dataupco.rhcloud.com/github/callback';

*/

module.exports = appConfig;
