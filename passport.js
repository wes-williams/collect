var appConfig = require('./passport-config'),
    passport = require('passport'),
    passportOauth = require('passport-oauth'),
    OAuthStrategy = passportOauth.OAuthStrategy,
    OAuth2Strategy = passportOauth.OAuth2Strategy,
    request = require('request');

var passportPlugin = {};

passportPlugin.users = [];

passportPlugin.findUser = function(request) { 
  return users[request.session.passport.user]; 
};

passportPlugin.init = function(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  // store user in persistent storage for passport
  passport.serializeUser(function(user, done) {
    users[user.user_id] = user;
    done(null, user.user_id);
  });

  // retrieve user from persistent store for passport 
  passport.deserializeUser(function(id, done) {
    var user = users[id];
    done(null, user);
  });

  // load all app configs
  for(var apiName in appConfigs) {
    register(apiName); 
  }

};  

passportPlugin.register = function(apiName) {

  // setup oauth1 through passport
  passport.use(apiName, 
    new OAuthStrategy({
        userAuthorizationURL: appConfig[apiName].authoriationUrl,
        requestTokenURL: appConfig[apiName].requestTokenUrl,
        accessTokenURL: appConfig[apiName].accessTokenUrl,
        consumerKey: appConfig[apiName].clientId,
        consumerSecret: appConfig[apiName].clientSecret,
        callbackURL: appConfig[apiName].callbackUrl,
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
      handleRequest(fakeUser,options,callback);  
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
      handleRequest(fakeUser,options,callback);  
    }
  ));
*/

};

// simplified request handling
passportPlugin.handleRequest = function(apiName, options, callback) {
  var headers =  { 'Authorization': 'Basic ' + user.accessToken,
                   'Content-Type': 'application/json'};
  var method = options.method.toUpperCase(); 
  if(method=='PUT' || method=='POST') {
    options.body = JSON.stringify(options.body);
    headers['Content-Length'] = options.body.length; 
  }

  request({ 
      'uri' : appConfig.requestUrl + options.uri,
      'body' : options.body,
      'method' : options.method,
      'headers' : headers 
    }, 
    function(error, response, body) {
      if(error) {
        callback(user,null);
        return;
      }

      if (response.statusCode === 200) {
        callback(user,JSON.parse(body));
      } else {
        callback(user,response.statusCode);
    }
  });
};

passportPlugin.auth = function(apiName) {
  return passport.authenticate(apiName);
}

passportPlugin.authCallback = function(apiName, successUrl, failureUrl) {
  passport.authenticate(apiName, { 'successRedirect' : successUrl, 'failureRedirect' : failureUrl }),
}

module.exports = passportPlugin;
