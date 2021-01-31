// Helper functions to download the aggregated data for slow internet connections
import { AllDays } from './datePicker.js';
import { FetchData, GetCasesDE } from './getLineChartData.js';
const allBundesländer = ["Schleswig-Holstein", "Hamburg", "Nordrhein-Westfalen", "Bayern", "Baden-Württemberg", 
"Hessen", "Niedersachsen", "Mecklenburg-Vorpommern", "Rheinland-Pfalz", "Saarland", "Sachsen", "Thüringen", 
"Sachsen-Anhalt", "Brandenburg", "Bremen", "Berlin"];

const monthArray = [];
const allDataTempArray = [];
let finalObject = {};
let allDataDE = {};


export function GetOfflineData(){
    
    /** Gather data for all the Bundesländer for every month.
    Iteratres through all the months, fetches the data for every Bundesland and builds an object
    which has the months march to december 2020 as keys. Within those keys there are the 16 Bundesländer with
    the corresponding data for the month.
    */
    const a = document.createElement('a');  
    const aDE = document.createElement('a');  
    a.id = 'downloadBundeslandData';               
    aDE.id = 'downloadDEData';               
    const link = document.createTextNode('Herunterladen der monatlichen Covid19 Infektionen aller Bundesländer'); 
    const linkDE = document.createTextNode('Herunterladen der monatlichen Covid19 Infektionen ganz Deutschlands'); 
    a.appendChild(link); 
    aDE.appendChild(linkDE);  
    document.getElementById('btnContainer').appendChild(a);
    document.getElementById('btnContainer').appendChild(aDE);
    document.getElementById('downloadBundeslandData').style.display = 'none';
    document.getElementById('downloadDEData').style.display = 'none';
  

    AllDays.forEach(month => {
    
      allDataDEMonth(month)
      .then((dataDEMonth) =>{
          const monthparam = new Date(month[0]).getMonth();
             
          monthArray.push({[monthparam]: dataDEMonth})
      }).then(()=> {

          // Checks if the month object (containing all the data for every Bundesland for that date) is already in the final object
          let monthKey = Object.keys(monthArray[monthArray.length-1])[0];
          if(finalObject[monthKey] === undefined){
              finalObject[monthKey] = monthArray[monthArray.length-1];
          }
        }).then(() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(finalObject));
            const downloadBundeslandData = document.getElementById('downloadBundeslandData');
            downloadBundeslandData.setAttribute("href", dataStr );
            downloadBundeslandData.setAttribute("download", `covid19cases_bundeslaender_monthly.json`);
            downloadBundeslandData.click();
        })
    })

    // Iterates through all the Bundesländer and fetches the data for the selected month
    async function allDataDEMonth(month){
      let dataDEMonth = {};

      for(let i=0; i<allBundesländer.length; i++){
        await FetchData(allBundesländer[i], month)
                .then((dataArray) => {
                  if(dataDEMonth[allBundesländer[i]] === undefined){
                    dataDEMonth[allBundesländer[i]] = dataArray
                  }
                })
      }
      return dataDEMonth;
    }

    // Sums up cases throughout Germany for each "Meldedatum" and gathers them in an object sorted by month
    gatherData().then(() => {
        allDataDE = allDataTempArray.reduce((accumulator, currentValue) => {

            let month = new Date(currentValue[0].Meldedatum).getMonth();
            
            if(accumulator[month] === undefined){
                accumulator[month] = currentValue
            }
            return accumulator
        }, {})
      
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allDataDE));
        const downloadDEData = document.getElementById('downloadDEData');
        downloadDEData.setAttribute("href", dataStr);
        downloadDEData.setAttribute("download", "covid19cases_germany_monthly.json");
        downloadDEData.click();
    })
}


async function gatherData(){

    //const startDate = new Date()
    const promises = [];

    for(let i=0; i<AllDays.length; i++){
        promises.push(
            GetCasesDE(AllDays[i]).then(casesDE => {
                //const endDate = new Date()
                //console.log((endDate-startDate)/1000)
                allDataTempArray.push(casesDE)
            })
        )
    }
    return Promise.all(promises)
}
