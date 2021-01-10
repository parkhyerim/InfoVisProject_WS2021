import { InitializeSVG, VisualiseChosenBL } from './scripts/lineChartView.js';
import { ToggleDatePicker, GetDateForFetch } from './scripts/datePicker.js';
import { LoadMap, clickedBl } from './scripts/mapGermany.js';

const checkboxes = document.getElementsByClassName('checkbox');
const mapButton = document.getElementById('mapButton');


function InitialiseEvents(){

    // Initially load map. The map gets hidden in mapGermany.js 
    LoadMap();

    console.log(clickedBl)

    window.onclick = function(event) {
        ToggleDatePicker(event, updateLineChart);
    }

    for (let checkbox of checkboxes){
        checkbox.addEventListener('change', () => {
          updateLineChart();
        });
    }

    // Show map
    let clickIndicator = false;
    mapButton.addEventListener('click', () => {

        if(clickIndicator === false){
            document.getElementById('mapGermany').style.display = 'inline';
            clickIndicator = true;    
        } 
        else if(clickIndicator === true){
            document.getElementById('mapGermany').style.display = 'none';
            clickIndicator = false;
        }
               
    })

    $(".sidenav").sidenav();

    // Also update when the month changes
}


function updateLineChart(){
    VisualiseChosenBL(checkboxes, GetDateForFetch());
}



InitializeSVG();
InitialiseEvents();

