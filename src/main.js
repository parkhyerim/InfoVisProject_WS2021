import { InitializeSVG, UpdateLineChartPathMonth, ShowDEData, AddBundeslandToLineChart, RemoveBundeslandFromLineChart } from './scripts/lineChartView.js';
import { GetDateForFetch, allMonths } from './scripts/datePicker.js';
import { GetCasesDE } from './scripts/getLineChartData.js';
import { LoadMap } from './scripts/mapGermany.js';
import { Displaymobilitydata } from './scripts/treeMapView.js';

const mapButton = document.getElementById('mapButton');
const datePickerButton = document.getElementById('datePickerButton');
const dateButtons = document.getElementsByClassName('date');
let selectedBL = [];
const allDataTempArray = [];
let allData = {};

function initialiseEvents(){

    // Initially load map. The map gets hidden in mapGermany.js 
    LoadMap();

    // Adds and event listener to the Bundesländer Button
    eventListenerMap();

    //Adds event listener on datePickerButton and each droopdown DateButton element
    eventListenerDatePicker();

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

    const startDate = new Date()
    const promises = [];

    for(let i=0; i<allMonths.length; i++){
        promises.push(
            GetCasesDE(allMonths[i]).then(casesDE => {
                const endDate = new Date()
                console.log((endDate-startDate)/1000)
                allDataTempArray.push(casesDE)
            })
        )
    }
    return Promise.all(promises)
}


function eventListenerDatePicker() {
  //toggle date picker dropdown
    datePickerButton.addEventListener('click', () => {
        document.getElementById("dateDropdown").classList.toggle("hidden");
    });

     //adds an event listener for every Date in the Dropdown
    for(let date of dateButtons){
        date.addEventListener('click', ()=> {
                
            datePickerButton.textContent = date.textContent;

            document.getElementById("dateDropdown").classList.toggle("hidden");
            date.classList.add('selectedDate');
            
           
            ShowDEData(GetDateForFetch(), allData)

            //when date is selected: update lineChart for every checked BL in the map    
            selectedBL.forEach((bundesland) => {
                UpdateLineChartPathMonth(bundesland, GetDateForFetch())

            })   
          //Displaymobilitydata(GetDateForFetch());
        })
            
    } 
}

function eventListenerMap(){
    let mapButtonClicked = true;
    mapButton.addEventListener('click', () => {
        
        /** If the map button is clicked, one or more Bundesländer can be selected and will 
            then be displayed
        */
        if(mapButtonClicked === true){
            initializeMap()
            document.getElementById('mapGermany').style.display = 'inline';
            mapButtonClicked = false;    
        } 
        else if(mapButtonClicked === false){
            document.getElementById('mapGermany').style.display = 'none';
            mapButtonClicked = true;
        }               
    })
}

function updateLineChart(bl, newBLWasSelected){
    /** Adds the curve for the selected Bundesland to the line chart
        `checked` indicates if the mutated element was a Bundesland selected on the map.
        It is `false` if another element mutated somehow.
    */

    // newBLWasSelected only true if a new Bundesland was selected
    // false when only the date was changed
    //VisualiseChosenBL(bl, newBLWasSelected, GetDateForFetch());
}

function initializeMap(){
    //Displaymobilitydata(GetDateForFetch());
    
    const mapSelectedBl = document.getElementsByTagName('text');
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

