/**
 * Author: Sai
 */

var common = require("../util/common");
var db;
var collectionName = "requests";

function logT1(callback,json){
	
	if(json.requestId && json.t1){

		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);
			
		dbc.insert({'requestId':json.requestId, 't1': json.t1, 't2': "", 'tRes': 0},function (err,result){
			
			if(err){
				console.log(err);
				//common.closeConnection(db);
				callback(err,null);
			}
			
			else{
				
				var status = "Successfully Inserted";
				//common.closeConnection(db);
				console.log("Operation Successful.");
				callback(err,status);
			}
		
		});
	}
}

exports.logT1 = logT1;

function findRequestDetailsById(callback,requestId){

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collectionName);
			
	dbc.find({"requestId": requestId},function(err,res){
		
		if(err){
			console.log("No Server exists.");
			//common.closeConnection();
		}
						
		else{
			//common.closeConnection();
			callback(err,res);
		}
			
	});
}
	
exports.findRequestDetailsById = findRequestDetailsById;

function logT2AndResponceTime(json){

	if(json.requestId && json.t2)
	{
		mongo.getConnection(function(err,coll){
			if(err){
				console.log("Error: "+err);
			}
			else{
				dbc = coll;
			}
		},collectionName);
		
		dbc.findAndModify({query: {"requestId": json.requestId },update: { $set: { "t2": json.t2 , 'tRes': (json.t2 - json.t1)} }, upsert: true },function(err,result){

			if(err){
				console.log(err);
				//db.close();
			}
			else{
				console.log("Successfully Updated.");
				//db.close();
			}
		});
	}
	else{
		console.log("Insufficient Data.");
		//db.close();
	}
}

exports.logT2 = logT2;

function calculateTimeAverage(callback,json){

var collName = "servers";

	mongo.getConnection(function(err,coll){
		if(err){
			console.log("Error: "+err);
		}
		else{
			dbc = coll;
		}
	},collName);
	
	var temp = 0;
	var count++;
	
	dbc.find({'tRes' : { $gt : 0 }}, function(err,result){
		//Aggregate and find average responce time.
		
		result.toArray(function(err,docs){
			
			if(docs.length!= 0){
				temp = temp + docs[i].tRes;
				count++;
			}
			
			
		});
		
		tAvg = temp/count;
		
		
	});
	
	callback(err,tAvg);
}

exports.calculateTimeAverage = calculateTimeAverage;