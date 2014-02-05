var appConfig = require('./ingest-config'),
    request = require('request');

var ingestPlugin = {};

var db = undefined;

var init = function(app, dbConn) {
  db = dbConn;
};  
ingestPlugin.init = init;

var ingest = function(meta,data, done) {
  data._meta = { 
    'user' : meta.user,
    'api' : meta.api,
    'url' : meta.url,
    'createTime' : new Date().getTime()
  };
                   
  db.collection('temporary').save(data, function(err,doc){
     if(err) {
       console.log('Failed to save temp data: ' + JSON.stringify(err));
       done(undefined);
     } else {
       if(typeof doc === "array") {
         var docs = []; // should use _ here
         for(var i=0;i<doc.length;i++) {
           docs.push(doc[i]._id); 
         }
         done(docs);
       }
       else {
         done([doc._id]);
       }
     }
  });
};
ingestPlugin.ingest = ingest;

var query = function(meta,query,done) {

  if(!meta || !meta.user || meta.user.trim().length==0) {
     console.log('Queries must have user');
     done(undefined);
     return;
  }

  var data = {};

  for(var key in query) {
    var value = query[key];
    // make sure the data is clean
    if(typeof key === "string"            // key is string
       && typeof value  === "string"      // value is string
       && key.trim().length > 0           // key must not be empty
       && key.match(/^[a-zA-Z0-9._-]$/)   // key only alpha, numeric, dot, underscore, dash
       && value.trim().length > 0) {      // value must not be empty
      data[key] = query[key];
    }
  }

  // this must be last
  data['_meta.user'] = meta.user;
                   
  db.collection('temporary').find(data, function(err,docs){
     if(err) {
       console.log('Failed to find matching data: '); // + JSON.stringify(err));
       done(undefined);
     } 
     else {
       if(typeof docs === "array") {
         if(docs.length>20) { // limit this to 20 records
           console.log("Limiting to 20 records instead of " + docs.length);
           done(docs.splice(0,20));
         }
         else {
          done(docs);
         }
       } 
       else if(docs) {
         done([docs]);
       }
       else {
         done([]);
       }
     }
  });

};
ingestPlugin.query = query;

module.exports = ingestPlugin;
