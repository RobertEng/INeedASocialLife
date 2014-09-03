

function Slot(startTime, endTime, availDates, interactive, target, times) {
  this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                     'September', 'October', 'November', 'December'];
  this.dayNames   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  this.hourNames = ['Midnight', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', 
                    '9 AM', '10 AM', '11 AM', 'Noon', '1 PM', '2 PM', '3 PM', '4 PM',
                   '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];

  // JSON + html don't mix. Have to fix availDates. Jk i fixed this. I believe. I'll keep this around if I need to revert.
  // var newDates = availDates.replace(/&quot;/g, '"');


  // console.log("uh?");
  
  // for(time in times) {
  //   console.log(time);    
  //   console.log("owner = " + times[time]['owner']);
  //   console.log("time = " + times[time]['times']);
  // }

  // console.log(availDates);

  this.render(startTime, endTime, availDates, interactive, target, times);
};


Slot.prototype.addSlotGrid = function(startTime, endTime, availDates, target) {
  var availArr = JSON.parse(availDates);

  //console.log(availArr);


  var possMonth = []; // All the possible days of this pseudo month in this array.

  for(var a=0; a<availArr.length; a++) { // For day interval
    var dayIterator = new Date(availArr[a]);
    var day = [];
    
    for (var i = startTime; i < endTime; i++) { // For hour interval
      for(var u=0; u<4; u++) { // For minute interval
        day.push(new Date(dayIterator.setHours(i, u*15, 0, 0)));
      }
    }
    possMonth.push(day);
  }


/*

  //var slothtml = "<table id='slotTable' class='cal-table'>";
  var slothtml = "<table class='cal-table'>";

  // First row of labels
  slothtml += "<tr><th></th>";
  for(day in possMonth) {
    var dayNm = this.dayNames[possMonth[day][0].getDay()].substr(0,3);
    var monthNm = this.monthNames[possMonth[day][0].getMonth()].substr(0,3);
    var dateNm = possMonth[day][0].getDate();
    //console.log(dayNm + " " + monthNm + " " + dateNm);
    slothtml += "<th class='slot-cell-head'>" + dayNm + "<br>" + monthNm + " " + dateNm + "</th>";
  }
  slothtml += "</tr>";
  

  for(var i = 0; i < possMonth[0].length; i++) { // Loop through all the rows of HOURS
    slothtml += "<tr>";

    // The label at the beginning of the row
    slothtml += "<td class='slot-cell-head'>";
    if(possMonth[0][i].getMinutes() == 0) { // Multiples of 1 hour. (Exclude multiples of 15 min)
      slothtml += "<div style='position:relative; width:40px;'><div class='slot-cell-head-text'>" + this.hourNames[possMonth[0][i].getHours()] + "</div></div>";
    }
    slothtml += "</td>";
    
    for(day in possMonth) { // Loop through all the columns of DAYS
      slothtml += "<td class='slotCell' data-row="+i+" data-col="+day+" data-date="+possMonth[day][i].getTime();

      // This part is so hacky. Fix this up with classes all nice and neat later
      // Add special css for every hour interval
      if(possMonth[0][i].getMinutes() == 0) {
        slothtml += " style='border-top-width: 2px; border-bottom-style: none;'";
      } else if(possMonth[0][i].getMinutes() == 30) {
        slothtml += " style='border-bottom-style: none;'";
      } else {
        slothtml += " style='border-top-style:none; border-bottom-style: none;'";
      }
      slothtml += "></td>";
    }

    slothtml += "</tr>";
  }
  slothtml += "</table>";*/
  //document.getElementById(target).innerHTML = slothtml;




  var elem = document.createElement("table");
  elem.setAttribute("class", "cal-table");
  var tbody = document.createElement("tbody");
  elem.appendChild(tbody);
  var firstRow = document.createElement("tr"); // first row and that empty box in top left
  firstRow.appendChild(document.createElement("th"));
  tbody.appendChild(firstRow);

  for(day in possMonth) {
    var dayNm = this.dayNames[possMonth[day][0].getDay()].substr(0,3);
    var monthNm = this.monthNames[possMonth[day][0].getMonth()].substr(0,3);
    var dateNm = possMonth[day][0].getDate();
    var head = document.createElement("th");
    head.setAttribute("class", "slot-cell-head");
    head.innerHTML = dayNm + "<br>" + monthNm + " " + dateNm;
    firstRow.appendChild(head);
  }

  for(var i = 0; i < possMonth[0].length; i++) { // Loop through all the rows of HOURS
    var row = document.createElement("tr");

    // The label at the beginning of the row
    var rowHead = document.createElement("td");
    rowHead.setAttribute("class", "slot-cell-head");
    rowHead.setAttribute("style", "position: absolute;");
    if(possMonth[0][i].getMinutes() == 0) { // Multiples of 1 hour. (Exclude multiples of 15 min)
      var label = document.createElement("div");
      label.setAttribute("style", "position:relative; width:40px; top: -10px;");
      var underLabel = document.createElement("div");
      underLabel.setAttribute("class", "slot-cell-head-text");
      underLabel.innerHTML = this.hourNames[possMonth[0][i].getHours()]
      label.appendChild(underLabel);
      rowHead.appendChild(label);

    }

    row.appendChild(rowHead);

    for(day in possMonth) { // Loop through all the columns of DAYS
      var cell = document.createElement("td");
      cell.setAttribute("class", "slotCell");
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", day);
      cell.setAttribute("data-date", possMonth[day][i].getTime());
      

      // This part is so hacky. Fix this up with classes all nice and neat later
      // Add special css for every hour interval
      if(possMonth[0][i].getMinutes() == 0) {
        cell.setAttribute("style", "border-top-width: 2px; border-bottom-style: none;");
      } else if(possMonth[0][i].getMinutes() == 30) {
        cell.setAttribute("style", "border-bottom-style: none;");
      } else {
        cell.setAttribute("style", "border-top-style:none; border-bottom-style: none;");
      }

      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  return elem;

};

Slot.prototype.render = function(startTime, endTime, availDates, interactive, target, times) {
  var elem = this.addSlotGrid(startTime, endTime, availDates, target);
  this.elem = elem;

  document.getElementById(target).appendChild(elem);

  if(interactive)
    this.addInteract(elem);


  this.setupTimes(elem, times);
  this.addTimes(elem, interactive);


  


};


Slot.prototype.addInteract = function(elem) {
  list = elem.getElementsByClassName("slotCell");
  for(cell in list){
    $(list[cell]).addClass("dateNum");
  }

};

Slot.prototype.setupTimes = function(elem, times) {
  // console.log("step 2");  
  // console.log("I'm adding times");
  // console.log(times);
  // console.log(elem);
  // console.log(times.length);

  // I somehow have to merge all the times of all the owners together and count frequency
  // This sounds very calculation and memory intensive, however, it must be done. Here's my idea.
  // Assuming all of the times are sorted (I'll do sort on the time array anyway),
  // I can merge all the arrays with that fancy merge sort kind of thing and while thats happening,
  // I can count frequency of the times of that certain time. I do hope this works.
  // I also need to keep track of users who are free that day too hmmm. That's a little harder.

  // Gotta get them nice and sorted. Although, I think they start out sorted. Nice to have anyway.
  for(schedule in times) {
    times[schedule]['times'] = times[schedule]['times'].sort();
    // console.log("step 2.1."+schedule);  

  }

  timeArr = [];
  userArr = [];

  // console.log("Much loopy was had");

  // var count = 0; // Just for debug purposes to stop endless while loop

  // Keep going until there's only one array
  while(times.length > 1) {
    // count ++;
    // console.log(count);
    // console.log("loopy loopy I'm so loopy. times.length = " + times.length + " count = " + count);


    // Find the smallest value of the all the first values
    var min = times[0]['times'][0];
    var minUserInd = 0;
    for(var a=1; a<times.length; a++) {
      if(times[a]['times'][0] < min) {
        min = times[a]['times'][0];
        minUserInd = a;
      }
    }

    // Remove the smallest value
    var minTime = times[minUserInd]['times'].shift();
    var minUser = times[minUserInd]['owner'];

    // Add the time to timeArr if it isn't there already.
    // Also add user to userArr in certain place depending on if time is in timeArr
    if(timeArr.length > 0 && timeArr[timeArr.length-1] == minTime) {
      // The minTime is already there. Just add the user.
      userArr[userArr.length-1].push(minUser);
    } else {
      // Add the minTime to timeArr and add the user.
      timeArr.push(minTime);
      var users = [];
      users.push(minUser);
      userArr.push(users);
    }

    // Collect up all the shells of empty arrays
    for(schedule in times) {
      if(times[schedule]['times'].length <= 0) {
        times.splice(schedule, 1);
        schedule--; // Idk if this works since this if forin loop
      }
    }
  }

  // console.log("Before " + timeArr);


  // After looping, I'm left with one array. I need not look through to find the smallest value since theres nothing to compare it to.
  if(times.length > 0) {
    // Gotta first take care of the corner case that the last guy's first time is the same as the second to last guy's last time. Yes, I am hardcoding this, there's no better way to do it.
    if(timeArr.length > 0 && timeArr[timeArr.length - 1] == times[0]['times'][0]) {
      userArr[userArr.length - 1].push(times[0]['owner']);
      times[0]['times'].shift();
    }

    // Now for actually appending on to the rest of the times
    for(time in times[0]['times']) {
      // console.log("step 2.3." + time);  

      timeArr.push(times[0]['times'][time]);
      var users = [];
      users.push(times[0]['owner']);
      userArr.push(users);
    }
  }


  this.timeArr = timeArr;
  this.userArr = userArr;

  // console.log(timeArr);
  // console.log(userArr);

  // console.log("step 3");  

}


Slot.prototype.addTimes = function(elem, interactive) {
  // console.log("step 4");  

  // After the sorting, now I must somehow input it into the table. To do this.....
  // I find the first date of each column and see if the current time is in it.
  // If it is, I can go look through (or calculate) for the correct spot and color that to the correct shade.
  
  var userArr = this.userArr;
  var timeArr = this.timeArr;

  // Just a little information I need later. May change this later depending if I need it.
  // I must get the max number of users available on one day over all the days.
  var maxUsers = 0;
  for(day in userArr) {
    if(userArr[day].length > maxUsers) {
      maxUsers = userArr[day].length;
    }
  }

  // Gotta build that array of COLORS! WOOHOO. Each index corresponds with number of users
  // The full green is rgb(51, 153, 51)
  var colors = [];
  if(maxUsers > 0) { // Don't want to be dividing by zero
    for(var i=0; i<=maxUsers; i++) {
      var r = Math.round(255-(255-51)*i/maxUsers);
      var g = Math.round(255-(255-153)*i/maxUsers);
      var b = r;
      colors.push("rgb("+r+","+g+","+b+")");
    }
  } else { // There are no users. the color is always white.
    colors.push("rgb(255, 255, 255)");
  }

  // console.log(colors);



  for(time in timeArr) {  // Find the correct column or day
    // console.log("In timeloop with " + timeArr[time]);
    // console.log(elem.firstChild.childNodes[1].childNodes.length);
    for(var e=1; e<elem.firstChild.childNodes[1].childNodes.length; e++) { // Find the correct row or 15 min increment
      // console.log("How bout here?" + timeArr[time]);
      // console.log("Child loop with grandfather paradox");
      // console.log(elem.firstChild.childNodes[1].childNodes[e].getAttribute("data-date"));
      var morning = parseInt(elem.firstChild.childNodes[1].childNodes[e].getAttribute("data-date"));
      var night = morning + 86400000;
      // console.log("Morning = " + morning + " and Night = " + night);
      if(timeArr[time] >= morning && timeArr[time] < night) { // Found it!
        // console.log("I HATH FOUND IT AT " + morning + " and " + night);
        var index = (timeArr[time] - morning)/900000 + 1; // 900000 is milliseconds/15min
        // console.log("Col = " + e + " Row = " + index + " timeArr = " + timeArr[time]);



        // Must add avail class. The problem is I don't have addClass method from jquery.
        // This is a pain, I must find a better solution later.
        elem.firstChild.childNodes[index].childNodes[e].className += " avail";
        // elem.firstChild.childNodes[index].childNodes[e].className = "slotCell avail";
        // if(interactive)
        //   elem.firstChild.childNodes[index].childNodes[e].className += " dateNum";

        // elem.firstChild.childNodes[index].childNodes[e].style += " background-color: "+colors[userArr[time].length]+";";
        elem.firstChild.childNodes[index].childNodes[e].style.backgroundColor = colors[userArr[time].length];

        if(!interactive) {
          elem.firstChild.childNodes[index].childNodes[e].setAttribute("data-toggle", "tooltip");
          elem.firstChild.childNodes[index].childNodes[e].setAttribute("data-container", "body");
          var userLine = "";
          for(user in userArr[time]) {
            userLine += userArr[time][user] + "\n";
          }
          // console.log("Uh oh");
          // console.log(userLine);
          // elem.firstChild.childNodes[index].childNodes[e].setAttribute("title", userArr[time]);
          elem.firstChild.childNodes[index].childNodes[e].setAttribute("title", userLine);


          // elem.firstChild.childNodes[index].childNodes[e].innerHTML = "moodle";

          
        }

        // console.log(elem.firstChild.childNodes[index].childNodes[e].style);

        break;
      } else {
        // console.log("i shant find it");
      }
    }
  }
  // console.log(elem.firstChild.childNodes[1].childNodes);
  // var table = document.getElementsByClassName("cal-table")[0];
  // console.log("step 5");  

};


Slot.prototype.eraseTimes = function(elem) {
  // Ugh. Need to also make the calendar blank before I fill it in I guess.
  // As of whenever I wrote this, this function is only used for the display table
  
  console.log("Did I make it in here?");
  // var timeArr = this.timeArr;

  for(var row=1; row<elem.firstChild.childNodes.length; row++) {
    for(var col=1; col<elem.firstChild.childNodes[1].childNodes.length; col++) {
      
      elem.firstChild.childNodes[row].childNodes[col].className = "slotCell";
      elem.firstChild.childNodes[row].childNodes[col].style.backgroundColor = "white";
      elem.firstChild.childNodes[row].childNodes[col].setAttribute("title","");
      elem.firstChild.childNodes[row].childNodes[col].removeAttribute("data-toggle");
      funThings(elem.firstChild.childNodes[row].childNodes[col]);
      // elem.firstChild.childNodes[row].childNodes[col].removeAttribute("data-container");
      // console.log("row = " + row + " col = " + col + " class = " + elem.firstChild.childNodes[row].childNodes[col].className);


    }
  }

  console.log("Supposedly");
}
