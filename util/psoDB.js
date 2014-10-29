/**
 * Author: Sai
 */

var common = require("../util/common");
var db;

function logReqTime(callback,json){
	
	if(json.requestId && json.t1){

		db.collection("requests", function (err, connection){

			connection.insert({'requestId':json.requestId, 't1': json.t1, 't2': json.t2 , 'tAvg' : json.tAvg},function (err,result){
			
			if(err){
				console.log(err);
				common.closeConnection(db);
				callback(err,null);
			}
			
			else{
				
				var status = "Successfully Inserted";
				common.closeConnection(db);
				console.log("Operation Successful.");
				callback(err,status);
			}
		
			});
		});
	}

	else{
		console.log("Insufficient Data.");
		db.close();
	}
}

exports.logReqTime = logReqTime;

function findRequestDetailsById(callback,requestId){

	db.collection("requests", function (err, connection){

		if(err){
			
			console.log("No such database exists.");
			common.closeConnection(db);
		}
		
		else{
			
			connection.find({"requestId": requestId},function(err,res){
			
			if(err){
				
				console.log("No Server exists.");
				common.closeConnection();
			}
						
			else{
				
				common.closeConnection();
				callback(err,res);
			}
			
			});
		}

	});
}
	
exports.findRequestDetailsById = findRequestDetailsById;
