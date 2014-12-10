var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var db;
var dbc;
//Initialize connection once
var mongo = require("../util/MongoDBConnectionPool");

var collectionName = "servers";

function updateServerDetails(json){

	if(json.serverName && json.serverId && json.liveReq ){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;

				dbc.findAndModify({query: {"serverId": json.serverId },update: { $set: { 'serverName':json.serverName,'liveReq':json.liveReq, 'resourceCount':json.resourceCount, 'serverName': json.serverName } }, upsert: true },function(err,result){
					if(err){
						console.log(err);
						//closeConnection(db);
					}
					else{
						var status = "Successfully Updated";
						//closeConnection(db);
						console.log("Operation Successful.");
						callback(err,status);
					}
				});
			}
		},collectionName);
	}
	else{
		console.log("Database Collection Error.");
		//closeConnection(db);
	}
}

exports.updateServerDetails = updateServerDetails;	

function updateServerResourceCount(serverId,resourceCount)
{

	if(serverId && resourceCount ){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
				console.log("Server Id : "  + serverId);
				console.log("Resource Count : "  + resourceCount);
				dbc.findAndModify({"serverId": serverId },[['_id','asc']],{ $inc: { 'resourceCount':resourceCount }}, {'update': true },function(err,result){
					if(err){
						console.log("Error from decrease count database" + err);
						//closeConnection(db);
					}
					else{
						var status = "Successfully Updated";
						//closeConnection(db);
						console.log("Operation Successful.");
						//callback(err,status);
					}
				});

			}
		},collectionName);

	}
	else{
		console.log("Database Collection Error.");
		//closeConnection(db);
	}
}

exports.updateServerResourceCount = updateServerResourceCount;	

function removeServerDetails(json){

	if(json.serverName && json.serverId && json.liveReq ){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;

				dbc.remove({'serverName':json.serverName,'serverId':json.serverId, 'liveReq': json.liveReq, 'resourceCount': json.resourceCount},function (err,result){

					if(err){
						console.log(err);
						//closeConnection(db);
					}
					else{

						var status = "Successfully Inserted";
						//closeConnection(db);
						console.log("Operation Successful.");
						callback(err,status);
					}

				});
			}
		},collectionName);
	}
	else{
		console.log("Database Collection Error.");
		//closeConnection(db);
	}
}

exports.removeServerDetails = removeServerDetails;

function findAvailableServersWithResources(callback,conf,quantity){


	var liveServers = [];
	var liveReqCount = [];
	var availableLiveServersString;
	var flag = 0;

	mongo.getConnection(function(err,coll){

		if(err)
		{
			console.log("Error: "+err);
		}
		else
		{
			dbc = coll;
				var quant=parseInt(quantity);
				//console.log("quantity : "+ 100 + " quant : " + quant );
				dbc.find({'resourceCount' : {$gt : quant}},function(err,result)
				{
					if(err)
					{
						console.log(err);
						//closeConnection(db);
						callback(err,null);
					}
					//Check server entries in config and match against database results.
					result.toArray(function(err,docs)
					{
						if(err)
						{
							console.log(err);
							//closeConnection(db);
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
											console.log("server matched");
											flag = 1;
											//liveServers[i] = conf.server.serverNodes[j].nodeId;
											//availableLiveServersString = availableLiveServersString + docs[i].serverId + "," + docs[i].liveReq + "#";

										}
									}
									if(flag!= 1)
									{
										docs.splice(i,1);
										flag=0;
									}
								}
								callback(null,docs);
							}
							else{
								console.log("No Server Up and Running.");
								availableLiveServersString = "";
								//closeConnection(db);
								callback(new Error("No Server Up and Running."),null);
							}
						}
						else{
							console.log("No Servers In Database.");
							availableLiveServersString = "";
							//closeConnection(db);
							callback(new Error("No Servers In Database."),null);
						}

						//closeConnection(db);
						//callback(err,docs);
							});
						});
			}

	//query for resource availability when finding all servers.
	},collectionName);
}

exports.findAvailableServersWithResources = findAvailableServersWithResources;

