


export function GetDateForFetch(){
  switch (document.getElementById('datePickerButton').textContent) {
    case "März 2020":
      return ["2020-03-01", "2020-04-01"]
    case "April 2020":
      return ["2020-04-01", "2020-05-01"]
    case "Mai 2020":
      return ["2020-05-01", "2020-06-01"]
    case "Juni 2020":
      return ["2020-06-01", "2020-07-01"]
    case "Juli 2020":
      return ["2020-07-01", "2020-08-01"]
    case "August 2020":
      return ["2020-08-01", "2020-09-01"]
    case "September 2020":
      return ["2020-09-01", "2020-10-01"]
    case "Oktober 2020":
      return ["2020-10-01", "2020-11-01"]
    case "November 2020":
      return ["2020-11-01", "2020-12-01"]
    case "Dezember 2020":
      return ["2020-12-01", "2021-01-01"]
    case "Januar 2021":
      return ["2021-01-01", "2021-02-01"]
    case "Februar 2021":
      return ["2021-02-01", "2021-03-01"]
    default:
      return ["2020-03-01", "2020-04-01"]
  }

}
