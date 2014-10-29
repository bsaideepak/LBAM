/*
 * Location Aware Multi user Resource allocation load Balancing Algorithm Implementation.
 */
var closestServer=0;
var shortestDistance=0;
function allocateServer(callback,conf, req)
{
	if(req.body.hasOwnProperty('lattitude') && req.body.hasOwnProperty('longitude'))
	{
		 for(node in conf.server.serverNodes)
		  {
		  	var server=conf.server.serverNodes[node];
		  	if(shortestDistance==0)
		  		{
		  			shortestDistance=distance(req.body.lattitude,req.body.longitude,server.lattitude, server.longitude);
		  			closestServer=server.id;
		  		}
		  	else if(distance(req.body.lattitude,req.body.longitude,server.lattitude, server.longitude)<shortestDistance)
		  		{
		  			shortestDistance=distance(req.body.lattitude,req.body.longitude,server.lattitude, server.longitude);
		  			closestServer=server.id;
		  		}
		  }
		 shortestDistance=0;
		 callback(closestServer,null);
	}
	else
		{
			callback(null,new Error("No Servers found to handle Requests"));
		}
	
}
exports.allocateServer = allocateServer;

function distance(lat1, lon1, lat2, lon2) {
    theta = lon1 - lon2;
    dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
    dist = Math.acos(dist);
    dist = rad2deg(dist);
    dist = dist * 60 * 1.1515;
     return (dist);
  }

function deg2rad(deg) {
    return (deg * Math.PI / 180.0);
  }
function rad2deg(rad) {
    return (rad * 180.0 / Math.PI);
  }