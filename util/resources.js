/**
 * Author: Sai
 */

var MongoClient = require('mongodb').MongoClient;

function insertResourceDetails(callback,json){
	
	if(json.resourceName && json.resourceId && json.quantity ){

		MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {
			if(err){
				console.log("Error: "+err);
				db.close();
			}
			else
			{	
				db.collection("resources", function (err, connection){

					connection.insert({'resourceName':json.resourceName,'resourceId':json.resourceId, 'quantity': json.quantity},function (err,result){
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

exports.insertResourceDetails = insertResourceDetails;

function updateResourceDetails(json){

	if(json.resourceName && json.resourceId && json.quantity ){

		MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {
			if(err){
				console.log("Error: "+err);
				db.close();
			}
			else
			{	
				db.collection("resources", function (err, connection){
					
					connection.save({'resourceName':json.resourceName,'resourceId':json.resourceId, 'quantity': json.quantity},function (err,result){
						if(err){
							console.log(err);
							db.close();
						}
						else{
							console.log("Successfully Updated.");
							db.close();
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

exports.updateResourceDetails = updateResourceDetails;	


function removeResourceDetails(json){

	if(json.resourceName && json.resourceId && json.quantity ){

		MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {
			if(err){
				console.log("Error: "+err);
				db.close();
			}
			else
			{
				db.collection("resources", function (err, connection){

					connection.remove({'resourceName':json.resourceName,'resourceId':json.resourceId, 'quantity': json.quantity},function (err,result){
						if(err){
							console.log(err);
							db.close();
						}
						else{
							console.log("Successfully Removed");
							db.close();
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

exports.removeResourceDetails = removeResourceDetails;

function findAllresources(callback){

	MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {

		if(err){
			console.log("Error: "+err);
			db.close();
		}
		else
		{
			db.collection("resources", function (err, connection){
				if(err){
					console.log("No such database exists.");
					db.close();
				}
				else{
					connection.find(function(err,res){
						if(err){
							console.log("No resource exists.");
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
exports.findAllResources = findAllResources;

function findResourceDetailsById(callback,resourceId){

	MongoClient.connect('mongodb://127.0.0.1:27017/ldb', function(err, db) {

		if(err){
			console.log("Error: "+err);
			db.close();
		}
		else
		{
			db.collection("resources", function (err, connection){
				if(err){
					console.log("No such database exists.");
					db.close();
				}
				else{
					connection.find({"resourceId":resourceId},function(err,res){
						if(err){
							console.log("No resource exists.");
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
exports.findResourceDetailsById = findResourceDetailsById;
