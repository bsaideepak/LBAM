/**
 * Author: Sai
 */

var MongoClient = require('mongodb').MongoClient;

function insertServerDetails(callback,json){
	
	if(json.serverName && json.serverId && json.liveReq ){

		MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {
			if(err){
				console.log("Error: "+err);
				db.close();
			}
			else
			{	
				db.collection("servers", function (err, connection){

					connection.insert({'serverName':json.serverName,'serverId':json.serverId, 'liveReq': json.liveReq},function (err,result){
						if(err){
							console.log(err);
							db.close();
						}
						else{
							var status = "Successfully Inserted";
							db.close();
							console.log("Operation Successful.");
							callback(err,status);
						}
					});
				});
			}

		});
	}
	else{
		console.log("Insufficient Data.");
		db.close();
	}
}

exports.insertServerDetails = insertServerDetails;

function updateServerDetails(json){

	if(json.serverName && json.serverId && json.liveReq ){

		MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {
			if(err){
				console.log("Error: "+err);
				db.close();
			}
			else
			{	
				db.collection("servers", function (err, connection){
					
					connection.save({'serverName':json.serverName,'serverId':json.serverId, 'liveReq': json.liveReq},function (err,result){
						if(err){
							console.log(err);
							db.close();
						}
						else{
							console.log("Successfully Updated.");
							db.close();
						}
					});
				});
			}

		});
	}
	else{
		console.log("Insufficient Data.");
		db.close();
	}
}

exports.updateServerDetails = updateServerDetails;	


function removeServerDetails(json){

	if(json.serverName && json.serverId && json.liveReq ){

		MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {
			if(err){
				console.log("Error: "+err);
				db.close();
			}
			else
			{
				db.collection("servers", function (err, connection){

					connection.remove({'serverName':json.serverName,'serverId':json.serverId, 'liveReq': json.liveReq},function (err,result){
						if(err){
							console.log(err);
							db.close();
						}
						else{
							console.log("Successfully Removed");
							db.close();
						}
					});
				});
			}
		});
	}
	else{
		console.log("Insufficient Data.");
		db.close();
	}
}

exports.removeServerDetails = removeServerDetails;

function findAllServers(callback){

	MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {

		if(err){
			console.log("Error: "+err);
			db.close();
		}
		else
		{
			db.collection("servers", function (err, connection){
				if(err){
					console.log("No such database exists.");
					db.close();
				}
				else{
					connection.find(function(err,res){
						if(err){
							console.log("No Server exists.");
							db.close();
						}
						else{
							db.close();
							callback(err,res);
						}
					});
				}

			});
		}
	});
}
exports.findAllServers = findAllServers;

function findServerDetailsById(callback,serverId){

	MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {

		if(err){
			console.log("Error: "+err);
			db.close();
		}
		else
		{
			db.collection("servers", function (err, connection){
				if(err){
					console.log("No such database exists.");
					db.close();
				}
				else{
					connection.find({"serverId":serverId},function(err,res){
						if(err){
							console.log("No Server exists.");
							db.close();
						}
						else{
							db.close();
							callback(err,res);
						}
					});
				}

			});
		}
	});
}
exports.findServerDetailsById = findServerDetailsById;
