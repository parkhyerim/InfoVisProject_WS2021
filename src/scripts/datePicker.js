

export function GetDateForFetch(){
  console.log(document.getElementById('selectedDate').textContent);
  switch (document.getElementById('selectedDate').textContent) {
    case "März 2020":
      return ["2020-03-01", "2020-03-31"]
    case "April 2020":
      return ["2020-04-01", "2020-04-30"]
    case "Mai 2020":
      return ["2020-05-01", "2020-05-31"]
    case "Juni 2020":
      return ["2020-06-01", "2020-06-30"]
    case "Juli 2020":
      return ["2020-07-01", "2020-07-31"]
    case "August 2020":
      return ["2020-08-01", "2020-08-31"]
    case "September 2020":
      return ["2020-09-01", "2020-09-30"]
    case "Oktober 2020":
      return ["2020-10-01", "2020-10-31"]
    case "November 2020":
      return ["2020-11-01", "2020-11-30"]
    case "Dezember 2020":
      return ["2020-12-01", "2021-12-31"]
    case "Januar 2021":
      return ["2021-01-01", "2021-01-31"]
    default:
      return ["2020-03-01", "2020-03-31"]
  }

}

function getSelectedDate(){
  Array.prototype.forEach.call(dateButton, function(date){
    if(date.selected){
      console.log(date + "is selected");
    }
  });
  
}
