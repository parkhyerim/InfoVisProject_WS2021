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
    // LoadMap().then(() => mutationObserverMap());
    LoadMap().then(function(){
        mutationObserverMap();
        mutationObserverTreeMap();
    } );

    eventListenerDatePicker();
    
    $(document).ready(()=>{
        $('.tabs').tabs();
        $('.tooltipped').tooltip();
        $('.modal').modal();
       // getBlDichte();    
    })

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

            selectedBL.forEach(bl =>{
                updateTreeMap(bl, undefined)
            })
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



function updateTreeMap(bl, newBLWasSelected, selectedColor){
      // console.log(bl+ " " + newBLWasSelected)
    let monthChanged = false;
    if(newBLWasSelected === undefined) {
        newBLWasSelected = true;
        monthChanged = true;
    } 
    
    UpdateSelectedRegionsList(bl, newBLWasSelected, GetDateForFetch(), monthChanged, selectedColor, selectedBL);
}

function mutationObserverMap(){
    const mapSelectedBl = document.getElementsByTagName('path');
    //console.log(mapSelectedBl)
    /** MutationObserver looks at all the html text elements and has a look if their
        attributes changed. If the class attribute changed to `selected-bl` a new Bundesland
        has been selected in the map
    */
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if(mutation.attributeName === 'class'){
                let newBLWasSelected;

                if(mutation.target.classList[2] === 'selected-bl'){
                    newBLWasSelected = true;
                    //add selected BL to selectedBL array
                    selectedBL.push(mutation.target.id);

                    const selectedColor = mutation.target.getAttribute('fill');
                    AddBundeslandToLineChart(mutation.target.id, GetDateForFetch(), selectedBL, selectedColor);
                } else {
                    newBLWasSelected = false;
                    //add selected BL to selectedBL array
                    const index = selectedBL.indexOf(mutation.target.id)
                    selectedBL.splice(index, 1);

                    RemoveBundeslandFromLineChart(mutation.target.id, selectedBL);
                } 

                getBlDichte();
            }
        })  
    }) 
    const config = { attributes: true };

    for (let blMap of mapSelectedBl){
        observer.observe(blMap, config);
    }
}


function mutationObserverTreeMap(){
    const mapSelectedBl = document.getElementsByTagName('path');

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if(mutation.attributeName === 'class'){
                let newBLWasSelected;

                if(mutation.target.classList[2] === 'selected-bl'){
                    newBLWasSelected = true;
                    //add selected BL to selectedBL array
                    selectedBL.push(mutation.target.id);            
                  
                } else {
                    newBLWasSelected = false;
                    //add selected BL to selectedBL array
                    const index = selectedBL.indexOf(mutation.target.id)
                    selectedBL.splice(index, 1)
                } 
                const selectedColor = mutation.target.getAttribute('fill');
                  updateTreeMap(mutation.target.id, newBLWasSelected, selectedColor)
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

    container[0].children[0].innerHTML = "";
    container[0].children[1].innerHTML = "";
    
    container[1].children[0].innerHTML = "";
    container[1].children[1].innerHTML = "";
    
    container[2].children[0].innerHTML = "";
    container[2].children[1].innerHTML = "";

    d3.csv("../src/data/Bundesland-Dichte.csv").then(function(data) {
        data.forEach(obj => {

            selectedBL.forEach((bundesland,i) =>{
                if(obj.Bundesland == bundesland){
                    //container[i].children[0].innerHTML = obj.Bundesland;
                    //container[i].children[1].innerHTML = obj.jeKM2 +" je km²";
                }
            }) 
        })
    });
}

InitializeSVG();
initialiseEvents(); 