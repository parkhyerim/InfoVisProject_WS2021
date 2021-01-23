import { InitializeSVG, UpdateLineChartPathMonth, ShowDEData, AddBundeslandToLineChart, RemoveBundeslandFromLineChart } from './scripts/lineChartView.js';
import { GetDateForFetch, allMonths } from './scripts/datePicker.js';
import { GetCasesDE } from './scripts/getLineChartData.js';
import { LoadMap } from './scripts/mapGermany.js';
import { Displaymobilitydata } from './scripts/treeMapView.js';


const mapButton = document.getElementById('mapButton');
const dateButtons = document.getElementsByClassName('date');

let selectedBL = [];
const allDataTempArray = [];
let allData = {};


function initialiseEvents(){

    // Load map and add the mutation observer to its text fields
    LoadMap().then(() => mutationObserverMap());

    eventListenerDatePicker();
    
    $(document).ready(function(){
        $('.tabs').tabs();
    });

    Displaymobilitydata(GetDateForFetch());


    // Gather data for all months for DE and add line chart for all DE cases   
    gatherData().then(() => {
        allData = allDataTempArray.reduce((accumulator, currentValue) => {

            let month = new Date(currentValue[0].Meldedatum).getMonth();
            
            if(accumulator[month] === undefined){
                accumulator[month] = currentValue
            }
            return accumulator
        }, {})
        document.getElementById("spinner").classList.remove("active");
        ShowDEData(GetDateForFetch(), allData)
    })

}

async function gatherData(){
    document.getElementById("spinner").classList.add("active");

    //const startDate = new Date()
    const promises = [];

    for(let i=0; i<allMonths.length; i++){
        promises.push(
            GetCasesDE(allMonths[i]).then(casesDE => {
                //const endDate = new Date()
                //console.log((endDate-startDate)/1000)
                allDataTempArray.push(casesDE)
            })
        )
    }
    return Promise.all(promises)
}


function eventListenerDatePicker() {

     //adds an event listener for every Date in the Dropdown
    for(let date of dateButtons){
        date.addEventListener('click', ()=> {
            mutationObserverMap();
                
            //datePickerButton.textContent = date.textContent;
            if(document.getElementById('selectedDate') !== null){
                document.getElementById('selectedDate').removeAttribute("id");
            }

            date.setAttribute("id", "selectedDate");
           
            ShowDEData(GetDateForFetch(), allData);

            console.log(selectedBL);
            //when date is selected: update lineChart for every checked BL in the map    
            selectedBL.forEach((bundesland) => {
                UpdateLineChartPathMonth(bundesland, GetDateForFetch())

            })

            Displaymobilitydata(GetDateForFetch());
        })
            
    } 
}


function mutationObserverMap(){
    const mapSelectedBl = document.getElementsByTagName('text');
    //console.log(mapSelectedBl)
    /** MutationObserver looks at all the html text elements and has a look if their
        attributes changed. If the class attribute changed to `selected-bl` a new Bundesland
        has been selected in the map
    */
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if(mutation.attributeName === 'class'){
                let newBLWasSelected;

                if(mutation.target.classList[0] === 'selected-bl'){
                    newBLWasSelected = true;
                    //add selected BL to selectedBL array
                    selectedBL.push(mutation.target.id);
                    AddBundeslandToLineChart(mutation.target.id, GetDateForFetch());
                } else {
                    newBLWasSelected = false;
                    //add selected BL to selectedBL array
                    const index = selectedBL.indexOf(mutation.target.id)
                    selectedBL.splice(index, 1);
                    RemoveBundeslandFromLineChart(mutation.target.id);
                } 

                //document.getElementById("lineChartContainer").classList.remove("hidden");
                //updateLineChart(mutation.target.id, newBLWasSelected)            
                //updateLineChart(mutation.target.id, newBLWasSelected)            
                //UpdateLineChartBundesland(mutation.target.id, newBLWasSelected);
            }
        })  
    }) 
    const config = { attributes: true };
    
    for (let blMap of mapSelectedBl){
        observer.observe(blMap, config);    
    }
}

InitializeSVG();
initialiseEvents(); 