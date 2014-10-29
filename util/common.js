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


function updateServerDetails(json){

	if(json.serverName && json.serverId && json.liveReq ){

		db = getConnection();
		
		db.collection("servers", function (err, connection){

			if(!err){

			connection.save({'serverName':json.serverName,'serverId':json.serverId, 'liveReq': json.liveReq, 'resourceCount': json.resourceCount},function (err,result){
			
				if(err){
				
					console.log(err);
					closeConnection(db);
				}
						
				else{
				
					var status = "Successfully Inserted";
					closeConnection(db);
					console.log("Operation Successful.");
					callback(err,status);
				}
			
				});
			}
			else{
				console.log("Database Collection Error.");
				closeConnection(db);
			}

		});
	}
	else{
		console.log("Incomplete JSON.");
		closeConnection(db);
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
					closeConnection(db);
				}
						
				else{
				
					var status = "Successfully Inserted";
					closeConnection(db);
					console.log("Operation Successful.");
					callback(err,status);
				}
			
				});
			}
			else{
				console.log("Database Collection Error.");
				closeConnection(db);
			}

		});
	}
	else{
		console.log("Incomplete JSON.");
		closeConnection(db);
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

			connection.find({'resourceCount': { $gt : quantity } },function(err,res){

				//Check server entries in config and match against database results.
				res.toArray(function(err,docs){
					
					if(!docs.length==0)
					{
						if(conf.server.serverNodes.length!=0){
						
							for(var i=0; i<docs.length; i++)
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
							closeConnection(db);
						}
					}
					else{
						console.log("No Servers In Database.");
						availableLiveServersString = "";
						closeConnection(db);
					}

					closeConnection(db);
					callback(err,availableLiveServersString);
				});
			});
		}

		else{

			console.log("Error Connecting to Database.");
			closeConnection(db);

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
					closeConnection(db);
				}
				
				else{
					closeConnection(db);
					callback(err,res);
				}
			});
		}

		else{

			console.log("Collection Error.")
			closeConnection(db);
		}
			
	});
}
exports.findServerDetailsById = findServerDetailsById;


function createWorkerServers(callback,conf){

	for(node in conf.server.serverNodes)
	 {
	  	var server=conf.server.serverNodes[node];
	  	console.log("Server " + server.nodeName + " for handling requests at port " + server.port );

	  	if(server.nodeName && server.nodeId && server.resourceCount ){

			db = getConnection();
		
			db.collection("servers", function (err, connection){

				if(!err){

					connection.insert({'serverName':server.nodeName,'serverId':server.nodeId, 'liveReq': "0", 'resourceCount': server.resourceCount},function (err,result){
			
					if(err){
				
						console.log(err);
						closeConnection(db);
					}
						
					else{
				
						var status = "Successfully Inserted";
						closeConnection(db);
						console.log("Operation Successful.");
						callback(err,status);
					}
			
					});
				}
				else{
					console.log("Database Collection Error.");
					closeConnection(db);
				}

			});
		
		}

		else{
			console.log("Incomplete JSON.");
			closeConnection(db);
		}
	}
}

exports.createWorkerServers = createWorkerServers;

