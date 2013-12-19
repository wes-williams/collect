var appConfig = require('./ingest-config'),
    request = require('request');

var ingestPlugin = {};

var db = undefined;

var init = function(app, dbConn) {
  db = dbConn;
};  
ingestPlugin.init = init;

var ingest = function(user,data, done) {
  db.collection('temporary').save(data, function(err,doc){
     if(err) {
       console.log('Failed to save temp data: ' JSON.stringify(err));
       done(undefined);
     } else {
       done(doc._id);
     }
  });
};
ingestPlugin.ingest = ingest;

module.exports = ingestPlugin;
