function Calendar(start) {
  this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                     'September', 'October', 'November', 'December'];
  this.dayNames   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  this.render(start);

};


Calendar.prototype.addCalendarGrid = function(dateObject) {
  var iterator = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate() - dateObject.getDay()); // First day in the row of calendar
  var month = [];

  for(var a=0; a<6; a++) { // Set how many weeks into the future you want to see
    var week = [];
    for (var i = 0; i < 7; i++) {
      day = {fullDate: JSON.stringify(iterator), date: iterator.getDate()};
      week.push(day);
      iterator.setDate(iterator.getDate()+1);
    }
    month.push(week);    
  }

  var calhtml = "<table id='calendarTable' class='cal-table'>";
  calhtml += "<tr><th></th>";
  for(day in this.dayNames) {
    calhtml += "<th>"+this.dayNames[day].charAt(0)+"</th>";
  }
  calhtml += "</tr>";

  for(week in month) {
    calhtml += "<tr>";
    calhtml += "<td>"+this.monthNames[new Date(JSON.parse(month[week][0]['fullDate'])).getMonth()].substr(0,3)+"</td>";
    for(day in month[week]) {
      calhtml += "<td class='dateNum' data-row="+week+" data-col="+day+" data-info="+month[week][day]['fullDate']+">"+month[week][day]['date']+"</td>";
    }
    calhtml += "</tr>";
  }
  calhtml += "</table>";
  document.getElementById('calendarGrid').innerHTML = calhtml;
};

Calendar.prototype.render = function(dateObject) {
//  this.addTitle(dateObject);
  this.addCalendarGrid(dateObject);
};