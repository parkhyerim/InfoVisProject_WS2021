import { InitializeSVG, VisualiseChosenBL } from './scripts/lineChartView.js';
import { ToggleDatePicker, GetDateForFetch } from './scripts/datePicker.js';
import { LoadMap } from './scripts/mapGermany.js';

const mapButton = document.getElementById('mapButton');


function InitialiseEvents(){

    // Initially load map. The map gets hidden in mapGermany.js 
    LoadMap();
    showHideMap();

   // console.log(clickedBl) // Add class or other attribute to selected text field check for that and then reset it afterwards

    window.onclick = function(event) {
        ToggleDatePicker(event, updateLineChart);
    }
}


function updateLineChart(bl, checked){
    VisualiseChosenBL(bl, checked, GetDateForFetch());
}

function returnSelectedBl(){
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

function showHideMap(){
    let clickIndicator = false;
    mapButton.addEventListener('click', () => {
        
        if(clickIndicator === false){
            returnSelectedBl()
            document.getElementById('mapGermany').style.display = 'inline';
            clickIndicator = true;    
        } 
        else if(clickIndicator === true){
            document.getElementById('mapGermany').style.display = 'none';
            clickIndicator = false;
        }
               
    })
}



InitializeSVG();
InitialiseEvents();

