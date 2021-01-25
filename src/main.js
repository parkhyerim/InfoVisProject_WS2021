import { InitializeSVG, UpdateLineChartPathMonth, ShowDEData, AddBundeslandToLineChart, RemoveBundeslandFromLineChart } from './scripts/lineChartView.js';
import { GetDateForFetch, allMonths } from './scripts/datePicker.js';
import { GetCasesDE } from './scripts/getLineChartData.js';
import { LoadMap } from './scripts/mapGermany.js';
import { Displaymobilitydata } from './scripts/treeMapView.js';
import { UpdateSelectedRegionsList } from './scripts/treemapMobilityView.js';

const dateButtons = document.getElementsByClassName('date');
const transportButton = document.getElementsByClassName('transport')

let selectedBL = [];
const allDataTempArray = [];
let allData = {};


function initialiseEvents(){

    // Load map and add the mutation observer to its text fields
    LoadMap().then(() => mutationObserverMap());

    eventListenerDatePicker();
    
    $(document).ready(function(){
        $('.tabs').tabs();
        $('.tooltipped').tooltip();
        $('.modal').modal();

        getBlDichte();
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

    eventListenerTreemap();
    transportButton[0].setAttribute("id", "selectedTransport");
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
            //when date is selected: update lineChart for every checked BL in the map    
            UpdateLineChartPathMonth(GetDateForFetch(), selectedBL)

            Displaymobilitydata(GetDateForFetch(), document.getElementById('selectedTransport').name);
        })
            
    } 
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

function eventListenerTreemap(){

    for (let count=0; count < transportButton.length; count++){
        transportButton[count].addEventListener('click', (event) =>{

            if(document.getElementById('selectedTransport') != null){
                document.getElementById('selectedTransport').removeAttribute("id");
            }

            event.target.setAttribute("id", "selectedTransport");

            Displaymobilitydata(GetDateForFetch(), event.target.name)
        })
    }
}



function updateTreeMap(bl, newBLWasSelected){
    let monthChanged = false;
    console.log(bl, newBLWasSelected)
    if(newBLWasSelected === undefined) {
        newBLWasSelected = true;
        monthChanged = true;
    } 
    UpdateSelectedRegionsList(bl, newBLWasSelected, GetDateForFetch(), monthChanged);
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
                    updateTreeMap(mutation.target.id, newBLWasSelected)
                     
                } else {
                    newBLWasSelected = false;
                    //add selected BL to selectedBL array
                    const index = selectedBL.indexOf(mutation.target.id)
                    selectedBL.splice(index, 1);
                    RemoveBundeslandFromLineChart(mutation.target.id);
                    updateTreeMap(mutation.target.id, newBLWasSelected) 
                } 
               // updateTreeMap(mutation.target.id, newBLWasSelected)  
                //document.getElementById("lineChartContainer").classList.remove("hidden");
                //updateLineChart(mutation.target.id, newBLWasSelected)            
                //updateLineChart(mutation.target.id, newBLWasSelected)            
                //UpdateLineChartBundesland(mutation.target.id, newBLWasSelected);
                getBlDichte();
            }
           
        })  
    }) 
    const config = { attributes: true };

    for (let blMap of mapSelectedBl){
        observer.observe(blMap, config);
    }
}


function getBlDichte() {

    let container = document.getElementById("BevölkerungsdichteContainer").children;
    let blData =[];
    d3.csv("../src/data/Bundesland-Dichte.csv").then(function(data) {
        data.forEach((e) => {
            if(e.Bundesland == selectedBL){
                console.log(e.insgesamt + e.Bundesland);
            }
        })
        blData.push(data[0]);
        blData.push(data[1]);
        blData.push(data[2]);

        container[0].children[0].innerHTML = blData[0].Bundesland;
        container[0].children[1].innerHTML = blData[0].jeKM2 +" je km²";
        container[1].children[0].innerHTML = blData[1].Bundesland;
        container[1].children[1].innerHTML = blData[1].jeKM2 +" je km²";
        container[2].children[0].innerHTML = blData[2].Bundesland;
        container[2].children[1].innerHTML = blData[2].jeKM2 +" je km²";
      }); 
}

InitializeSVG();
initialiseEvents(); 