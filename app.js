
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var loadbalancer = require("./routes/loadbalancer");
var http = require('http');
var path = require('path');
var fs = require("fs");

/**
 * -------TO DO----------- 
 * 
 * 1) Validate conf FIlE NOT FOUND
 * 2) Validate JSON FILE. 
 * 
 */
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', '*');

    next();
}

var conf = (JSON.parse(fs.readFileSync("./config/conf.json", "utf8")));

var app = express();

// all environments
app.set('port', process.env.PORT || conf.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('etag');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(allowCrossDomain);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//// ** GET REQUESTS
app.get('/', routes.index);
app.get('/ping', loadbalancer.ping);

//// ** POST REQUESTS
app.post('/resourceRequest', loadbalancer.resourceRequest);

http.createServer(app).listen(app.get('port'), function(){
  
  console.log("Starting " + conf.role + " " + conf.nodeName + " listening on port " + conf.port);
  for(node in conf.server.serverNodes)
	  {
	  	var server=conf.server.serverNodes[node];
	  	console.log("Server " + server.nodeName + " for handling requests at port " + server.port );
	  }
  for(node in conf.loadBalancer.loadBalancerNodes)
  {
  	var loadBalancer=conf.loadBalancer.loadBalancerNodes[node];
  	console.log("LoadBalancer " + loadBalancer.nodeName + " for balancing request load at port " + loadBalancer.port );
  }
  console.log("Implementing the " + conf.loadBalanceAlgo + " algorithm for Load Balancing");
});
