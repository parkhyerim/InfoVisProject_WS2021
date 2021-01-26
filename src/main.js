import { InitializeSVG, UpdateLineChartPathMonth, ShowDEData, AddBundeslandToLineChart, RemoveBundeslandFromLineChart } from './scripts/lineChartView.js';
import { GetDateForFetch, allMonths } from './scripts/datePicker.js';
import { LoadMap } from './scripts/mapGermany.js';
import { Displaymobilitydata } from './scripts/treeMapView.js';
import { UpdateSelectedRegionsList } from './scripts/treemapMobilityView.js';
import { AllData } from './data/summedData.js';

const dateButtons = document.getElementsByClassName('date');
const transportButton = document.getElementsByClassName('transport')

let selectedBL = [];
let blData =[];
let colors = ["#e29578", "#c16a70", "#A4AA88"]

function initialiseEvents(){

    // Load map and add the mutation observer to its text fields
    // LoadMap().then(() => mutationObserverMap());
    LoadMap().then(function(){
        mutationObserverMap();
        //mutationObserverTreeMap();
    } );

    eventListenerDatePicker();

    readBLDichte();
    
    $(document).ready(()=>{
        $('.tabs').tabs();
        $('.tooltipped').tooltip();
        $('.modal').modal();
        getBlDichte();    
    })    

    Displaymobilitydata(GetDateForFetch());
    
    ShowDEData(GetDateForFetch(), AllData)

    eventListenerTreemap();
    transportButton[0].setAttribute("id", "selectedTransport");
}

function eventListenerDatePicker() {

     //adds an event listener for every Date in the Dropdown
    for(let date of dateButtons){
        date.addEventListener('click', ()=> {
            //mutationObserverMap();

            //datePickerButton.textContent = date.textContent;
            if(document.getElementById('selectedDate') !== null){
                document.getElementById('selectedDate').removeAttribute("id");
            }

            date.setAttribute("id", "selectedDate");
           
            ShowDEData(GetDateForFetch(), AllData);
            //when date is selected: update lineChart for every checked BL in the map    
            UpdateLineChartPathMonth(GetDateForFetch(), selectedBL)

            Displaymobilitydata(GetDateForFetch(), document.getElementById('selectedTransport').name);

            selectedBL.forEach(bl =>{
                updateTreeMap(bl, undefined)
            })
        })
            
    } 
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
      // console.log(bl+ " " + newBLWasSelected)
    let monthChanged = false;
    if(newBLWasSelected === undefined) {
        newBLWasSelected = true;
        monthChanged = true;
    } 
    UpdateSelectedRegionsList(bl, newBLWasSelected, GetDateForFetch(), monthChanged);
}


function mutationObserverMap(){
    const mapSelectedBl = document.getElementsByTagName('path');
    /** MutationObserver looks at all the html text elements and has a look if their
        attributes changed. If the class attribute changed to `selected-bl` a new Bundesland
        has been selected in the map
    */
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if(mutation.attributeName === 'class'){
                let newBLWasSelected;
                const selectedColor = mutation.target.getAttribute('fill');

                if(mutation.target.classList[2] === 'selected-bl'){
                    newBLWasSelected = true;
                    //add selected BL to selectedBL array
                    selectedBL.push(mutation.target.id);

                    AddBundeslandToLineChart(mutation.target.id, GetDateForFetch(), selectedBL, selectedColor);
                } else {
                    newBLWasSelected = false;
                    //add selected BL to selectedBL array
                    const index = selectedBL.indexOf(mutation.target.id)
                    selectedBL.splice(index, 1);

                    RemoveBundeslandFromLineChart(mutation.target.id, selectedBL);
                } 
                updateTreeMap(mutation.target.id, newBLWasSelected)
                getBlDichte(selectedColor);
            }
        })  
    }) 
    const config = { attributes: true };

    for (let blMap of mapSelectedBl){
        observer.observe(blMap, config);
    }
}


function getBlDichte(selectedColor) {
    console.log(selectedColor)
    let container = document.getElementById("BevölkerungsdichteContainer").children;
    
    selectedBL.forEach((bundesland,i) =>{

        blData.forEach((bl, j) =>{
            if(bl.Bundesland == bundesland){
                container[i].children[0].children[0].innerHTML = bl.Bundesland;
                container[i].children[0].children[1].innerHTML = bl.jeKM2 +" je km²";
                container[i].style["border-top"] = "solid 4px " + colors[i];
                container[i].style["border-bottom"] = "solid 4px " + colors[i];
                container[i].style["color"] = colors[i];
            }
        });        
    });
}

function readBLDichte() {
    d3.csv("../src/data/Bundesland-Dichte.csv").then(function(data) {
        data.forEach(obj => {        
            blData.push(obj);
        })
    });
}

InitializeSVG();
initialiseEvents(); 