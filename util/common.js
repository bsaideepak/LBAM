var MongoClient = require('mongodb').MongoClient;

function getConnection(){

	MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {

		if(err){
			console.log("Error Connection to DB: " + err );
		}
		else{
			return db;
		}

	});
}

exports.getConnection = getConnection;

function closeConnection(db){

	db.close();

}

exports.closeConnection = closeConnection;

function insertServerDetails(callback,json){
	
	if(json.serverName && json.serverId && json.liveReq ){

		db = getConnection();
		
		db.collection("servers", function (err, connection){

			if(!err){

				connection.insert({'serverName':json.serverName,'serverId':json.serverId, 'liveReq': json.liveReq, 'resourceCount': json.resourceCount},function (err,result){
			
				if(err){
				
					console.log(err);
					common.closeConnection(db);
				}
						
				else{
				
					var status = "Successfully Inserted";
					common.closeConnection(db);
					console.log("Operation Successful.");
					callback(err,status);
				}
			
				});
			}
			else{
				console.log("Database Collection Error.");
			}

		});
	}
	else{
		console.log("Incomplete JSON.");
	}

}

exports.insertServerDetails = insertServerDetails;


function updateServerDetails(json){

	if(json.serverName && json.serverId && json.liveReq ){

		db = getConnection();
		
		db.collection("servers", function (err, connection){

			if(!err){

			connection.save({'serverName':json.serverName,'serverId':json.serverId, 'liveReq': json.liveReq, 'resourceCount': json.resourceCount},function (err,result){
			
				if(err){
				
					console.log(err);
					common.closeConnection(db);
				}
						
				else{
				
					var status = "Successfully Inserted";
					common.closeConnection(db);
					console.log("Operation Successful.");
					callback(err,status);
				}
			
				});
			}
			else{
				console.log("Database Collection Error.");
			}

		});
	}
	else{
		console.log("Incomplete JSON.");
	}
}

exports.updateServerDetails = updateServerDetails;	

function removeServerDetails(json){

	if(json.serverName && json.serverId && json.liveReq ){

		db = getConnection();
		
		db.collection("servers", function (err, connection){

			if(!err){

			connection.remove({'serverName':json.serverName,'serverId':json.serverId, 'liveReq': json.liveReq, 'resourceCount': json.resourceCount},function (err,result){
			
				if(err){
				
					console.log(err);
					common.closeConnection(db);
				}
						
				else{
				
					var status = "Successfully Inserted";
					common.closeConnection(db);
					console.log("Operation Successful.");
					callback(err,status);
				}
			
				});
			}
			else{
				console.log("Database Collection Error.");
			}

		});
	}
	else{
		console.log("Incomplete JSON.");
	}
}

exports.removeServerDetails = removeServerDetails;

function findAvailableServersWithResources(callback,conf,quantity){

	db = getConnection();

	var liveServers = [];
	var liveReqCount = [];
	var availableLiveServersString;
		
	db.collection("servers", function (err, connection){

		if(!err){
			
			//query for resource availability when finding all servers.

			connection.find({'resourceCount': { $gt : 0 } },function(err,res){

				//Check server entries in config and match against database results.
				res.toArray(function(err,docs){
					
					if(!docs.length==0)
					{
						if(conf.server.serverNodes.length!=0){
						
							for(var i=1; i<docs.length; i++)
							{
								var temp = docs[i].serverId;

								for(var j = 0; j < conf.server.serverNodes.length; j++){

									if(temp == conf.server.serverNodes[j].nodeId){

										//liveServers[i] = conf.server.serverNodes[j].nodeId;
										availableLiveServersString = availableLiveServersString + docs[i].serverId + "," + docs[i].liveReq + "#";

									}
								}
							}	
						}
						else{
							console.log("No Server Up and Running.");
							availableLiveServersString = "";
						}
					}
					else{
						console.log("No Servers In Database.");
						availableLiveServersString = "";
					}

					common.closeConnection(db);
					callback(err,availableLiveServersString);
				});
			});
		}

		else{

			console.log("Error Connecting to Database.");

		}
	});
}


exports.findAvailableServersWithResources = findAvailableServersWithResources;


function findServerDetailsById(callback,serverId){

	db = getConnection();
		
	db.collection("servers", function (err, connection){

		if(!err){
			
			connection.find({"serverId":serverId},function(err,res){
				
				if(err){
					console.log("No Server exists.");
					common.closeConnection(db);
				}
				
				else{
					common.closeConnection(db);
					callback(err,res);
				}
			});
		}

		else{

			console.log("Collection Error.")
		}
			
	});
}
exports.findServerDetailsById = findServerDetailsById;