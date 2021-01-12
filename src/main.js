import { InitializeSVG, VisualiseChosenBL } from './scripts/lineChartView.js';
import { ToggleDatePicker, GetDateForFetch } from './scripts/datePicker.js';
import { LoadMap } from './scripts/mapGermany.js';

const mapButton = document.getElementById('mapButton');
const datePickerButton = document.getElementById('datePickerButton');


function InitialiseEvents(){

    // Initially load map. The map gets hidden in mapGermany.js 
    LoadMap();

    // Adds and event listener to the Bundesländer Button
    eventListenerMap();

    // Can't be used like this anymore, because there are several onclicks
    window.onclick = function(event) {
        ToggleDatePicker(event, updateLineChart);
    }
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

        /** MutationObserver looks at all the html text elements and has a look if their
            attributes changed. If the class attribute changed to `selected-bl` a new Bundesland
            has been selected in the map
        */
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

function updateLineChart(bl, checked){
    /** Adds the curve for the selected Bundesland to the line chart
        `checked` indicates if the mutated element was a Bundesland selected on the map.
        It is `false` if another element mutated somehow.
    */
    VisualiseChosenBL(bl, checked, GetDateForFetch());
}



InitializeSVG();
InitialiseEvents();

