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
    var operator = 'eq'; // equal is the default operator

    // key~op indicates which operator should be used.
    if(key.match(/^.+\~(eq|lt|lte|gt|ne|in|nin|re)$/i)) { // NOTE: case insensitive here
      var delimPosition = key.lastIndexOf('~');
      key = key.substring(0,delimPosition);
      operator = key.substring(delimPosition+1).toLowerCase();
    }

    // make sure the data is clean
    if(typeof key === "string"            // key is string
       && typeof value  === "string"      // value is string
       && key.trim().length > 0           // key must not be empty
       && key.match(/^[a-zA-Z0-9._-]+$/)   // key only alpha, numeric, dot, underscore, dash
       && value.trim().length > 0) {      // value must not be empty
      // handle casting
      if(value.match(/^[0-9]+$/)) {
        value = parseInt(value); 
      }
      else if(value.match(/^[0-9]\.[0-9]+$/)) {
        value = parseFloat(value); 
      }
      
      if(operator === "eq") {
        data[key] = value;
      }
      else {
        var conditionKey = '$' + operator;
        var conditionValue;
        // account for array values for IN and NOT IN
        if(operator.match(/^(in|nin)$/)) {
          conditionValue = value.split('~');
        }
        else {
          conditionValue = value;
        }
        
        //account for multiple conditions
        // only doing AND conditions right now
        // in and not in exist for OR conditions
        if(data[key]) {
          // only use condition if an equal condition not present
          if(typeof(data[key]) !== "string") {
            data[key][conditionKey] = conditionValue;
          }
        }
        else {
          data[key] = {};
          data[key][conditionKey] = conditionValue;
        }
      }
      console.log("QUERY = " + JSON.stringify(data));
    }
  }

  // this must be last
  data['_meta.user'] = meta.user;
  
  var options = {
    "limit": 20
  };
                   
  db.collection('temporary').find(data,options).toArray(function(err,docs){
     if(err) {
       console.log('Failed to find matching data: ' + JSON.stringify(err));
       done(undefined);
     } 
     else {
       done(docs);
     }
  });

};
ingestPlugin.query = query;

module.exports = ingestPlugin;
