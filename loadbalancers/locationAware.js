/*
 * Location Aware Multi user Resource allocation load Balancing Algorithm Implementation.
 */
var closestServer=0;
var shortestDistance=0;
var db = require("../util/common");
function allocateServer(callback,conf, req)
{
	if(req.body.hasOwnProperty('latitude') && req.body.hasOwnProperty('longitude'))
	{
		var serverList;
		db.findAvailableServersWithResources(function(error, servers)
		{
			if(error)
			{
				console.log("Error returning the server List: " + error);
				callback(new Error("No Servers found to handle Requests because of Database Error"), null);
			}
			else if(servers.length==0)
			{
				console.log("No active servers available with requested resources");
				callback(new Error("No Servers found to handle Requests because server array returned null"), null);
			}
		var reqlat = parseFloat(req.body.latitude);
		var reqlon = parseFloat(req.body.longitude);
		
			for(server in servers)
			{
				//console.log("server : " + servers[server].latitude );
				var servlat = parseFloat(servers[server].latitude);
				var servlon = parseFloat(servers[server].longitude);
				if(shortestDistance==0)
				{
					getDistanceFromLatLonInKm(reqlat,reqlon,servlat, servlon, function(error, distance){
						shortestDistance=distance;
						console.log("Distance : " + distance);
						closestServer=servers[server].serverId;
					});
					
				}
				else
				{
					getDistanceFromLatLonInKm(reqlat,reqlon,servlat, servlon, function(error,distance)
						{
							if(distance<shortestDistance)
								{
									shortestDistance=distance;
									console.log("Distance :" + distance);
									closestServer=servers[server].serverId;
								}
						});
				}

			}
			console.log("closest server : " + closestServer)
			shortestDistance=0;
			callback(null, closestServer);
		},conf,req.body.quantity);
		
	}
	else
	{
		console.log(req.body);
		callback(new Error("No Servers found to handle Requests because of inadequate parameters"), null);
	}

}
exports.allocateServer = allocateServer;

function performServerTask(conf, req, callback)
{
	
	//decrease server resourceCount
	db.updateServerResourceCount(parseInt(conf.nodeId), parseInt(req.body.quantity));
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
				if (err)
					{
						console.log("DB nahi chalta, Error from FindServerDetailsbyID : " + error );
						callback(new Error("Error from FindServerDetailsbyID"), null);
					}
				else
					{
						var totalCost= server.cost* parseInt(req.body.quantity);
						console.log("Total Cost : " + totalCost);
						callback(null,totalCost);
					}
			},parseInt(conf.nodeId));
	
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

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2, callback) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = (lat2-lat1) * Math.PI / 180.0;  // deg2rad below
	  var dLon = (lon2-lon1) * Math.PI / 180.0; 
	  var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(lat1 * Math.PI / 180.0) * Math.cos(lat2 * Math.PI / 180.0) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  var result= parseFloat(d);
	  callback(null,d);
	}