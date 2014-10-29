/**
 * Author: Sai
 */

var MongoClient = require('mongodb').MongoClient;

function logReqTime(callback,json){
	
	if(json.requestId && json.t1){

		MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {
			if(err){
				console.log("Error: "+err);
				db.close();
			}
			else
			{	
				db.collection("requests", function (err, connection){

					connection.insert({'requestId':json.requestId, 't1': json.t1, 't2': json.t2 , 'tAvg' : json.tAvg},function (err,result){
						if(err){
							console.log(err);
							db.close();
						}
						else{
							var status = "Successfully Inserted";
							db.close();
							console.log("Operation Successful.");
							callback(err,status);
						}
					});
				});
			}

		});
	}
	else{
		console.log("Insufficient Data.");
		db.close();
	}
}

exports.logReqTime = logReqTime;

function findRequestDetailsById(callback,requestId){

	MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {

		if(err){
			console.log("Error: "+err);
			db.close();
		}
		else
		{
			db.collection("requests", function (err, connection){
				if(err){
					console.log("No such database exists.");
					db.close();
				}
				else{
					connection.find({"requestId": requestId},function(err,res){
						if(err){
							console.log("No Server exists.");
							db.close();
						}
						else{
							db.close();
							callback(err,res);
						}
					});
				}

			});
		}
	});
}
exports.findRequestDetailsById = findRequestDetailsById;
