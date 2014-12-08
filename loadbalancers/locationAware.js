/*
 * Location Aware Multi user Resource allocation load Balancing Algorithm Implementation.
 */
var closestServer=0;
var shortestDistance=0;
var db = require("../util/common");
var algo = require("../loadbalancers/"+loadBal);
function allocateServer(callback,conf, req)
{
	if(req.body.hasOwnProperty('lattitude') && req.body.hasOwnProperty('longitude'))
	{
		var serverList;
		db.findAvailableServersWithResources(function (error, servers)
				{
			if(error)
			{
				console.log("Error returning the server List: " + error);
				callback(new Error("No Servers found to handle Requests"), null);
			}
			else if(servers.length==0)
			{
				console.log("No active servers available with requested resources");
				callback(new Error("No Servers found to handle Requests"), null);
			}
				},conf,quantity, req.body.algoOptimization);
		for(server in serverList)
		{

			if(shortestDistance==0)
			{
				distance(req.body.lattitude,req.body.longitude,server.lattitude, server.longitude, function(error, distance){
					shortestDistance=distance;
					closestServer=node.nodeId;
				});
				
			}
			else
			{
				distance(req.body.lattitude,req.body.longitude,server.lattitude, server.longitude, function(error,distance)
					{
						if(distance<shortestDistance)
							{
								shortestDistance=distance;
								closestServer=server.nodeId;
							}
					});
			}

		}
		shortestDistance=0;
		callback(null, closestServer);
	}
	else
	{
		callback(new Error("No Servers found to handle Requests"), null);
	}

}
exports.allocateServer = allocateServer;

function performServerTask(conf, req, callback)
{
	
	//decrease server resourceCount
	db.updateServerResourceCount(conf.nodeId, req.body.quantity);
	console.log("****** Request For Resource recieved with the following Configuration");
	console.log("** CPU --> " + req.body.CPU  + "**");
	console.log("** DISK --> " + req.body.disk  + "**");
	console.log("** RAM --> " + req.body.ram  + "**");
	console.log("** MOBILE OS --> " + req.body.mobile_os  + "**");
	console.log("** DURATION --> " + req.body.duration  + "**");
	console.log("** QUANTITY --> " + req.body.quantity  + "**");
	console.log("** LATITUDE --> " + req.body.latitude  + "**");
	console.log("** LONGITUDE --> " + req.body.longitude  + "**");
	
	db.findServerDetailsById(function(err, server)
			{
				if (error)
					{
						console.log("DB nahi chalta, Error from FindServerDetailsbyID : " + error );
						callback(new Error("Error from FindServerDetailsbyID"), null);
					}
				else
					{
						var totalCost= server.cost*req.body.quantity();
						callback(null,totalCost);
					}
			},
		conf.nodeId);
	
}
exports.performServerTask = performServerTask;




function distance(lat1, lon1, lat2, lon2, callback) 
{
	theta = lon1 - lon2;
	dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
	dist = Math.acos(dist);
	dist = rad2deg(dist);
	dist = dist * 60 * 1.1515;
	callback(null,dist);
}

function deg2rad(deg) {
	return (deg * Math.PI / 180.0);
}
function rad2deg(rad) {
	return (rad * 180.0 / Math.PI);
}

