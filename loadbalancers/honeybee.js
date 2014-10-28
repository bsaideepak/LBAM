/**
 * Author: Sai
 */

var servers = require("../util/servers");

var serverPointer=0;

function allocateServer(callback,conf,req)
{
	if (!conf.server.serverNodes.length<=0)
	{
		servers.findAllServers(function(err,result){
				
			if(err){
				console.log("Error.");
			}
			else{

				temp = result;

				result.toArray(function(err,docs){

					if(!docs.length==0)
					{
						var no_of_requests = [];
						var serverId_list = [];
						var resourceCount_list = [];

						if(docs[0].resourceCount > 0){
							var choice = docs[0].serverId;
						}

						
						for(var i=0; i<docs.length;i++)
						{
							no_of_requests[i] = docs[i].liveReq;
							serverId[i] = docs[i].serverId;

							if(docs[i].resourceCount > 0){
								resourceCount_list[i] = 1;
							}


							if (i>0) {

								if (no_of_requests[i]<no_of_requests[i-1] && resourceCount_list[i]==1) {

									choice = serverId_list[i];
								}
							}
							
						}

						serverPointer = choice;
								
						callback(serverPointer,null);
					}

					else{
						
						callback(null,new Error("No Servers found to handle Requests"));
					}
				
				});
					
				}
				
			});
		
	}
}

exports.allocateServer = allocateServer;
