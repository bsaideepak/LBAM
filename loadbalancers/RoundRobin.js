
/*
 * Round Robin load Balancing Algorithm Implementation.
 */
var serverPointer=0;

function allocateServer(callback,conf)
{
	if (!conf.server.serverNodes.length<=0)
	{
		if(serverPointer<conf.server.serverNodes.length)
			{
				var serverId=conf.server.serverNodes[serverPointer].nodeId;
				serverPointer++;
				callback(serverId,null);
			}
		else
			{
				serverPointer=0;
				var serverId=conf.server.serverNodes[serverPointer].nodeId;
				serverPointer++;
				callback(serverId,null);	
			}
	}
	else
		{
			callback(null,new Error("No Servers found to handle Requests"));
		}
	
}
exports.allocateServer = allocateServer;