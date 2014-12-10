/*
 * load Balancer Module.
 */


var fs = require("fs");
var conf = (JSON.parse(fs.readFileSync("./config/conf.json", "utf8")));
var loadBal=conf.loadBalanceAlgo;
var algo = require("../loadbalancers/"+loadBal);


exports.ping = function(req, res){
	res.send('Up and Running');
};

exports.resourceRequest = function(req, res){
	if(conf.role == "loadbalancer")
	{
		algo.allocateServer(function(err,allocatedServer){
			if(err)
			{
				console.log(err);
				return res.send("Error: No servers available to service requests");
			}
			else
			{
				console.log(req.body);
				//console.log(allocatedServer);
				for(node in conf.server.serverNodes)
				{
					var server=conf.server.serverNodes[node];
					if(server.nodeId==allocatedServer)
					{
						url="http://" + server.host + ":" + server.port + req.path;
						/**
						 *------- TO DO ---------
						 * 1) Ping the server to see if its running
						 * 2) Only in the case its running rediret the request
						 * 3) Call the loadbalancer again to allocate new server
						 *    incase the one allocated is not running
						 */
						console.log(url);
						//res.location(url);
						return res.redirect(307, url);
					}
				}
			}
		},conf,req);
	}
	else if (conf.role== "server")
	{
		console.log('role : server');
		if(req.body.hasOwnProperty('quantity') && req.body.hasOwnProperty('duration') && req.body.hasOwnProperty('mobile_os') && req.body.hasOwnProperty('ram') && req.body.hasOwnProperty('disk') && req.body.hasOwnProperty('CPU')) 
		{
			algo.performServerTask(conf,req,function(error, cost)
			{
				if(error)
				{
					console.log("Error performing server task by Algorithm : " + error);
					res.send("Alocated Server could not process request");
				}
				else
				{
					if (cost!=null && cost > 0)
					{
							console.log("End to End Working");
							return res.send("Computed Cost for allocated resources is : "+ cost);
					}
					else
					{
						console.log("Invalid Cost compouted by Algorithm ");
						res.send("Alocated Server could not process request");
					}
				}
			});

			/**
			 *------- TO DO ---------
			 * 1) Each parameter has an associated cost
			 * 2) Store and retrieve cost for each parameter in the DB (eg 1 ghz cpu -> 5 $, 2 gb RAM -> $ 10 etc
			 * 3) Limited resources, so maintain resource count in DB and decline requests when resources not available
			 * 4) Compute and return cost according to resources requested.
			 */
		}
		else
		{
			console.log('Has no parameters');
			//console.log(req.body);
			return res.send('No post parameters undi');
		}
	}
};

