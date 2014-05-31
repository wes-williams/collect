var commonConfig = require('./common-config.js');
var request = require('request');

var appConfig = {};
appConfig._host = commonConfig.host;

///////////////
// oauth 1.0
///////////////

/*
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
*/

///////////////
// oauth 2.0  (no request url)
///////////////

/*
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
*/

///////////////
// api key
///////////////

/*
appConfig.pearson = {};
appConfig.pearson.enabled=true;
appConfig.pearson.type='api-key';
appConfig.pearson.baseUrl = 'https://api.pearson.com'; 
appConfig.pearson.keyName = 'apikey'; 
appConfig.pearson.keyValue = 'KEY_GOES_HERE'; 
appConfig.pearson.isKeyInUrl = true; 
*/

///////////////
// public 
///////////////

/*
appConfig.opencolorado = {};
appConfig.opencolorado.name='Open Colorado';
appConfig.opencolorado.enabled=true;
appConfig.opencolorado.type='public';
appConfig.opencolorado.baseUrl = 'http://data.opencolorado.org/storage'; 
*/

///////////////
// composite (mashup)
// 
//  Usage: GET /api/{name}/*  
//  Resources: 
//    access: params, api(name,options,callback), query(params,callback), ingest(data,callback)
//    options: method, uri 
///////////////


/*
appConfig.mashup1 = {};
appConfig.mashup1.name='Book Mashup';
appConfig.mashup1.enabled=true;
appConfig.mashup1.type = 'composite';
appConfig.mashup1.buildComposite = function(access, options, done) {
  // access: params, api(name,options,callback), query(params,callback), ingest(data,callback)
  // options: method, uri 

  console.log('execute mashup1 with uri: ' + options.uri);

  var body = {};
  body.reader = 'me';
  body.books = [];

  var queryParams = { 
    '_meta.api~in' : 'pearson~mashup1', 
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
      if(book1 && book1.books && book1.books.length>0) {
        body.books.push(book1);
      }

      access.api('pearson',{ method : 'GET', uri : '/penguin/classics/v1/books?title=' + access.params.book2 },function(book2) {
        if(book2 && book2.books && book2.books.length>0) {
          body.books.push(book2);
        }

        if(body.books.length > 0) {
          access.ingest(body.books, function(data) {
            // error, body
            done(null,body);
          });
        }
        else {
          done(null,body);
        }
      });
    });
  });

};
*/

appConfig.twillio = {};
appConfig.twillio.name='Twillio';
appConfig.twillio.username='<USERNAMEHERE>';
appConfig.twillio.password='<PASSWORDHERE>';
appConfig.twillio.phoneNumber='<PHONENUMBERHERE>';
appConfig.twillio.testPhoneNumber='<PHONENUMBERHERE>';
appConfig.twillio.enabled=true;
appConfig.twillio.type = 'webhook';
appConfig.twillio.buildWebhook = function(access, options, done) {
  // access: params, api(name,options,callback), query(params,callback), ingest(data,callback)
  // options: method, uri 

  console.log('execute twillio with uri: ' + options.uri);

  var newMessage = {
    'From' : appConfig.twillio.phoneNumber,
    'To' : appConfig.twillio.testPhoneNumber,
    'Body' : 'This is a test'
  };

  var requestOptions = { 
    'uri' : 'https://api.twilio.com/2010-04-01/Accounts/'+appConfig.twillio.username+'/Messages.json', 
    'method' : 'POST',
    'headers' : { 
      'Authorization' : 'Basic ' + new Buffer(appConfig.twillio.username+':'+appConfig.twillio.password).toString('base64') 
    },
    'form' : newMessage
  };
  request(requestOptions, function (error, response, body) {
    done(null, body)
  });
};

///////////////
// webhook - for use by 3rd parties to push data
// 
//  Security: Basic Auth
//  Auth Test: GET  /hook/{name}/{id}  
//  Execution: POST /hook/{name}/{id}  
//  Resources: 
//    access: params, body, api(name,options,callback), query(params,callback), ingest(data,callback)
//    options: method, uri 
///////////////

/*

appConfig.webhook1 = {};
appConfig.webhook1.name='Skeleton Webhook';
appConfig.webhook1.enabled=true;
appConfig.webhook1.type = 'webhook';
appConfig.webhook1.buildWebhook = function(access, options, done) {

  console.log('execute webhook1 with uri: ' + options.uri);

  var book1Param = access.body.book1 ? access.body.book1 : access.params.book1;
  var book2Param = access.body.book2 ? access.body.book2 : access.params.book2;

  var body = {};
  body.reader = 'me';
  body.books = [];

  var queryParams = { 
    '_meta.api~in' : 'pearson~webhook1', 
    'books.title~rei' : '('+ book1Param +'|'+ book2Param +')' 
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

    access.api('pearson',{ method : 'GET', uri : '/penguin/classics/v1/books?title=' + book1Param },function(book1) {
      if(book1 && book1.books && book1.books.length>0) {
        body.books.push(book1);
      }

      access.api('pearson',{ method : 'GET', uri : '/penguin/classics/v1/books?title=' + book2Param },function(book2) {
        if(book2 && book2.books && book2.books.length>0) {
          body.books.push(book2);
        }
       
        if(body.books.length > 0) {
          access.ingest(body.books, function(data) {
            // error, body
            done(null,body);
          });
        }
        else {
          done(null,body);
        }
      });
    });
  });

};

*/


module.exports = appConfig;
