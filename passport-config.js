var commonConfig = require('./common-config.js');

var appConfig = {};
appConfig._host = commonConfig.host;

///////////////
// oauth 1.0
///////////////

// fitbit - https://wiki.fitbit.com/display/API/Fitbit+API

appConfig.fitbit = {};
appConfig.fitbit.enabled=true;
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
appConfig.twitter.enabled=true;
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
appConfig.github.enabled=true;
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
appConfig.pearson.enabled=true;
appConfig.pearson.type='api-key';
appConfig.pearson.baseUrl = 'https://api.pearson.com'; 
appConfig.pearson.keyName = 'apikey'; 
appConfig.pearson.keyValue = 'KEY_GOES_HERE'; 
appConfig.pearson.isKeyInUrl = true; 

///////////////
// public 
///////////////

appConfig.opencolorado = {};
appConfig.opencolorado.name='Open Colorado';
appConfig.opencolorado.enabled=true;
appConfig.opencolorado.type='public';
appConfig.opencolorado.baseUrl = 'http://data.opencolorado.org/storage'; 

///////////////
// composite (mashup) 
///////////////


appConfig.mashup1 = {};
appConfig.mashup1.name='Book Mashup';
appConfig.mashup1.enabled=true;
appConfig.mashup1.type = 'composite';
appConfig.mashup1.buildComposite = function(access, options, done) {
  console.log('execute mashup1 with uri: ' + options.uri);

  var body = {};
  body.reader = 'me';
  body.books = [];

  var queryParams = { 
    '_meta.api' : 'pearson', 
    'books.title~rei' : '('+ access.params.book1 +'|'+ access.params.book2 +')' 
  };

  access.query(queryParams,function(data) {

    // check to see if these books are already in storage
    if(Array.isArray(data) && data.length>0) {
      body.books = data;
      if(data.length>=2) {
        done(null,body);
        return;
      }
    }

    access.api('pearson',{ method : 'GET', uri : '/penguin/classics/v1/books?title=' + access.params.book1 },function(book1) {
      body.books.push(book1);

      access.api('pearson',{ method : 'GET', uri : '/penguin/classics/v1/books?title=' + access.params.book2 },function(book2) {
        body.books.push(book2);

        // error, body
        done(null,body);
      });
    });
  });

};

///////////////
// webhook
///////////////

appConfig.webhook1 = {};
appConfig.webhook1.name='Skeleton Webhook';
appConfig.webhook1.enabled=true;
appConfig.webhook1.type = 'webhook';
appConfig.webhook1.buildWebhook = function(access, options, done) {
  console.log('execute webhook1 with uri: ' + options.uri);
  done(null,{});
};


module.exports = appConfig;
