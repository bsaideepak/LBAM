
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'CMPE 281 HW 1 Cloud Load Balancer - TEAM 21'});
};

exports.ping = function(req, res){
	  res.send('Up and Running');
	};