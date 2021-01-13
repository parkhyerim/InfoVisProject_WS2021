import { InitializeSVG, VisualiseChosenBL } from './scripts/lineChartView.js';
import { GetDateForFetch } from './scripts/datePicker.js';
import { LoadMap } from './scripts/mapGermany.js';

const mapButton = document.getElementById('mapButton');
const datePickerButton = document.getElementById('datePickerButton');
const dateButton = document.getElementsByClassName('date');
var selectedBL = [];
var checked;


function InitialiseEvents(){

    // Initially load map. The map gets hidden in mapGermany.js
    LoadMap();

    // Adds and event listener to the Bundesländer Button
    eventListenerMap();

    //Adds event listener on datePickerButton and each droopdown DateButton element
    eventListenerDatePicker();


}

function eventListenerDatePicker() {
  //toggle date picker dropdown
  datePickerButton.addEventListener('click', () => {
    document.getElementById("dateDropdown").classList.toggle("hidden");
    }
  );
  //adds an event listener for every Date in the Dropdown
  Array.prototype.forEach.call(dateButton, function(date){
    date.addEventListener('click', ()=> {
      datePickerButton.textContent = date.textContent;
      date.classList.add("selectedDate");
      //when date is selected: update lineChart for every checked BL in the map
      selectedBL.forEach((bl) => {
        updateLineChart(bl);
      });
      displaymobilitydata(GetDateForFetch());

    })

  });
}

function eventListenerMap(){
    let mapButtonClicked = true;
    mapButton.addEventListener('click', () => {

        /** If the map button is clicked, one or more Bundesländer can be selected and will
            then be displayed
        */
        if(mapButtonClicked === true){
            visualizeSelectedBl()
            document.getElementById('mapGermany').style.display = 'inline';
            mapButtonClicked = false;
        }
        else if(mapButtonClicked === false){
            document.getElementById('mapGermany').style.display = 'none';
            mapButtonClicked = true;
        }

    })
}


function visualizeSelectedBl(){
    const mapSelectedBl = document.getElementsByTagName('text');
    console.log(selectedBL);
        /** MutationObserver looks at all the html text elements and has a look if their
            attributes changed. If the class attribute changed to `selected-bl` a new Bundesland
            has been selected in the map
        */
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(mutation.attributeName === 'class'){

                    if(mutation.target.classList[0] === 'selected-bl'){
                        checked = true;
                        //add selected BL to selectedBL array
                        selectedBL.push(mutation.target.id);
                    } else {
                        checked = false;
                        //add selected BL to selectedBL array
                        selectedBL.remove(mutation.target.id);
                    }

                    updateLineChart(mutation.target.id)
                }
            })
        })
    const config = { attributes: true };

    for (let blMap of mapSelectedBl){
        observer.observe(blMap, config);
    }
}

function updateLineChart(bl){
    /** Adds the curve for the selected Bundesland to the line chart
        `checked` indicates if the mutated element was a Bundesland selected on the map.
        It is `false` if another element mutated somehow.
    */
    VisualiseChosenBL(bl, checked, GetDateForFetch());
}



InitializeSVG();
InitialiseEvents();

