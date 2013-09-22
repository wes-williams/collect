var appConfig = require('./passport-config'),
    passport = require('passport'),
    passportOauth = require('passport-oauth'),
    OAuthStrategy = passportOauth.OAuthStrategy,
    OAuth2Strategy = passportOauth.OAuth2Strategy,
    request = require('request');

var passportPlugin = {};

users = [];

var findUser = function(request) { 
  return users[request.session.passport.user]; 
};
passportPlugin.findUser = findUser; 


var init = function(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  // store user in persistent storage for passport
  passport.serializeUser(function(user, done) {
  console.log('serialize user');
    users[user.user_id] = user;
    done(null, user.user_id);
  });

  // retrieve user from persistent store for passport 
  passport.deserializeUser(function(id, done) {
  console.log('deserialize user');
    var user = users[id];
    done(null, user);
  });

  // load all app configs
  for(var apiName in appConfig) {
  console.log('register = ' + apiName);
    register(apiName); 
  }

};  
passportPlugin.init = init;

var register = function(apiName) {

  // setup oauth1 through passport
  passport.use(apiName, 
    new OAuthStrategy({
        userAuthorizationURL: appConfig[apiName].authorizationUrl,
        requestTokenURL: appConfig[apiName].requestTokenUrl,
        accessTokenURL: appConfig[apiName].accessTokenUrl,
        consumerKey: appConfig[apiName].clientId,
        consumerSecret: appConfig[apiName].clientSecret,
        callbackURL: appConfig[apiName].callbackUrl,
    },
    function(accessToken, refreshToken, profile, done) {
    console.log('found accessToken: ' + accessToken);
      var fakeUser = { 'accessToken' : accessToken }; 
      var options =  { 'method' : 'GET', 
                       'uri' : appConfig[apiName].profileUrl };
      var callback = function(user, data) {
       console.log('callback = ' + user + ', ' + data);
        var fullUser = null; 
        if(data  && data.user_id) { 
          fullUser = data;
          fullUser.accessToken = user.accessToken;
        } 
        fakeUser.user_id = '123'; // TODO - remote this line
        done(null, fakeUser); // TODO - use fullUser when call works
      };
      handleRequest(apiName,fakeUser,options,callback);  
    }
  ));

/*
  // setup oauth2 through passport
  passport.use(apiName, 
    new OAuth2Strategy({
        authorizationURL: appConfig[apiName].authorizationUrl,
        tokenURL: appConfig[apiName].accessTokenUrl,
        clientID: appConfig[apiName].clientId,
        clientSecret: appConfig[apiName].clientSecret,
        callbackURL: appConfig[apiName].callbackUrl 
    },
    function(accessToken, refreshToken, profile, done) {
      var fakeUser = { 'accessToken' : accessToken }; 
      var options =  { 'method' : 'GET', 
                       'uri' : appConfig[apiName].profileUrl };
      var callback = function(user, data) {
        var fullUser = null;
        if(data  && data.user_id) { 
          fullUser = data;
          fullUser.accessToken = user.accessToken;
        } 
        done(null, fullUser);
      };
      handleRequest(apiName,fakeUser,options,callback);  
    }
  ));
*/

};
passportPlugin.register = register;

// simplified request handling
var handleRequest = function(apiName, user, options, callback) {
 console.log('handling request');
 // Use right credential (token) https://wiki.fitbit.com/display/API/OAuth+Authentication+in+the+Fitbit+API
  var headers =  { 'Authorization': 'Basic ' + user.accessToken,
                   'Content-Type': 'application/json'};
  var method = options.method.toUpperCase(); 
  if(method=='PUT' || method=='POST') {
    options.body = JSON.stringify(options.body);
    headers['Content-Length'] = options.body.length; 
  }

  request({ 
      'uri' : options.uri,
      'body' : options.body,
      'method' : options.method,
      'headers' : headers 
    }, 
    function(error, response, body) {
      if(error) {
    console.log('handle request error ' + JSON.stringify(error));
        callback(user,null);
        return;
      }

      if (response.statusCode === 200) {
        callback(user,JSON.parse(body));
      } else {
      console.log('handle request error ' + response.statusCode);
        callback(user,response.statusCode);
    }
  });
};
passportPlugin.handleRequest = handleRequest;

var auth = function(apiName,streams) {
console.log('auth attempt');
  passport.authenticate(apiName)(streams.req,streams.res,streams.next);
}
passportPlugin.auth = auth;

var authCallback = function(apiName,urls,streams) {
console.log('authCallback attempt');
  passport.authenticate(apiName, 
                          { 
                            'successRedirect' : urls.successUrl, 
                            'failureRedirect' : urls.failureUrl 
                          }
                       )(streams.req,streams.res,streams.next);
}
passportPlugin.authCallback = authCallback;

module.exports = passportPlugin;
