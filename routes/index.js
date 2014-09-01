var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var collectionName = "test";
var database = "mongodb://localhost:27017/exampleDB";

/* GET home page. */
router.get('/', function(req, res) {
	console.log("in /");
	
	var junk;

	var eventId = req.param("eventId");
	console.log("eventId = " + req.param("eventId"));

	MongoClient.connect(database, function(err, db) {
		if(err) throw err;
		console.log("Connection to MongoDB");
		var collection = db.collection(collectionName);

		//collection.remove(function(err, result){});

		// Display the entire collection
		collection.find().toArray(function(err, items) {
			if(err) throw err;
			junk = "junk: ";
			for(var a=0; a<items.length; a++)
				junk += "mykey=" + items[a]['mykey'] + 
						" name=" + items[a]['name'] + 
						" users = " + items[a]['users'] + 
						" startTime = " + items[a]['startTime'] +
						" endTime = " + items[a]['endTime'] +
						"availDates = " + items[a]['availDates'] +
						"times = " + items[a]['times'] +
						"..........";


			if(eventId == undefined) { // On the home page
				console.log("No eventId provided");
				res.render('index', {title: junk});
			} else {
				collection.findOne({mykey:eventId}, function(err, item) {
					if(err) throw err;
					//console.log("findOne item="+item);
					if(item == null) { // The home page
						console.log("No eventid found");
						res.render('index', {title: junk});
					} else { // go display event data and junk
						res.render('event', {data: item, myName: req.session.username});
					}
				});
			}
		});
	});
});


// When a new event is created
router.post('/add', function(req, res) { // Create new event
	console.log("in /add");
	//console.log(req.body.text);

	// Generate random room key
	var guid = "";
	for(var a=0; a<10; a++) {
		guid += String.fromCharCode(Math.floor((Math.random()*26)) + 97);
	}

	MongoClient.connect(database, function(err, db) {
		if(err) throw err;	
		console.log("Connection to MongoDB");
		var collection = db.collection(collectionName);
		
		var doc = {mykey:guid, name:req.body.text, users:[], times:[]};
		collection.insert(doc, {w:1}, function(err, result) {
			if(err) throw err;
			console.log("insert docs");
/*			var stream = collection.find({mykey:{$ne:2}}).stream();
			stream.on("data", function(item){});
			stream.on("end", function(){}); */
		});
	});
	res.redirect('/?eventId='+guid);
});


// When person signs in
router.post('/signin', function(req, res) {
	console.log("in /signin");
	// Check if user name already exists
	var newGuy = req.body.username;
	var eventId = req.param("eventId");

	MongoClient.connect(database, function(err, db) {
		if(err) throw err;	
		console.log("Connection to MongoDB");
		var collection = db.collection(collectionName);
		collection.update({mykey:eventId}, {$addToSet:{users:{name:newGuy}}}, {w:1}, function(err, result) {});
	});
	// Set the session variable
	req.session.username = newGuy;
	
	res.redirect('/?eventId='+eventId);
});


// When person signs out
router.post('/signout', function(req, res) {
	console.log("in /signout");
	// Check if user name already exists
	req.session.username = undefined;
	var eventId = req.param("eventId");
	res.redirect('/?eventId='+eventId);
});


// When the available dates are inputted. Transition between calendar form to slot form
router.post('/date', function(req, res) {
	console.log("in /date");
	// Check if user name already exists
	console.log(req.body.availDates);
	console.log(req.body.startTime);
	console.log(req.body.endTime);

	var eventId = req.param("eventId");

	MongoClient.connect(database, function(err, db) {
		if(err) throw err;	
		console.log("Connection to MongoDB");
		var collection = db.collection(collectionName);
		collection.update({mykey:eventId}, {$set:{startTime:req.body.startTime, endTime:req.body.endTime, availDates:req.body.availDates}}, {w:1}, function(err, result) {});
	});

	res.redirect('/?eventId='+eventId);
});


// When individual schedule times are inputted and saved. This is an AJAX call.
router.post('/store', function(req, res) {
	console.log("in /store");

	var eventId = req.body.eventId;

	MongoClient.connect(database, function(err, db) {
		if(err) throw err;	
		console.log("Connection to MongoDB");
		var collection = db.collection(collectionName);

		// console.log(req.body.times);

		// var sched = {};
		// sched.owner = req.body.owner;
		// sched.times = req.body.times;

		// console.log("sched = " + sched);
		// var datajunk = JSON.parse(req.body.data);

		// collection.update({mykey:eventId}, {times:{$set:{owner:datajunk.owner}}, {w:1}, function(err, result) {});
		
		// Take out the previous (if any) scheudles for this owner
		collection.update({mykey:eventId}, {$pull:{ times : {owner: req.body.owner} }}, {w:1}, function(err, result) {

			//Add the new schedule of this owner
			collection.update({mykey:eventId}, {$push:{ times : {owner: req.body.owner, times: req.body.times} }}, {w:1}, function(err, result) {

				collection.findOne({mykey:eventId}, function(err, item) {
					if(err) throw err;
					// console.log("findOne item = "+item);
					console.log("findOne item.times = "+JSON.stringify(item.times));
					// for(var a=0; a<item.times.length; a++) {
					// 	console.log("findOne item.times[0] = "+item.times[a].owner+item.times[a].times);
					// }
					res.send(JSON.stringify(item.times));
				});	

			});


		});
		
		// collection.findOne({mykey:eventId}, function(err, item) {
		// 	if(err) throw err;
		// 	console.log("findOne item = "+item);
		// 	console.log("findOne item.times = "+item.times);
		// 	console.log("findOne item.times[0] = "+item.times[0]);
		// 	// console.log("findOne item.times[0].owner = "+item.times[0].owner);

		// 	if(item == null) { // The home page
		// 		console.log("No eventid found");
		// 		res.render('index', {title: "Golly, I broke!"});
		// 	} else { // go display event data and junk
		// 		res.render('event', {data: item, myName: req.session.username});
		// 	}
		// });


	});

	// res.send(req.body);
});


module.exports = router;
