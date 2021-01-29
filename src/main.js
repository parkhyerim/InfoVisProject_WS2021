import { InitializeSVG, UpdateLineChartPathMonth, ShowDEData, AddBundeslandToLineChart, RemoveBundeslandFromLineChart } from './scripts/lineChartView.js';
import { GetDateForFetch, allMonths } from './scripts/datePicker.js';
import { LoadMap } from './scripts/mapGermany.js';
import { Displaymobilitydata } from './scripts/treeMapView.js';
import { UpdateSelectedRegionsList } from './scripts/treeMapMobilityView.js';
import { AllData } from './data/summedData.js';

const dateButtons = document.getElementsByClassName('date');
const transportButton = document.getElementsByClassName('transport')
let car = document. getElementById("car");

let selectedBL = [];
let blData ={};

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
    
    UpdateSelectedRegionsList(bl, newBLWasSelected, GetDateForFetch(), monthChanged, selectedBL);
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

                if(mutation.target.classList[2] === 'selected-bl'){
                    const selectedColor = mutation.target.getAttribute('fill');
                    newBLWasSelected = true;
                    //add selected BL to selectedBL array
                    selectedBL.push(mutation.target.id);

                    AddBundeslandToLineChart(mutation.target.id, GetDateForFetch(), selectedBL, selectedColor);
                    getBlDichte(selectedColor)
                } else {
                    newBLWasSelected = false;
                    //add selected BL to selectedBL array
                    const index = selectedBL.indexOf(mutation.target.id)
                    selectedBL.splice(index, 1);
                    
                    RemoveBundeslandFromLineChart(mutation.target.id, selectedBL, GetDateForFetch());
                } 

                updateTreeMap(mutation.target.id, newBLWasSelected)
                if(selectedBL.length == 0){
                    d3.select("#treemapwrapper2").select("svg").remove();
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


function getBlDichte(selectedColor) {
    let container = document.getElementById("BevölkerungsdichteContainer").children;
    for(let i=0; i<3; i++){
       // console.log(container[i].children[0].innerHTML)
        if(container[i].children[0].children[0] !== undefined & container[i].children[0].children[1] !== undefined){
            container[i].children[0].children[0].innerHTML = "";
            container[i].children[0].children[1].innerHTML = "";  
            container[i].style.visibility = "hidden";  
        }
    }
    
    selectedBL.forEach((bundesland,i) =>{
        container[i].style.visibility = "visible";
        const usedColor = d3.select("."+bundesland+".map")._groups[0][0].getAttribute('fill');

        container[i].children[0].children[0].innerHTML = blData[bundesland].Bundesland;
        container[i].children[0].children[1].innerHTML = blData[bundesland].jeKM2 +" Einwohner/km²";
        
        container[i].style["border-top"] = "solid 4px " + usedColor;
        container[i].style["border-bottom"] = "solid 4px " + usedColor;
        container[i].style["color"] = usedColor;       
    });
}

function readBLDichte() {
    d3.csv("../src/data/Bundesland-Dichte.csv").then(function(data) {
        blData = data.reduce((accumulator, currentvalue) => {
            let bundesland = currentvalue.Bundesland
            if(accumulator[bundesland] === undefined){
                accumulator[bundesland] = currentvalue
            }
            return accumulator;
        }, {});
    });
}

InitializeSVG();
initialiseEvents(); 