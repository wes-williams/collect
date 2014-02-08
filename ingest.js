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
       if(Array.isArray(doc)) {
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

  // inspect and translate the params for query
  try {
    for(var key in query) {
      var value = query[key];
      var operator = 'eq'; // equal is the default operator

      // key~op indicates which operator should be used.
      if(key.match(/^.+\~(eq|lt|lte|gt|ne|in|nin|re|rei)$/i)) { // NOTE: case insensitive here
        var delimPosition = key.lastIndexOf('~');
        operator = key.substring(delimPosition+1).toLowerCase();
        key = key.substring(0,delimPosition);
      }

      // make sure the data is clean
      if(!(typeof key === "string"            // key is string
         && typeof value  === "string"      // value is string
         && key.trim().length > 0           // key must not be empty
         && key.match(/^[a-zA-Z0-9._-]+$/)   // key only alpha, numeric, dot, underscore, dash
         && value.trim().length > 0)) {      // value must not be empty
        throw ('invalid parameter: ' + key + ' = ' + value);

      }

      // cast values. take into account that value may need to be split
      var castValues = operator.match(/^(in|nin)$/) ? value.split('~') : [value];
      for(var v=0;v<castValues.length;v++) { 
        var castValue = castValues[v];

        // handle casting
        if(castValue.match(/^[+-]?[0-9]+$/)) {
          castValue = parseInt(castValue); 
        }
        else if(castValue.match(/^[+-]?[0-9]+\.[0-9]+$/)) {
          castValue = parseFloat(castValue); 
        }

        castValues[v] = castValue;
      }
      value = castValues.length==1 ? castValues[0] : castValues; 

      if(operator === "eq") {
        data[key] = value;
      }
      if(operator === "re" || operator === "rei") {
        try {
          var regex;
          if(operator === "rei") {
            regex = new RegExp(value,"i");
          }
          else {
            regex = new RegExp(value);
          }
          data[key] = regex;
        }
        catch(e) {
          throw ('invalid regex: ' + value);
        }
      }
      else {
        var conditionKey = '$' + operator;
        var conditionValue;
        // account for array values for IN and NOT IN
        if(operator.match(/^(in|nin)$/)) {
          if(Array.isArray(value)) {
            conditionValue = value;
          }
          else { // it needs to be an array
            conditionValue = [value];
          }
        }
        else {
          conditionValue = value;
        }
        
        //account for multiple conditions
        // only doing AND conditions right now
        // in and not in exist for OR conditions
        if(data[key]) {
          // only use condition if an equal or regex condition not present
          // equal conditions will be string values
          if(typeof(data[key]) === "string" 
             || data[key] instanceof Regexp) {
            throw  'not handling compound conditions for eq, re, or rei operators';
          }
          else {
            data[key][conditionKey] = conditionValue;
          }
        }
        else {
          data[key] = {};
          data[key][conditionKey] = conditionValue;
        }
      }
    }
    console.log("QUERY = " + JSON.stringify(data));
  }
  catch(ex) {
    console.log('INVALID QUERY: ' + ex);
    done(undefined);
    return;
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
