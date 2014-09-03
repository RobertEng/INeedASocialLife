// Somehow have to get the eventId
if(document.getElementById("dataMyKey") != null) {
	var mykey = document.getElementById("dataMyKey").getAttribute("data");
	console.log(mykey);
	var socket = io();

	socket.on("connect", function() {
		socket.emit("room", mykey);
	});

	socket.on("times", function(data) {
		console.log("data on times pushed to user");
		display.eraseTimes(display.elem);
		display.setupTimes(display.elem, JSON.parse(data));
		display.addTimes(display.elem, false);
	});

}
