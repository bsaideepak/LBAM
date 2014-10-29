var MongoClient = require('mongodb').MongoClient;
var fs = require("fs");
var conf = (JSON.parse(fs.readFileSync("./config/conf.json", "utf8")));

function getConnection(callback){

	MongoClient.connect(conf.mongodbURI, {native_parser:true}, function(err, db) {

		if(err){
			console.log("Error Connection to DB: " + err );
		}	
		else{
			console.log("Connected to DB");
			callback(null,db);
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
	var flag = 0;

	db.collection("servers", function (err, connection){

		if(!err)
		{
			
			//query for resource availability when finding all servers.

			connection.find({'resourceCount': { $gt : quantity } },function(err,res)
			{
				if(err)
				{
					console.log(err);
					closeConnection(db);
					callback(err,null);
				}

				//Check server entries in config and match against database results.
				res.toArray(function(err,docs)
				{
					if(err)
					{
						console.log(err);
						closeConnection(db);
						callback(err,null);
					}
					
					if(!docs.length==0)
					{
						if(conf.server.serverNodes.length!=0)
						{
						
							for(var i=0; i<docs.length; i++)
							{
								var temp = docs[i].serverId;

								for(var j = 0; j < conf.server.serverNodes.length; j++)
								{

									if(temp == conf.server.serverNodes[j].nodeId)
									{

										flag = 1;

										//liveServers[i] = conf.server.serverNodes[j].nodeId;
										//availableLiveServersString = availableLiveServersString + docs[i].serverId + "," + docs[i].liveReq + "#";

									}
								}
								if(flag!= 1){
									
									docs.splice(i,1);
									flag=0;
								}
							}	
						}
						else{
							console.log("No Server Up and Running.");
							availableLiveServersString = "";
							closeConnection(db);
							callback(new Error("No Server Up and Running."),null);
						}
					}
					else{
						console.log("No Servers In Database.");
						availableLiveServersString = "";
						closeConnection(db);
						callback(new Error("No Servers In Database."),null);
					}

					closeConnection(db);
					callback(err,docs);
				});
			});
		}

		else{

			console.log("Error Connecting to Database.");
			closeConnection(db);
			callback(err,null);

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


function createWorkerServers(conf){

	for(node in conf.server.serverNodes)
	 {
	  	var server=conf.server.serverNodes[node];
	  	
	  	if(server.nodeName && server.nodeId && server.resourceCount ){

			db = getConnection();
		
			db.collection("servers", function (err, connection){

				if(!err){

					connection.insert({'serverName':server.nodeName,'serverId':server.nodeId, 'liveReq': "0", 'resourceCount': server.resourceCount, 'pheromoneCount': "0", "tAvg": "0"},function (err,result){
			
					if(err){
				
						console.log(err);
						closeConnection(db);
					}
						
					else{
				
						var status = "Successfully Inserted";
						closeConnection(db);
						console.log("Operation Successful.");
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

function checkCollectionEmpty(callback,colName)
{
	getConnection(function(err,db){
		if(err)
			console.log(err);
		else
			{
			console.log("DB object acquired");
			db.collection(colName, function (err, collection){

				if(!err)
				{
					console.log("collection acquired");
					collection.count(function (err, count) {
						if(err)
							{
								console.log(err);
								closeConnection(db);
								callback(err,null);
							}
						else{
							if(count === 0) {
						        console.log("count working");
						        closeConnection(db);
						        callback(null,true);
						    }
							else
								{
									console.log("servers not null");
									closeConnection(db);
									callback(null,false);
								}
						}
					});
				}
				else
				{
					console.log("Database Collection Error.");
					closeConnection(db);
				}
				});

			}
	});
}

exports.checkCollectionEmpty = checkCollectionEmpty;

