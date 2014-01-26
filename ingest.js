var appConfig = require('./ingest-config'),
    request = require('request');

var ingestPlugin = {};

var db = undefined;

var init = function(app, dbConn) {
  db = dbConn;
};  
ingestPlugin.init = init;

var ingest = function(groups,data, done) {
  data._groups = { 
    '_user' : groups.user.id,
    '_api' : groups.api,
    'url' : groups.url,
    'createTime' : new Date().getTime()
  };
                   
  db.collection('temporary').save(data, function(err,doc){
     if(err) {
       console.log('Failed to save temp data: ' JSON.stringify(err));
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

module.exports = ingestPlugin;
