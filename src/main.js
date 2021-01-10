import { InitializeSVG, VisualiseChosenBL } from './scripts/lineChartView.js';
import { ToggleDatePicker, GetDateForFetch } from './scripts/datePicker.js';
import { LoadMap } from './scripts/mapGermany.js';

const checkboxes = document.getElementsByClassName('checkbox');
const mapButton = document.getElementById('mapButton');



function InitialiseEvents(){

    // Initially load map. The map gets hidden in mapGermany.js 
    LoadMap();
    showHideMap();

   // console.log(clickedBl) // Add class or other attribute to selected text field check for that and then reset it afterwards

    window.onclick = function(event) {
        ToggleDatePicker(event, updateLineChart);
    }

    for (let checkbox of checkboxes){
        checkbox.addEventListener('change', () => {
          updateLineChart();
        });
    }
}


function updateLineChart(){
    VisualiseChosenBL(checkboxes, GetDateForFetch());
}

function returnSelectedBl(){
    const blLabels = document.getElementsByTagName('text');

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(mutation.attributeName == 'class'){
                    console.log(mutation.target.id)
                }
            })  
        }) 
    const config = { attributes: true };
    
    for (let blLabel of blLabels){
        observer.observe(blLabel, config);    
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