function findAvailableServersWithResourceOptimization(callback,conf,quantity,optimizationParameter,lat,lon){


	var liveServers = [];
	var liveReqCount = [];
	var availableLiveServersString;
	var flag = 0;
	var count = 0;

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
			if(optimizationParameter == "resource")
			{

				dbc.find({'resourceCount': { $gt : quantity } }).sort({'resourceCount': -1},function(err,result)
						{
					if(err)
					{
						console.log(err);
						//closeConnection(db);
						callback(err,null);
					}

					//Check server entries in config and match against database results.
					result.toArray(function(err,docs)
							{
						if(err)
						{
							console.log(err);
							//closeConnection(db);
							callback(err,null);
						}

						if(!docs.length==0)
						{
							if(conf.server.serverNodes.length!=0)
							{
								for(var i=0; i<docs.length && count<3; i++)
								{
									var temp = docs[i].serverId;
									for(var j = 0; j < conf.server.serverNodes.length; j++)
									{
										if(temp == conf.server.serverNodes[j].nodeId)
										{
											flag = 1;
											count++;
											//liveServers[i] = conf.server.serverNodes[j].nodeId;
											//availableLiveServersString = availableLiveServersString + docs[i].serverId + "," + docs[i].liveReq + "#";
										}
									}
									if(flag!= 1)
									{
										docs.splice(i,1);
										flag=0;
									}
								}	
							}
							else{
								console.log("No Server Up and Running.");
								availableLiveServersString = "";
								//closeConnection(db);
								callback(new Error("No Server Up and Running."),null);
							}
						}
						else{
							console.log("No Servers In Database.");
							availableLiveServersString = "";
							//closeConnection(db);
							callback(new Error("No Servers In Database."),null);
						}

						count = 0;
						//closeConnection(db);
						callback(err,docs);
							});
						});
			}
			else if(optimizationParameter == "cost")
			{
				console.log("Inside Cost optimization");
				console.log("Quantity:" + quantity);
				dbc.find({'resourceCount': { $gt : quantity }}).sort({"cost":1}, function(err,result)
						{
					if(err)
					{
						console.log("Error getting data :" + err);
						//closeConnection(db);
						callback(err,null);
					}
					console.log("success: " + result);

					//Check server entries in config and match against database results.
					result.toArray(function(err,docs)
							{
						if(err)
						{
							console.log("Error Converting array : " +err);
							//closeConnection(db);
							callback(new Error("Error converting array from db"),null);
						}
						console.log("Array success: " + docs);
						if(!docs.length==0)
						{
							if(conf.server.serverNodes.length!=0)
							{
								for(var i=0; i<docs.length && count<3; i++)
								{
									var temp = docs[i].serverId;
									for(var j = 0; j < conf.server.serverNodes.length; j++)
									{
										if(temp == conf.server.serverNodes[j].nodeId)
										{
											flag = 1;
											console.log("Matched");
											//liveServers[i] = conf.server.serverNodes[j].nodeId;
											//availableLiveServersString = availableLiveServersString + docs[i].serverId + "," + docs[i].liveReq + "#";
										}
									}
									if(flag!= 1)
									{
										docs.splice(i,1);
										flag=0;
									}
								}	
							}
							else{
								console.log("No Server Up and Running.");
								availableLiveServersString = "";
								//closeConnection(db);
								callback(new Error("No Server Up and Running."),null);
							}
						}
						else{
							console.log("No Servers In Database.");
							availableLiveServersString = "";
							//closeConnection(db);
							callback(new Error("No Servers In Database."),null);
						}

						//closeConnection(db);
						callback(err,docs);
							});
						});
			}
			else if(optimizationParameter == "location"){

				var distArray = [];

				dbc.find({'resourceCount': { $gt : quantity }}, function(err,result)
						{
					if(err)
					{
						console.log(err);
						//closeConnection(db);
						callback(err,null);
					}

					//Check server entries in config and match against database results.
					result.toArray(function(err,docs)
							{
						if(err)
						{
							console.log(err);
							//closeConnection(db);
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

											theta = lon - docs[i].longitude;
											dist = Math.sin(deg2rad(lat)) * Math.sin(deg2rad(docs[i].latitude)) + Math.cos(deg2rad(lat)) * Math.cos(deg2rad(docs[i].latitude)) * Math.cos(deg2rad(theta));
											dist = Math.acos(dist);
											dist = rad2deg(dist);
											dist = dist * 60 * 1.1515;

											distArray[i].serverId = docs[i].serverId;
											distArray[i].distance = dist;
											distArray[i].serverName = docs[i].serverName;
											distArray[i].liveReq = docs[i].liveReq;
											distArray[i].resourceCount = docs[i].resourceCount;
											distArray[i].pheromoneCount = docs[i].pheromoneCount;
											distArray[i].tAvg = docs[i].tAvg;
											distArray[i].Cost = docs[i].Cost;
											distArray[i].latitude = docs[i].latitude;
											distArray[i].longitude = docs[i].longitude;

											//liveServers[i] = conf.server.serverNodes[j].nodeId;
											//availableLiveServersString = availableLiveServersString + docs[i].serverId + "," + docs[i].liveReq + "#";
										}
									}
									if(flag!= 1)
									{
										docs.splice(i,1);
										flag=0;
									}
								}	
							}
							else{
								console.log("No Server Up and Running.");
								availableLiveServersString = "";
								//closeConnection(db);
								callback(new Error("No Server Up and Running."),null);
							}
						}
						else{
							console.log("No Servers In Database.");
							availableLiveServersString = "";
							//closeConnection(db);
							callback(new Error("No Servers In Database."),null);
						}

						//closeConnection(db);
						callback(err,distArray);
							});
						});
			}

		}
	},collectionName);

	//query for resource availability when finding all servers.
}


