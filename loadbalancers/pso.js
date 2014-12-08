/**
 * New node file
 */
var common=require("../util/common");
var psoDB = require("../util/psoDB");
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
						var Pbest= [];
                        var position=[];
   						var Gbest = docs[0].serverId;
						
   						for(var i=0; i<docs.length;i++)
						{
					         Pbest[i] = docs[i].tAvg;	//fetches the average time from the database and stores it in Pbest				//pain points - util.
						 position[i]=Pbest.sort(); // sorts the array Pbest 
					        position[0]=Gbest; //returns the minimum avg time as Gbest.
						id=docs[i].serverId; //gets the serverId of the Gbest					     
						}
						serverPointer = id;	
						callback(null,serverPointer);
				}				
					else{
						callback(null,new Error("No Servers found to handle Requests"));
					}
			}
		});
					
		}
	
	
}
