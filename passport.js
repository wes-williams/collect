var appConfig = require('./passport-config'),
    passport = require('passport'),
    passportOauth = require('passport-oauth'),
    OAuthStrategy = passportOauth.OAuthStrategy,
    OAuth2Strategy = passportOauth.OAuth2Strategy,
    request = require('request');

var passportPlugin = {};

users = [];

var hasApi = function(apiName) {
  return appConfig[apiName] != undefined;
};
passportPlugin.hasApi = hasApi;

var findUser = function(req) { 
  return users[req.session.passport.user]; 
};
passportPlugin.findUser = findUser; 


var init = function(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  // store user in persistent storage for passport
  passport.serializeUser(function(user, done) {
    //console.log('serialize user ' + user._id);
    users[user._id] = user;
    done(null, user._id);
  });

  // retrieve user from persistent store for passport 
  passport.deserializeUser(function(id, done) {
    //console.log('deserialize user ' + id);
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

   var strategyCallback = function(token, tokenSecret, profile, done) {
    var fakeUser = { 'token' : token,
                     'tokenSecret' : tokenSecret }; 
    var options =  { 'method' : 'GET', 
                     'uri' : appConfig[apiName].defaultLoadUrl };
    var callback = function(user, data) {
      var fullUser = null; 

      //var profileUser = appConfig[apiName].userElementName?data[appConfig[apiName].userElementName]:data;
      var profileUserId = null;
      if(data) {
        var userIdPath = appConfig[apiName].userIdPath.split('.'); 
        var profileUser = data;
        for(var i=0;i<userIdPath.length;i++) {
          if(i==userIdPath.length-1) {
            profileUserId = profileUser[userIdPath[i]];
          }
          else {
            profileUser = profileUser[userIdPath[i]];
          }
        }
      }

      if(profileUserId) { 
        fullUser = {};
        fullUser.profile = data;
        fullUser._id = apiName + "~" + profileUserId; 
        fullUser.token = fakeUser.token;
        fullUser.tokenSecret = fakeUser.tokenSecret;
      } 
      done(null, fullUser);
    };
    handleRequest(apiName,fakeUser,options,callback);  
  };

  if(appConfig[apiName].type == 'oauth-1.0') {
    // setup oauth1 through passport
    passport.use(apiName, 
      new OAuthStrategy({
          userAuthorizationURL: appConfig[apiName].authorizationUrl,
          requestTokenURL: appConfig[apiName].requestTokenUrl,
          accessTokenURL: appConfig[apiName].accessTokenUrl,
          consumerKey: appConfig[apiName].clientId,
          consumerSecret: appConfig[apiName].clientSecret,
          callbackURL: appConfig[apiName].callbackUrl,
      }, strategyCallback
    ));
  }
  else if(appConfig[apiName].type == 'oauth-2.0') {
    /* TODO LATER
    // setup oauth2 through passport
    passport.use(apiName, 
      new OAuth2Strategy({
          authorizationURL: appConfig[apiName].authorizationUrl,
          tokenURL: appConfig[apiName].accessTokenUrl,
          clientID: appConfig[apiName].clientId,
          clientSecret: appConfig[apiName].clientSecret,
          callbackURL: appConfig[apiName].callbackUrl 
      }, strategyCallback
    ));
    */
  }
  else {
    console.log(apiName + " has unknown auth type of " + appConfig[apiName].type);
  }
};
passportPlugin.register = register;

// simplified request handling
var handleRequest = function(apiName, user, options, callback) {
  console.log('handling request to ' + options.uri);

  passport._strategy(apiName)._oauth.get(appConfig[apiName].baseUrl+options.uri, user.token, user.tokenSecret, function (error, body, response) {
      if(error) {
        console.log('handle request error ' + JSON.stringify(error));
        callback(user,null);
        return;
      }

      if (response.statusCode === 200) {
        //console.log("RESULT=" + body);
        callback(user,JSON.parse(body));
      } else {
        console.log('handle request error ' + response.statusCode);
        callback(user,response.statusCode);
    }
  });
};
passportPlugin.handleRequest = handleRequest;

var auth = function(apiName,streams) {
  //console.log('auth attempt');
  passport.authenticate(apiName)(streams.req,streams.res,streams.next);
}
passportPlugin.auth = auth;

var authCallback = function(apiName,urls,streams) {
  //console.log('authCallback attempt');
  passport.authenticate(apiName, 
                          { 
                            'successRedirect' : urls.successUrl, 
                            'failureRedirect' : urls.failureUrl 
                          }
                       )(streams.req,streams.res,streams.next);
}
passportPlugin.authCallback = authCallback;

module.exports = passportPlugin;
