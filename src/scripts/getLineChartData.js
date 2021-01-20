const allBundesländer = ["Schleswig-Holstein", "Hamburg", "Nordrhein-Westfalen", "Bayern", "Baden-Württemberg", 
"Hessen", "Niedersachsen", "Mecklenburg-Vorpommern", "Rheinland-Pfalz", "Saarland", "Sachsen", "Thüringen", 
"Sachsen-Anhalt", "Brandenburg", "Bremen", "Berlin"];

export async function GetCasesDE(selectedMonth){
  let arrayDE = [];

  /** Iterates through all the Bundesländer.
    `bundeslandArrayMonth` contains the number of cases per day for the 
    corresponding Bundesland. They are pushed into `arrayDE 
  */
  for(let i=0; i<allBundesländer.length; i++){

     await FetchData(allBundesländer[i], selectedMonth)
        .then( bundeslandArrayMonth => {
          arrayDE.push(bundeslandArrayMonth)
        }) 
  }

  // The cases of all Bundesländer are accumulated.
  const accumulatedCasesPerDay = arrayDE.reduce((accumulator, currentValue) =>{ 
    // `currentValue` contains the daily cases of a Bundesland
    currentValue.forEach(obj => {
     
      let day = obj.Meldedatum;
      if(accumulator[day] !== undefined){
        accumulator[day].AnzahlFall = accumulator[day].AnzahlFall + obj.Infos.AnzahlFall;
      } else {
        accumulator[day] = {
          AnzahlFall: obj.Infos.AnzahlFall
        }
      }
    })
    return accumulator;
  }, {})

 // `accumulatedCasesPerDay` gets transformed into an array so it can be easily sorted by date  
  let sortAllCases = [];
  Object.entries(accumulatedCasesPerDay).forEach(([key, value]) => {
    sortAllCases.push({Meldedatum: key, Infos: value})
  })
  // Sorts the array containing the summed up cases by `Meldedatum`
  sortAllCases.sort((a, b) => new Date(a.Meldedatum) - new Date(b.Meldedatum))

  return sortAllCases;
}





export function FetchData(bundesland, selectedMonth){
    console.log(selectedMonth)

    return fetch(
      `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=Meldedatum%20%3E%3D%20TIMESTAMP%20%27${selectedMonth[0]}%2000%3A00%3A00%27%20AND%20Meldedatum%20%3C%3D%20TIMESTAMP%20%27${selectedMonth[1]}%2000%3A00%3A00%27%20AND%20Bundesland%20%3D%20%27${bundesland}%27&outFields=Bundesland,AnzahlFall,Meldedatum,IdBundesland&outSR=4326&f=json`,
        {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
            /** `casesData` is the array where the fetched data will be stored in.
              `feed` is the array of objects returned by the request.
              Each array entry has the following schema
              [attributes: {Bundesland: "", AnzahlFall: "", IdBundesland: "", Meldedatum: ""}]
              By iterating through `feed` and pushing the objects to `casesData` one depth is removed so
              the data can be handled more easily.
            */
            let casesData = [];
            const feed = data.features;
            feed.forEach(elem => {
              casesData.push(elem.attributes);
            });
            return groupDataByDate(casesData);
        });
};

  
/** Groups the received data by date. After the grouping the data is sorted
  datewise and returned as an array
*/
function groupDataByDate(casesData){
  /** `dataEntries` is a new object and `currentValue` is the item of the array 
    currently looked at
  */
  const groupedReport = casesData.reduce((dataEntries, currentValue) => {
    let day = new Date(currentValue['Meldedatum']);
    
    /** Within the first iteration of `reduce` `dataEntries` is undefined. 
      Consequently a new object entry with the `Meldedatum` as the key is being added to
      `dataEntries`. Further information (Bundesland, IdBundesland, AnzahlFall) 
      are added as a value.       
    */
    if(dataEntries[day] !== undefined){
      /** If a key with the `Meldedatum` already exists the number of cases are
        summed up.
      */
      dataEntries[day].AnzahlFall = dataEntries[day].AnzahlFall + currentValue.AnzahlFall;  
    } else {
      dataEntries[day] = {
        Bundesland: currentValue.Bundesland,
        IdBundesland: currentValue.IdBundesland,
        AnzahlFall: currentValue.AnzahlFall
      };  
    }        
    return dataEntries;
  },{})

  // `dataEntries` gets transformed into an array so it can be easily sorted by date  
  let reportArr = [];
  Object.entries(groupedReport).forEach(([key, value]) => {
    reportArr.push({Meldedatum: key, Infos: value})
  })
  // Sorts the array containing the summed up cases by `Meldedatum`
  reportArr.sort((a, b) => new Date(a.Meldedatum) - new Date(b.Meldedatum))
  return reportArr;
}
