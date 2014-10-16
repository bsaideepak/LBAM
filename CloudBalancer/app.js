
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require("fs");
var conf = (JSON.parse(fs.readFileSync("./config/conf.json", "utf8")));

var app = express();

// all environments
app.set('port', process.env.PORT || conf.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  
  console.log("Starting " + conf.role + " " + conf.nodeName + " listening on port " + conf.port);
  for(node in conf.server.serverNodes)
	  {
	  	var server=conf.server.serverNodes[node]
	  	console.log("Server " + server.nodeName + " for handling requests at port " + server.port );
	  }
	 // console.log("Server " + conf.server.serverNodes[i].nodeName + " listening on port " + conf.server.serverNodes[i].port);
  for(item in conf.server.serverNodes)
	  console.log(item.port);
});
