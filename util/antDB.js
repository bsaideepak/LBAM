/**
 * Author: Sai
 */

var common = require("../util/common");
var db;

function getPheromoneCountValue(callback, serverId, quantity){

	db.collection("servers", function (err, connection){

		if(!err){

			connection.find({"serverId":serverId},function(err,result){

				if(err){
					console.log("Error: "+err);
					common.closeConnection(db);
					callback(err,null);

				}
				else{

					res.toArray(function(err,docs)
					{
						if(err)
						{
							console.log(err);
							common.closeConnection(db);
							callback(err,null);
						}
					
						if(!docs.length==0)
						{
							callback(null, docs[0].pheromoneCount);
						}
						else
						{
							console.log("PheromoneCountValue Not defined.");
							callback(null, new Error("heromoneCountValue Not defined."));

						}

						callback(err,docs);

					});
				}
			});

		}
		else{

		}
	});
}

exports.getPheromoneCountValue = getPheromoneCountValue;

function changePheromoneCountValue(serverId,){

	db.collection("servers", function (err, connection){

		if(!err){

			connection.findAndModify({query: {"serverId": serverId },update: { $inc: { "pheromoneCount": pheromoneCount } }, upsert: true },function(err,result){

				if(err){
					console.log("Error WHile Updating.");
					common.closeConnection(db);
				}
				else{
					console.log("Recorded Updated.");
					common.closeConnection(db);
				}
			});
		}
		else{
			console.log("Error in connection.");
			common.closeConnection(db);
		}
	});
}

exports.changePheromoneCountValue = changePheromoneCountValue;