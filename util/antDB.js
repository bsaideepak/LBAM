/**
 * Author: Sai
 */

var common = require("../util/common");
var db;
var dbc="hc";
var mongo = require("../util/MongoDBConnectionPool");
var collectionName = "servers";

function getPheromoneCountValue(callback, serverId, quantity){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);
			
	dbc.find({"serverId":serverId},function(err,result){

		if(err){
			console.log("Error: "+err);
			//common.closeConnection(db);
			callback(err,null);

		}
		
		else{
			res.toArray(function(err,docs)
			{
				if(!err){
					
					if(!docs.length==0)
					{
						callback(null, docs[0].pheromoneCount);
					}
					else
					{
						console.log("PheromoneCountValue Not defined.");
						callback(null, new Error("heromoneCountValue Not defined."));

					}

					//callback(err,docs);
				
				}
				else
				{
					console.log(err);
					//common.closeConnection(db);
					callback(err,null);
				}
			});
		}
	});
}

exports.getPheromoneCountValue = getPheromoneCountValue;

function changePheromoneCountValue(serverId){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);
	
	dbc.findAndModify({query: {"serverId": serverId },update: { $inc: { "pheromoneCount": pheromoneCount } }, upsert: true },function(err,result){

		if(err){
			console.log("Error WHile Updating.");
			//common.closeConnection(db);
		}
		
		else{
			console.log("Recorded Updated.");
			//common.closeConnection(db);
		}
	});
}

exports.changePheromoneCountValue = changePheromoneCountValue;