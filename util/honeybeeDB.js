/**
 * Author: Sai
 */

var common = require("../util/common");
var db;


function incrementLiveReqCount(callback,serverId){

	db.collection("servers", function (err, connection){

		if(!err){

			connection.findAndModify({query: {"serverId": serverId },update: { $inc: { "liveReq": 1 } }, upsert: true },function(err,result){

				if(err){
					console.log("Error WHile Updating.");
				}
				else{
					console.log("Recorded Updated.");
				}
			});
		}
		else{
			console.log("Error in connection.");
		}
	});
}

exports.incrementLiveReqCount = incrementLiveReqCount;



function decrementLiveReqCount(callback,serverId){

	db.collection("servers", function (err, connection){

		if(!err){

			connection.findAndModify({query: {"serverId": serverId },update: { $inc: { "liveReq": -1 } }, upsert: true },function(err,result){

				if(err){
					console.log("Error WHile Updating.");
				}
				else{
					console.log("Recorded Updated.");
				}
			});
		}
		else{
			console.log("Error in connection.");
		}
	});
}

exports.decrementLiveReqCount = decrementLiveReqCount;