exports.findAvailableServersWithResourceOptimization = findAvailableServersWithResourceOptimization;



function findServerDetailsById(callback,serverId)
{
	console.log("Inside find server details");
	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		
		else{
			console.log("connected");
			dbc = coll;
			dbc.find({"serverId":serverId},function(err,result){

				if(err){
					console.log("No Server exists.");
					//closeConnection(db);
				}
				else{
					
					result.toArray(function(err,docs){
						
						if(docs.length!=0){
							console.log("YO :" +docs[0].serverId);
							console.log("YO :" +docs.serverId);
							console.log("YO :" +docs);
							callback(null,docs[0]);
						}
		
					});
					//closeConnection(db);
				}
			});
		}
	},collectionName);


}
exports.findServerDetailsById = findServerDetailsById;


function createWorkerServers(conf){

	for(node in conf.server.serverNodes)
	{
		var server=conf.server.serverNodes[node];

		if(server.nodeName && server.nodeId && server.resourceCount ){

			mongo.getConnection(function(err,coll){
				if(err){
					console.log("Error: "+err);
				}
				else{
					dbc = coll;

					dbc.insert({'serverName':server.nodeName,'serverId':server.nodeId, 'liveReq': "0", 'resourceCount': server.resourceCount, 'pheromoneCount': "0", "tAvg": "0", 'cost': server.cost, 'latitude':server.latitude, 'longitude':server.longitude},function (err,result){
						if(err){
							console.log(err);
							//closeConnection(db);
						}

						else{
							var status = "Successfully Inserted";
							//closeConnection(db);
							console.log("Operation Successful.");
						}

					});
				}
			},collectionName);


		}

		else{
			console.log("Database Collection Error.");
			//closeConnection(db);
		}

	}
}

exports.createWorkerServers = createWorkerServers;

function checkCollectionEmpty(callback)
{
	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
			dbc.count(function (err, count) {

				if(err)
				{
					console.log(err);
					//closeConnection(db);
					callback(err,null);
				}

				else{
					if(count === 0) 
					{
						console.log("count working");
						//closeConnection(db);
						callback(null,true);
					}
					else
					{
						console.log("servers not null");
						//closeConnection(db);
						callback(null,false);
					}
				}
			});
		}
	},collectionName);


}

exports.checkCollectionEmpty = checkCollectionEmpty;
