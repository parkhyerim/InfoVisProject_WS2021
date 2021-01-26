import { InitializeSVG, UpdateLineChartPathMonth, ShowDEData, AddBundeslandToLineChart, RemoveBundeslandFromLineChart } from './scripts/lineChartView.js';
import { GetDateForFetch, allMonths } from './scripts/datePicker.js';
import { AllBundes } from './scripts/getLineChartData.js';
import { LoadMap } from './scripts/mapGermany.js';
import { Displaymobilitydata } from './scripts/treeMapView.js';
import { UpdateSelectedRegionsList } from './scripts/treemapMobilityView.js';
import { AllData } from './data/summedData.js';

const dateButtons = document.getElementsByClassName('date');
const transportButton = document.getElementsByClassName('transport')

let selectedBL = [];
let ow = [];
let finalObject = {};


function initialiseEvents(){

    // Load map and add the mutation observer to its text fields
    LoadMap().then(() => mutationObserverMap());

    eventListenerDatePicker();
    
    $(document).ready(()=>{
        $('.tabs').tabs();
        $('.tooltipped').tooltip();
        $('.modal').modal();
       // getBlDichte();    
    })

    allMonths.forEach(month => {
        AllBundes(month)
        .then((rar) =>{
            let monthparam = Number(month[0].substr((month[0].indexOf("-")+1), 2));
            monthparam.toString();
                 
            ow.push({[monthparam]: rar})
        }).then(()=> {

            let monthKey = Object.keys(ow[ow.length-1])[0];
            if(finalObject[monthKey] === undefined){
                finalObject[monthKey] = ow[ow.length-1];
            }
            console.log(finalObject)
        
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(finalObject));
            var dlAnchorElem = document.getElementById('downloadAnchorElem');
            dlAnchorElem.setAttribute("href",     dataStr     );
            dlAnchorElem.setAttribute("download", "dataforEveryMonth.json");
            dlAnchorElem.click(); 
           
        })
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
                updateTreeMap(bl)
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
    let monthChanged = false;
    if(newBLWasSelected === undefined) {
        newBLWasSelected = true;
        monthChanged = true;
    } 
    UpdateSelectedRegionsList(bl, newBLWasSelected, GetDateForFetch(), monthChanged);
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

                    updateTreeMap(mutation.target.id, newBLWasSelected)

                } else {
                    newBLWasSelected = false;
                    //add selected BL to selectedBL array
                    const index = selectedBL.indexOf(mutation.target.id)
                    selectedBL.splice(index, 1);

                    RemoveBundeslandFromLineChart(mutation.target.id, selectedBL);
                    updateTreeMap(mutation.target.id, newBLWasSelected); 
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