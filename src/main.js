import { InitializeSVG, VisualiseChosenBL } from './scripts/lineChartView.js';
import { ToggleDatePicker, GetDateForFetch } from './scripts/datePicker.js';

const checkboxes = document.getElementsByClassName('checkbox');



export function InitialiseEvents(){
    window.onclick = function(event) {
        ToggleDatePicker(event, updateLineChart);
    }

    for (let checkbox of checkboxes){
        checkbox.addEventListener('change', () => {
          updateLineChart();
        });
    }

    // Also update when the month changes
}


function updateLineChart(){
    VisualiseChosenBL(checkboxes, GetDateForFetch());
}



InitializeSVG();
InitialiseEvents();