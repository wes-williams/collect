var commonConfig = require('./common-config.js');

var appConfig = {};
appConfig._host = commonConfig.host;

///////////////
// oauth 1.0
///////////////

// fitbit - https://wiki.fitbit.com/display/API/Fitbit+API

appConfig.fitbit = {};
appConfig.fitbit.type='oauth-1.0';
appConfig.fitbit.authorizationUrl = 'https://www.fitbit.com/oauth/authorize';
appConfig.fitbit.requestTokenUrl = 'https://api.fitbit.com/oauth/request_token';
appConfig.fitbit.accessTokenUrl = 'https://www.fitbit.com/oauth/access_token';
appConfig.fitbit.baseUrl = 'https://api.fitbit.com/1'; 
appConfig.fitbit.defaultLoadUrl = '/user/-/profile.json'; 
appConfig.fitbit.userIdPath = 'user.encodedId'; 
appConfig.fitbit.clientId = 'KEY_GOES_HERE';
appConfig.fitbit.clientSecret = 'SECRET_GOES_HERE';

// twitter - https://dev.twitter.com/docs/api/1.1

appConfig.twitter = {};
appConfig.twitter.type='oauth-1.0';
appConfig.twitter.authorizationUrl = 'https://api.twitter.com/oauth/authorize';
appConfig.twitter.requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
appConfig.twitter.accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
appConfig.twitter.baseUrl = 'https://api.twitter.com/1.1'; 
appConfig.twitter.defaultLoadUrl = '/account/verify_credentials.json'; 
appConfig.twitter.userIdPath = 'screen_name'; 
appConfig.twitter.clientId = 'KEY_GOES_HERE';
appConfig.twitter.clientSecret = 'PASS_GOES_HERE';

///////////////
// oauth 2.0  (no request url)
///////////////

// github - http://developer.github.com/

appConfig.github = {};
appConfig.github.type='oauth-2.0';
appConfig.github.authorizationUrl = 'https://github.com/login/oauth/authorize';
appConfig.github.accessTokenUrl = 'https://github.com/login/oauth/access_token';
appConfig.github.baseUrl = 'https://api.github.com'; 
appConfig.github.defaultLoadUrl = '/user'; 
appConfig.github.userIdPath = 'login'; 
appConfig.github.clientId = 'KEY_GOES_HERE';
appConfig.github.clientSecret = 'PASS_GOES_HERE';

///////////////
// api key
///////////////

appConfig.pearson = {};
appConfig.pearson.type='api-key';
appConfig.pearson.baseUrl = 'https://api.pearson.com'; 
appConfig.pearson.keyName = 'apikey'; 
appConfig.pearson.keyValue = 'KEY_GOES_HERE'; 
appConfig.pearson.isKeyInUrl = true; 

///////////////
// public 
///////////////

appConfig.opencolorado = {};
appConfig.opencolorado.type='public';
appConfig.opencolorado.baseUrl = 'http://data.opencolorado.org/storage'; 

// access ingested data like any other api
appConfig.dataupco = {};
appConfig.dataupco.type='public';
appConfig.dataupco.baseUrl = appConfig._host + '/data';

///////////////
// composite (mashup) 
///////////////

appConfig.mashup1 = {};
appConfig.mashup1.type = 'composite';
appConfig.mashup1.buildComposite = function(access, options, done) {
  console.log('execute mashup1 with uri: ' + options.uri);

  var body = {};
  body.reader = 'me';
  body.books = [];

  access.api('pearson',{ method : 'GET', uri : '/penguin/classics/v1/books?title=' + access.params.book1 },function(book1) {
    body.books.push(book1);

    access.api('pearson',{ method : 'GET', uri : '/penguin/classics/v1/books?title=' + access.params.book2 },function(book2) {
      body.books.push(book2);

      // error, body
      done(null,body);
    });
  });

};

appConfig.mashup2 = {};
appConfig.mashup2.type = 'composite';
appConfig.mashup2.buildComposite = function(access, options, done) {
  console.log('execute mashup2 with params: ' + access.params);

  var body = {};
  access.api('dataupco',{ method : 'GET', uri : '?_meta.api=' + access.params.api },function(data) {

    var limit = access.params.limit ? parseInt(access.params.limit) : 5;
    body.params = access.params;
    body.data = data && data.length>limit ? data.slice(0,limit) : data;

    // error, body
    done(null, body);
  });

};

module.exports = appConfig;
