/**
 * Author: Sai
 */

var common = require("../util/common");
var db;
var dbc="hc";
var mongo = require("../util/MongoDBConnectionPool");
var collectionName = "servers";

function incrementLiveReqCount(serverId){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
				dbc.findAndModify({query: {"serverId": serverId },update: { $inc: { "liveReq": 1 } }, upsert: true },function(err,result){
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
	},collectionName);


}

exports.incrementLiveReqCount = incrementLiveReqCount;

function decrementLiveReqCount(serverId){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
	dbc.findAndModify({query: {"serverId": serverId },update: { $inc: { "liveReq": -1 } }, upsert: true },function(err,result){

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
	},collectionName);

}

exports.decrementLiveReqCount = decrementLiveReqCount;

