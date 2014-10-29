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
		  	algo.allocateServer(function(allocatedServer,err){
		  		if(err)
					console.log(err);
				else
					{
					console.log(req.body);
					console.log(allocatedServer);
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
					  			res.location(url);
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
			  if(conf.loadBalanceAlgo=="ant")
			  {
				  var slength=conf.server.serverNodes.length;
				  var prize=function random(slength) 
				  {
					  var x = Math.cos(slength) * 10000;
					  return x - Math.floor(x);
				  }
				  incrementPheromoneBySid(conf.nodeId,prize);
			  }
			  /**
	  			 *------- TO DO ---------
	  			 * 1) Each parameter has an associated cost
	  			 * 2) Store and retrieve cost for each parameter in the DB (eg 1 ghz cpu -> 5 $, 2 gb RAM -> $ 10 etc
	  			 * 3) Limited resources, so maintain resource count in DB and decline requests when resources not available
	  			 * 4) Compute and return cost according to resources requested.
	  			 */
				console.log("****** Request For Resource recieved with the following Configuration");
				console.log("** CPU --> " + req.body.CPU  + "**");
				console.log("** DISK --> " + req.body.disk  + "**");
				console.log("** RAM --> " + req.body.ram  + "**");
				console.log("** MOBILE OS --> " + req.body.mobile_os  + "**");
				console.log("** DURATION --> " + req.body.duration  + "**");
				console.log("** QUANTITY --> " + req.body.quantity  + "**");
				console.log("** LATITUDE --> " + req.body.latitude  + "**");
				console.log("** LONGITUDE --> " + req.body.longitude  + "**");
				
				console.log("\n\n **##### TOTAL COMPUTED COST -->> $50.00  #####**");
				return res.send('Total Cost $50 undi, Chala expensive undi');
				
			}
		  else
		  	{
		  		console.log('Has no parameters');
		  		console.log(req.body);
		  		return res.send('No post parameters undi');
		  	}
		  }
	};

