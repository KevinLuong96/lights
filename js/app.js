// $('#lights-selector li').click(function(event) {
//   if($(this).hasClass('on')){
//     $(this).removeClass('on');
//   }
//   else{
//     $(this).addClass('on');
//   }
// });

// function colorGen(){
//   //generate a random soft color 
//   var color = 'rgb(';
//   for(var i = 0; i < 3; i ++){
//     color += Math.floor((Math.random() * 128) + 128);
//     if( i != 2){
//       color += ',';
//     }
//   }
//   color += ')';
//   return color;
// }

//list which contains all of the alarms
var alarmsList = [];


function Alarm(id, time, dow, repeat, type, typeID, action, timer){
  //constructor function for alarm object
  this.id = id;
  this.time = time;
  this.dow = dow;
  this.repeat = repeat;
  this.type = type;
  this.typeID = typeID;
  this.action = action;
  this.timer = timer;
};

function allLights( status ){
//turn off or on all lights and update ui when button is pressed

  if(status === 'on'){
    // var url = "$g0,1";
  }
  else if(status ==='off'){
    // var url = "$g0,0";
  }
  // $.get(url);
  // updateLights();

  // temporary ui update
  $('#lights-selector li').removeClass().addClass(status);
}

function displayTime(){
  var time= Date();
  time = time.split(/\s|:/);

  //create and append a string to the body that contains the formatted time
  var timeString = '';
  for( var i = 0; i < 7; i++){
    timeString += time[i];

    if(i == 2){
      timeString += ',';
    }
    if(i === 4 || i ===5){
      timeString += ':';
    }
    else{
      timeString += ' ';
    }
  }
  $('#time').html(timeString);

}

function updateSystemTime(  ){
  var time = Date();
  var Months = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',  
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
  };
  var url = '$T';

  time = time.split(/\s|:/);
  time[1] = Months[time[1]];

  for(var i =4; i < 7; i ++){
    url += time[i];
    url += ',';
  }
  for(var j = 1; j < 4; j++){
    url += time[j]
    if(j != 3){
      url += ',';
    }
  }

}

function toggleTab( name ){
  $('#tabs').children().removeClass('shown');
  $('.tab').hide();
  $('#tabs .' + name).addClass('shown');
  $('#tab-content .' + name).show();

}


$('#tabs h3').click( function(){
  toggleTab($(this).attr('class'));

})

function updateGroups(){
  var url = 'group.txt';
  $.get(url, function(data){
    data = data.split(/[\n\r]/g);

  });

  //temp function
  $.each($('#groups').children(), function(index, val) {
     /* iterate through array or object */
     $(this).addClass('off');
  });
}
function updateLights(){
  //Read the status of the lights and dynamically add to the list
  //Url to the command on the web server

  // ------------------------TO DO ------------------------------------
  //---------------SET URL TO WEB SERVER ADDRESS --------------------
  // var url = '$s';
  var url = 'sample.txt';

  $.get(url, function(data) {
    //Concatenate a string to contain the data for all lights
    var htmlString = '';
    //for each character in the string that is read, create a light list element
    for(var i = 0; i < data.length; i++){
      htmlString += '<li class="light ' + i + ' ';

      //add the class off if the value of the character is 0
      if(data[i] === '0'){
        htmlString += 'off';
      }
      //and on if the value is 1
      else{
        htmlString += 'on';
      }
      htmlString += '">Light ' + i + '</li>';
    }
    //add this string into the html document
    $('#lights-selector').html(htmlString);
  });
}
function importAlarms(){
  // var url = '$L';
  var url = 'alarms.txt';
  var id, time, dow, repeat, type, typeID, action, timer;

  $.get(url, function(data){
    //cut the string into easier to use portions
    data = data.replace(/\r?\n|\r/g,'');
    data = data.replace(/-/g,'');
    data = data.split(/\d\./g);

    data.shift();
    $.each(data, function(index, val) {
       /* iterate through array or object */
       data[index] = data[index].split(' ');
    });

    console.log(data);
    $.each(data, function(index, val) {
      //for each alarm, set the properties to the string values
      id = val[val.indexOf('ID:') + 1];
      time = val[val.indexOf('Time:') + 1];
      dow = val[5].substring(4);
      repeat = val[6].substring(7);
      if(val[7].startsWith('device:')){
        type = 'device';
        typeID = val[7].substring(7);
      }
      else if(val[7].startsWith('group:')){
        type = 'group';
        typeID = val[7].substring(6);
      }
      action = val[8].substring(7);
      timer = val[9].substring(6);

      //create and push the alarm to the alarm list
      alarmsList.push(new Alarm(id, time, dow, repeat,
         type, typeID, action, timer));
    });
  });
}
function displayAlarms(){

}

$('body').delegate('.light', 'click', function(event) {
  //record the number of the light that is pressed
  var lightNumber = $(this).attr('class').split(' ')[1];
  // create a string to select the light and apply the switch status command
  // var url = '$d' + lightNumber + ',2';
  // $.get(url);
  // updateLights();

  //temporary function -----------------------------------------------------
  $(this).toggleClass('on').toggleClass('off');;

});

$('#all-on').click(function(){
  allLights('on');
});
$('#all-off').click(function(){
  allLights('off');
});

 
jQuery(document).ready(function($) {
  //show the controls tab by default
  $('.tab').hide();
  toggleTab('controls');
  updateGroups();
  updateLights();
  displayTime();
  setInterval(displayTime, 1000);
});


