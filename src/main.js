const lineChartView = require("./scripts/lineChartView.js");
const datePicker = require("./scripts/datePicker.js");
    // This is the entry point for the Bundesländer select via the treemap later on
const checkboxes = document.getElementsByClassName('checkbox');



function initialiseEvents(){
  window.onclick = function(event) {
    datePicker.toggleDatePicker(event, updateLineChart);
  }
  for (let checkbox of checkboxes){
    checkbox.addEventListener('change', () => {
        updateLineChart();
    });
}
}

function updateLineChart(){
    lineChartView.visualiseChosenBL(checkboxes, datePicker.getDateForFetch());
}



lineChartView.initializeSVG();
initialiseEvents();





