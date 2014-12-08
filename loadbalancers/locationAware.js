/*
 * Location Aware Multi user Resource allocation load Balancing Algorithm Implementation.
 */
var closestServer=0;
var shortestDistance=0;
function allocateServer(callback,conf, req)
{
	if(req.body.hasOwnProperty('lattitude') && req.body.hasOwnProperty('longitude'))
	{
		var serverList;
		findAvailableServersWithResources(function (error, servers)
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

function performServerTask()




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

