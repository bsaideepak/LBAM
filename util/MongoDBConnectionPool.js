/**
 * Author: Sai
 */

var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var db;

var fs = require("fs");
var conf = (JSON.parse(fs.readFileSync("./config/conf.json", "utf8")));


//Initialize connection once


function getConnection(callback,collectionName){

	if(db == null){
		MongoClient.connect("mongodb://sai:sai@ds063140.mongolab.com:63140/ldb", function(err, database) {
			if(err){
				console.log("Error Creating MongoDB Connection Pool: "+err);
			}
			else{
				db = database;
				
				db.collection(collectionName, function(err,coll){

					if(err){
						console.log("Error Connecting to collection: "+err);
					}
					else{
						callback(null,coll);
					}
				});
			}
		});
	}
	else{
		
		db.collection(collectionName, function(err,coll){

			if(err){
				console.log("Error Connecting to collection: "+err);
			}
			else{
				callback(null,coll);
			}
		});
	}
}

exports.getConnection = getConnection;





