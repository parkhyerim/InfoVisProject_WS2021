import { InitializeSVG, VisualiseChosenBL } from './scripts/lineChartView.js';
import { GetDateForFetch } from './scripts/datePicker.js';
import { LoadMap } from './scripts/mapGermany.js';
import { Displaymobilitydata } from './scripts/treeMapView.js';


const mapButton = document.getElementById('mapButton');
const datePicked = '';
const dateButton = document.getElementsByClassName('date');
let selectedBL = [];


function InitialiseEvents(){

    // Initially load map. The map gets hidden in mapGermany.js 
    LoadMap();

    // Adds and event listener to the Bundesländer Button
    eventListenerMap();

    //Adds event listener on datePickerButton and each droopdown DateButton element
    eventListenerDatePicker();

    
}

function eventListenerDatePicker() {
//adds an event listener for every Datebutton
  Array.prototype.forEach.call(dateButton, function(date){
    date.addEventListener('click', ()=> {
        
    $('.modal').modal('open');
    M.toast({html: 'I am a toast!'}, 3000, 'blue');

     // datePickerButton.textContent = date.textContent;
     if(document.getElementById('selectedDate') != null){
        document.getElementById('selectedDate').removeAttribute("id");
     }
        
      date.setAttribute("id", "selectedDate");
      //when date is selected: update lineChart for every checked BL in the map
      selectedBL.forEach((bl) => {
        updateLineChart(bl);
      })
      initializeMap();
    document.getElementById('mapGermany').style.display = 'inline';
      Displaymobilitydata(GetDateForFetch());
    })

  });

}



function eventListenerMap(){
    
    // let mapButtonClicked = true;
    // mapButton.addEventListener('click', () => {
        
    //     /** If the map button is clicked, one or more Bundesländer can be selected and will 
    //         then be displayed
    //     */
    //     if(mapButtonClicked === true){
    //         initializeMap()
    //         document.getElementById('mapGermany').style.display = 'inline';
    //         mapButtonClicked = false;    
    //     } 
    //     else if(mapButtonClicked === false){
    //         document.getElementById('mapGermany').style.display = 'none';
    //         mapButtonClicked = true;
    //     }               
    // })
}

function updateLineChart(bl, newBLWasSelected){
    /** Adds the curve for the selected Bundesland to the line chart
        `checked` indicates if the mutated element was a Bundesland selected on the map.
        It is `false` if another element mutated somehow.
    */

    // newBLWasSelected only true if a new Bundesland was selected
    // false when only the date was changed
    VisualiseChosenBL(bl, newBLWasSelected, GetDateForFetch());
}

function initializeMap(){
    Displaymobilitydata(GetDateForFetch());
    
    const mapSelectedBl = document.getElementsByTagName('text');
        /** MutationObserver looks at all the html text elements and has a look if their
            attributes changed. If the class attribute changed to `selected-bl` a new Bundesland
            has been selected in the map
        */
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(mutation.attributeName === 'class'){
                    let newBLWasSelected;

                    if(mutation.target.classList[0] === 'selected-bl'){
                        newBLWasSelected = true;
                        //add selected BL to selectedBL array
                        selectedBL.push(mutation.target.id);
                    } else {
                        newBLWasSelected = false;
                        //add selected BL to selectedBL array
                        const index = selectedBL.indexOf(mutation.target.id)
                        selectedBL.splice(index, 1);
                    } 
                    document.getElementById("lineChartContainer").classList.remove("hidden");
                    updateLineChart(mutation.target.id, newBLWasSelected)            
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