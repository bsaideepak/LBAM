/**
 * Author: Sai
 */

var common = require("../util/common");

var serverPointer=0;

function allocateServer(callback,conf,req)
{

	common.findAvailableServersWithResources(function(err,docs){

		if(err){
			console.log("Error.");
		}

		else{
			if(!docs.length==0)
			{
				var no_of_requests = [];
				var serverId_list = [];

				for(var i=0; i<docs.length;i++)
				{
					no_of_requests[i] = docs[i].liveReq;
					serverId[i] = docs[i].serverId;


					if (i>0) {

						if (no_of_requests[i]<no_of_requests[i-1]) {

							choice = serverId_list[i];
						}
					}
					else{
						choice = serverId_list[i];
					}

				}

				serverPointer = choice;

				callback(null , serverPointer);
			}

			else{
				console.log("No servers available to service requests.");
				callback(null, new Error("No servers available to service requests."));
			}

		}

	},conf,quantity);

}


exports.allocateServer = allocateServer;
