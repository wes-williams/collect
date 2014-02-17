#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var mongodb = require('mongodb');
var persona = require('./persona.js');
var passport = require('./passport.js');
var storage = require('./storage.js');
var commonConfig = require('./common-config.js');


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        // OPENSHIFT_INTERNAL_ is and old convention. OPENSHIFT_NODEJS_ is the new one
        self.ipaddress = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

        self.dbHost = process.env.OPENSHIFT_MONGODB_DB_HOST;
        self.dbPort = process.env.OPENSHIFT_MONGODB_DB_PORT;

        if(typeof self.dbHost === "undefined") {
          console.warn('No OPENSHIFT_MONGO_DB_HOST var, using 127.0.0.1');
          self.dbHost = '127.0.0.1';
          self.dbPort = '27017';
        }

        self.dbServer = new mongodb.Server(self.dbHost, parseInt(self.dbPort));
        self.db = new mongodb.Db(commonConfig.db, self.dbServer, {auto_reconnect: true});
        self.dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
        self.dbPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_INTERNAL_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };
        self.routes.get = { };
        self.routes.post = { };
        self.routes.del = { };

        self.routes.get['/status'] = function(req, res) {
          res.send('ok');
        };

        self.routes.get['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };

        self.routes.post['/session'] = function(req,res) { 
          if(req.session.user) {
            res.json({ email : req.session.user.id });
          }
          else {
            persona.login(req,res); 
          }
        }

        self.routes.del['/session'] = persona.logout;
        self.routes.get['/session'] = function(req,res) {
          res.json({ 'user' : req.session.user });
        };

        self.routes.post['/auth/:apiName'] = function(req,res,next) { 

          if(req.session.user == undefined) {
            res.json({'error' : 'user not found'})
            return;
          }

          var apiName = req.param('apiName');
          if(!passport.hasApi(apiName)) {
            res.json({'error' : 'api not found'})
            return;
          }

          passport.auth(apiName,
                        { 'req' : req, 'res' : res, 'next' : next }); 
        };

        self.routes.get['/auth/:apiName'] = function(req,res,next) { 

          if(req.session.user == undefined) {
            res.json({'error' : 'user not found'})
            return;
          }

          var apiName = req.param('apiName');
          if(!passport.hasApi(apiName)) {
            res.json({'error' : 'api not found'})
            return;
          }

          var findUserCallback = function(user) {
            res.json({'api' : { 'name' : apiName, enabled : user===undefined } });
          };
          passport.findUser(apiName,req,findUserCallback);
        };

        self.routes.get['/auth/:apiName/callback'] = function(req,res,next) {

          if(req.session.user == undefined) {
            res.json({'error' : 'user not found'})
            return;
          }

          var apiName = req.param('apiName');
          if(!passport.hasApi(apiName)) {
            res.json({'error' : 'api not found'})
            return;
          }

          passport.authCallback(apiName,
                        { 'successUrl' : '/', 'failureUrl' : '/?e=1' },
                        { 'req' : req, 'res' : res, 'next' : next }); 
        };
                                                                     
        self.routes.get['/api/:apiName/*'] = function(req,res,next) { 

          var apiName = req.param('apiName');

          var findUserCallback = function(user) {
            if(user==undefined) {
              res.json({'error' : 'no auth found'})
              return;
            }

            var options = {};
            options.method = 'GET';
            options.uri = req.url.substring(5+apiName.length);

            var jsonp = req.query.jsonp;
            var jsonpResponse = null;
            if(jsonp) {
              var paramString = passport.findParamStringInUri('jsonp', jsonp, options.uri);
              options.uri = options.uri.replace(paramString,'');

              jsonpResponse = function(data) {
                  res.header('Content-Type','application/javascript');
                  res.header('charset','utf-8');
                  res.send(jsonp + '(' + JSON.stringify(data) + ');'); 
              };
            }

            if(user.isComposite === true && user._id == undefined) {
              passport.handleComposite(apiName,options,req, function(data) {
                if(jsonp) {
                  jsonpResponse(data);
                }
                else {
                  res.json(data); 
                }
              });  
            } else if(user._id && options.uri == '/') {
              if(jsonp) {
                jsonpResponse(user.profile);
              }
              else {
                res.json(user.profile);
              }
            } else {
              passport.handleRequest(apiName,user,options, function(user,data) {
                if(jsonp) {
                  jsonpResponse(data);
                }
                else {
                  res.json(data); 
                }
              });  
            }
          };

          passport.findUser(apiName,req,findUserCallback);
        };

        self.routes.get['/data'] = function(req,res,next) { 

          if(req.session.user == undefined) {
            res.json({'error' : 'user not found'})
            return;
          }

          var meta = { 
            'user' : req.session.user.id
          };

          storage.query(meta,req.query, function(docs) {
            if(docs) {
              res.json({ 'count' : docs.length, 'data' : docs}); 
            }
            else {
              res.json({'error' : 'failed to query data'});
            }
          });
        };

        self.routes.post['/data/:apiName/*'] = function(req,res,next) { 

          var apiName = req.param('apiName');

          var findUserCallback = function(user) {
            if(user==undefined) {
              res.json({'error' : 'no auth found'});
              return;
            }

            var options = {};
            options.method = 'GET';
            options.uri = req.url.substring(6+apiName.length);

            var ingestionCallback = function(data) {
              if(!data) {
                res.json({'error' : 'failed to find data'});
                return;
              }

              // metadata to group ingestions with later
              var meta = { 
                'api' : user._api ? user._api : user.api, 
                'user' : req.session.user.id,
                'url' : options.uri
              };

              storage.ingest(meta,data, function(docs) {
                if(Array.isArray(docs)) {
                  res.json({ 'refs' : docs}); 
                }
                else {
                  res.json({'error' : 'failed to save data'});
                }
              });
            };

            if(user.isComposite === true && user._id == undefined) {
              passport.handleComposite(apiName,options,req, function(data) {
                ingestionCallback(data);
              });  
            } else {
              passport.handleRequest(apiName,user,options, function(user,data) {
                ingestionCallback(data);
              });  
            }
          };

          passport.findUser(apiName,req,findUserCallback);
        };
    };

    // PERSONA CAN'T SWITCH BETWEEN HTTP AND HTTPS
    // https://www.openshift.com/kb/kb-e1044-how-to-redirect-traffic-to-https
    function redirectSec(req, res, next) {
      if (req.headers['x-forwarded-proto'] == 'http') { 
        res.redirect('https://' + req.headers.host + req.path);
      } else {
        return next();
      }
    }

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();
        self.app.configure(function() {
          self.app.use(express.bodyParser());
          self.app.use(express.cookieParser());
          self.app.use(express.session({ secret: 'keep-this-private' }));
          self.app.use(express.static(__dirname + '/public'));

          passport.init(self.app, self.db);
          storage.init(self.app, self.db);
        });

        //  Add handlers for the app (from the routes).
        // get only
        for (var r in self.routes.get) {
            self.app.get(r, redirectSec, self.routes.get[r]);
        }
        //post only
        for (var r in self.routes.post) {
            self.app.post(r, self.routes.post[r]);
        }
        //del only
        for (var r in self.routes.del) {
            self.app.del(r, self.routes.del[r]);
        }

    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        self.db.open(function(err, db){
          if(err){ throw err };
          self.db.authenticate(self.dbUser, self.dbPass, function(err, res){
            if(err){ throw err };
          });
        });
        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };


};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

