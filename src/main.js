import { InitializeSVG, VisualiseChosenBL } from './scripts/lineChartView.js';
import { ToggleDatePicker, GetDateForFetch } from './scripts/datePicker.js';
import { LoadMap } from './scripts/mapGermany.js';

const mapButton = document.getElementById('mapButton');
const datePickerButton = document.getElementById('datePickerButton');


function InitialiseEvents(){

    // Initially load map. The map gets hidden in mapGermany.js 
    LoadMap();

    eventListenerMap();
    eventListenerDropdown();

    // Can't be used like this anymore, because there are several onclicks
    window.onclick = function(event) {
        ToggleDatePicker(event, updateLineChart);
    }
}


function eventListenerMap(){
    let mapButtonClicked = false;
    mapButton.addEventListener('click', () => {
        
        if(mapButtonClicked === false){
            visualizeSelectedBl()
            document.getElementById('mapGermany').style.display = 'inline';
            mapButtonClicked = true;    
        } 
        else if(mapButtonClicked === true){
            document.getElementById('mapGermany').style.display = 'none';
            mapButtonClicked = false;
        }
               
    })
}


function updateLineChart(bl, checked){
    VisualiseChosenBL(bl, checked, GetDateForFetch());
}

function visualizeSelectedBl(){
    const mapSelectedBl = document.getElementsByTagName('text');

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(mutation.attributeName === 'class'){
                    let checked;
                    if(mutation.target.classList[0] === 'selected-bl'){
                        checked = true;
                    } else {
                        checked = false;
                    } 
                    updateLineChart(mutation.target.id, checked)            
                }
            })  
        }) 
    const config = { attributes: true };
    
    for (let blMap of mapSelectedBl){
        observer.observe(blMap, config);    
    }
}




InitializeSVG();
InitialiseEvents();

