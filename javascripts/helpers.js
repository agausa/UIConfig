//******************************************************************************
//
//  helper.js
//
// Copyright Altice USA 2016
//******************************************************************************

//______________________ getDateString ________________________________________

function getDateString (date) {
  var dateString = date.getMonth() + '/' + date.getDate() + '/';
  var shortYear = date.getFullYear() - 2000;

  dateString += shortYear + ' ';

  var time = date.getHours();
  if(time < 12){
    dateString += time + ' am';
  }else {
    dateString += (time - 12) + ' pm';
  }

  return dateString;
}
