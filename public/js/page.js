
$(document).ready(function() {
	
	var isDown = false;
	var select = true; // This can be done better. Fix up later.
	var origRow, origCol, newRow, newCol;
	
	var table = document.getElementsByClassName("cal-table")[0];


	$(".dateNum").mousedown(function () {
		// So it works with both and calendarTable
		
		isDown = true;

		origRow = $(this).data("row");
		origCol = $(this).data("col");
		
		newRow = origRow;
		newCol = origCol;

		if($(this).hasClass("avail")){
			select = false;
			$(this).addClass("unhigh"); // high for unhighlighted
			$(this).css("background-color", "blue");
		} else {
			select = true;
			$(this).addClass("high"); // high for highlighted
			$(this).css("background-color", "#FF00FF");
		}

		return false; // Prevents highlighting text! BUG FIXED!
	});

	$(document).mouseup(function () {
		if(isDown) { // Gotta lift the mouse and change all highlighted to permanently marked
			var tableRows = table.firstChild.childNodes;
			
			var lowR = origRow, highR = newRow, lowC = origCol, highC = newCol;
			if(newRow < origRow) {
				lowR = newRow;
				highR = origRow;
			}
			if(newCol < origCol) {
				lowC = newCol;
				highC = origCol;
			}
			// console.log("Let's color in (" + lowR + "," + lowC + ") to (" + highR + "," + highC);

			for(var r=lowR; r<=highR; r++) { // Remember to add 1 to get rid of header row and header col
				for(var c=lowC; c<=highC; c++) {		
					//console.log(tableRows[r+1].childNodes[c+1]);
					if(select) {
						$(tableRows[r+1].childNodes[c+1]).removeClass("high").removeClass("unavail").addClass("avail");
						$(tableRows[r+1].childNodes[c+1]).css("background-color", "#339933");
					} else {
						$(tableRows[r+1].childNodes[c+1]).removeClass("unhigh").removeClass("avail").addClass("unavail");
						$(tableRows[r+1].childNodes[c+1]).css("background-color", "white")
					}
				}
			}
		}
		isDown = false;
	});

	$(".dateNum").mouseover(function() {
		if(isDown) {
			var tableRows = table.firstChild.childNodes;

			var currRow, currCol;
			currRow = $(this).data("row");
			currCol = $(this).data("col");

			// The original filled in junk
			var lowR = origRow, highR = newRow, lowC = origCol, highC = newCol;
			if(newRow < origRow) {
				lowR = newRow;
				highR = origRow;
			}
			if(newCol < origCol) {
				lowC = newCol;
				highC = origCol;
			}

			// The new filled in junk
			var lowR2 = origRow, highR2 = currRow, lowC2 = origCol, highC2 = currCol;
			if(currRow < origRow) {
				lowR2 = currRow;
				highR2 = origRow;
			}
			if(currCol < origCol) {
				lowC2 = currCol;
				highC2 = origCol;
			}

			// big bounding box of all the junk
			var lowRbig = lowR, highRbig = highR, lowCbig = lowC, highCbig = highC;
			if(lowR2 < lowR) {
				lowRbig = lowR2;
			}
			if(lowC2 < lowC) {
				lowCbig = lowC2;
			}
			if(highR2 > highR) {
				highRbig = highR2;
			}
			if(highC2 > highC) {
				highCbig = highC2;
			}

			var isOrigbox = function(r, c) { // Are coordinates in the original box
				if(r <= highR && r >= lowR && c <= highC && c >= lowC){
					return true;
				}
				return false;
			};

			var isNewbox = function(r, c) { // Are coorinates in the new box
				if(r <= highR2 && r >= lowR2 && c <= highC2 && c >= lowC2){
					return true;
				}
				return false;
			};
			
			// Fill and erase junk
			for(var r=lowRbig; r<=highRbig; r++) { // Remember to add 1 to get rid of header row and header col
				for(var c=lowCbig; c<=highCbig; c++) {
					if(isNewbox(r,c) && !isOrigbox(r,c)) { // Fill it!
						if(select) {
							// $(tableRows[r+1].childNodes[c+1]).removeClass("unavail").addClass("avail");
							$(tableRows[r+1].childNodes[c+1]).addClass("high");
							$(tableRows[r+1].childNodes[c+1]).css("background-color", "#FF00FF");
						} else {
							$(tableRows[r+1].childNodes[c+1]).addClass("unhigh");
							$(tableRows[r+1].childNodes[c+1]).css("background-color", "blue");

						}	
					} else if(isOrigbox(r,c) && !isNewbox(r,c)) { // Unfill it!
						if(select) {
							// $(tableRows[r+1].childNodes[c+1]).removeClass("unavail").addClass("avail");
							$(tableRows[r+1].childNodes[c+1]).removeClass("high");
							$(tableRows[r+1].childNodes[c+1]).css("background-color", "");
						} else {
							$(tableRows[r+1].childNodes[c+1]).removeClass("unhigh");
							$(tableRows[r+1].childNodes[c+1]).css("background-color", "");
						}
					}
				}
			}	

			newRow = currRow, newCol = currCol;
		}
	});

	

	// Submit after person inputs their individual schedule into slot calendar
	// Should do AJAX call to server to update their times and then should update the page
	$("#calendarSlot").submit(function(event) {
		event.preventDefault(); // Prevent page refresh
		console.log("In submit calendarSlot");

		// Create parameters to send up to the server
		var data = {};
		data.owner = $(this).data("owner");
		data.eventId = $(this).data("eventid");

		var times = [];
		var tableRows = table.firstChild.childNodes;
		for(var r=1; r<tableRows.length; r++) {
			for(var c=1; c<tableRows[0].childNodes.length; c++) {
				var elem = $(tableRows[r].childNodes[c]);
				if(elem.hasClass("avail"))
					// console.log(elem.data("date"));
					times.push(elem.data("date"));
			}
		}

		data.times = times;
		console.log(data);

		// AJAX call!
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: './store',
			success: function(data) {
				console.log("AJAX success!");
				// console.log(JSON.stringify(data));
				// console.log(display);
				// var table = document.getElementsByClassName("cal-table")[0];
				// console.log("step 1");
				display.eraseTimes(display.elem);
				display.setupTimes(display.elem, JSON.parse(data));
				display.addTimes(display.elem, false);


				var mykey = document.getElementById("dataMyKey").getAttribute("data");
				socket.emit("times", {"data":data, "roomkey":mykey});
				console.log("socket?");
				

			}
		});

	});


	$(".slotCell").mouseover(function() {
		// console.log("oodles");
		if(!$(this).hasClass("dateNum") && $(this).hasClass("avail")) {
			$(this).tooltip('show');
		}
	});


	function rmTip(elem) {
		// console.log("ayyyyyyy");
		$(elem).tooltip("destroy");
	}
	my_function = rmTip;
});

my_function = null;

function funThings (elem) {
	my_function(elem);
}

function getCalData() {
	// Get calendar data
	var nodeList = document.getElementsByClassName("avail");
	var availList = [];

	for(var a=0; a<nodeList.length; a++) {
		availList.push(nodeList[a].attributes.getNamedItem("data-info").value);
	}

	var stringy = JSON.stringify(availList);
	document.getElementById("availDates").value = stringy;


	// Check if there is any calendar data
	if(availList.length <= 0) {
		console.log("NOTHING");
		return false;
	}

	// TODO later. check time validation and date validation
}


function toggleSched() {
	var section = document.getElementById("sectionSched");
	if(section.style.display != "none") {
		section.style.display = "none";
	} else {
		section.style.display = "";
	}
}
