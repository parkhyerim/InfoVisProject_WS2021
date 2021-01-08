const lineChartView = require("./scripts/lineChartView.js");
const datePicker = require("./scripts/datePicker.js");
const treeChartView = require("./scripts/treeChartView.js");
    // This is the entry point for the Bundesländer select via the treemap later on
const checkboxes = document.getElementsByClassName('checkbox');



function initialiseEvents(){
  window.onclick = function(event) {
    datePicker.toggleDatePicker(event, updateLineChart);
  }
  document.getElementById("carButton").addEventListener("click", log);
  for (let checkbox of checkboxes){
    checkbox.addEventListener('change', () => {
        updateLineChart();
    });
}
}

function log (){
  treeChartView.displaymobilitydata("driving");
  console.log("car clicked");
}

function updateLineChart(){
    lineChartView.visualiseChosenBL(checkboxes, datePicker.getDateForFetch());
}



lineChartView.initializeSVG();
initialiseEvents();





