var slength= conf.server.ServerNodes.length;
var server;

var pheromone=function(slength)
{
    var x = Math.sin(slength) * 10000;
    return x - Math.floor(x);
}

function initPheromone()
{
	for(node in conf.server.serverNodes)
	{
		//database insert (node.id, pheromone)
	}
}
	  
function allocateServer(callback,conf,req)
{
	if(server==null)
	{
		initPheromone();
	}
	//getServers up and free
	//then server = Math.max.apply(Math, node.id(pheromone));
	
	for(node in candidateServers)
	{
		server=candidateServers[0];
		if( pheromone of node> pheromone of server)
		{
			server=node;
			//decrement the pheromone value by Prize
			pheromone of server=pheromone(server)-prize(slength);
			console.log("server selected:"+server);
			
		}
	}
	
	
	callback(server,null);
}	

var prize=function random(slength) {
    var x = Math.cos(slength) * 10000;
    return x - Math.floor(x);
}
 
