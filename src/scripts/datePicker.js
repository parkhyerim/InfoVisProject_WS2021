

export function GetDateForFetch(){
  console.log(document.getElementById('selectedDate').textContent);
  switch (document.getElementById('selectedDate').textContent) {
    case "März":
      return ["2020-03-01", "2020-03-31"]
    case "April 2020":
      return ["2020-04-01", "2020-04-30"]
    case "Mai":
      return ["2020-05-01", "2020-05-31"]
    case "Juni":
      return ["2020-06-01", "2020-06-30"]
    case "Juli":
      return ["2020-07-01", "2020-07-31"]
    case "August":
      return ["2020-08-01", "2020-08-31"]
    case "September":
      return ["2020-09-01", "2020-09-30"]
    case "Oktober":
      return ["2020-10-01", "2020-10-31"]
    case "November":
      return ["2020-11-01", "2020-11-30"]
    case "Dezember":
      return ["2020-12-01", "2021-12-31"]
    default:
      return ["2020-03-01", "2020-03-31"]
  }

}


