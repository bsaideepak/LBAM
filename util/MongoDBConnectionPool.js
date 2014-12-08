/**
 * Author: Sai
 */

var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var db;

var fs = require("fs");
var conf = (JSON.parse(fs.readFileSync("./config/conf.json", "utf8")));


// Initialize connection once
MongoClient.connect(conf.mongodbURI, function(err, database) {
  if(err){
    console.log("Error Creating MongoDB Connection Pool: "+err);
  }

  db = database;
});

function getConnection(callback,collectionName){

  db.collection(collectionName, function(err,coll){

    if(err){
      console.log("Error Connecting to collection: "+err);
    }
    else{
      callback(null,coll);
    }

  });
}

exports.getConnection = getConnection;





