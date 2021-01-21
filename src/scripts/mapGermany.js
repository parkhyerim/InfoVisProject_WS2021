let colorBackground, colorText, blHoovered;

// `labelBlArray` stores the names of all the Bundesländer which are appended to the svg
let labelBlArray = [];

// `clickedBlArray` stores the names of all the Bundesländer which have been selected via click
let clickedBlArray = [];


export function LoadMap(){

	// Source http://opendatalab.de/projects/geojson-utilities/
	d3.json('../src/data/bundeslaender.geojson').then((geojson)=>{
				
		const width = 900;
		const height =500;

		const svg = d3  
			.select("#mapGermany")
			.classed("svg-container", true)   
			.append("svg")
			.attr("class", "map-germany")
			//.attr("preserveAspectRatio", "xMinYMin meet")
          	//.attr("viewBox", "0 0 600 400")
          	//.classed("svg-content-responsive", true)
			.attr("id", "svgMap")
			.attr("width", width)  
			.attr("height", height);

		const projection = d3.geoMercator();
		projection.fitSize([width, height],geojson)

	
		const path = d3.geoPath().projection(projection);
		const color = d3.scaleOrdinal(d3.schemeBlues[9].slice(2,9));
		let offset = geojson.offset;
		
		svg.selectAll("path")
			.data(geojson.features)
			.enter()  
			.append("path")  
			.attr("d", path) 
			.attr("class", d => d.properties.GEN) // Sets the name of the Bundesland as the classname
			.attr("fill", (d, i) => color(i))  
			.attr("stroke", "#FFF")  
			.attr("stroke-width", 0.5);  
			

		svg.append("g")  
			.selectAll("text")  
			.data(geojson.features)  
			.enter()  
			.append("text")  
			.attr("text-anchor", "middle") 
			.attr("font-size", 11)
			.attr("id", d => d.properties.GEN) // Sets the name of the Bundesland as the ID
			.attr("x", d => {
				const bl = d.properties.GEN;
				if(offset[bl] != undefined) {
					return projection(offset[bl])[0];	
				}
			})  
			.attr("y", d => {
				const bl = d.properties.GEN;
				if(offset[bl] != undefined) return projection(offset[bl])[1];
			})
			.text(d => {
				// Only fill the text if there is no text for the Bundesland yet
				let textBool = false;
				labelBlArray.forEach(bl => {
					if(bl === d.properties.GEN || d.properties.GEN.includes("Bodensee")) {
						textBool = true; // Bodensee needs to be mentioned explicitly
					}
				})
				if(textBool === false) {
					labelBlArray.push(d.properties.GEN)	
					return d.properties.GEN;
				}
				
			})
			.on("mouseover", highlightBl)
			.on("mouseout", resetBlColor)
			.on("click", clickEvent)
			.style("cursor", "pointer");  
	});

	// Hide map
	document.getElementById('mapGermany').style.display = 'none'
}


function highlightBl(){

	// Get the name of the Bundesland currently hoovered over via the ID of the HTML element
	blHoovered = d3.select(this)._groups[0][0].id
	
	// The name of the Bundesland was given as a class name to each path and with its help gets filled now
	if(d3.select(this)._groups[0][0].classList[0] != 'selected-bl'){
		colorBackground = d3.select("."+blHoovered).attr("fill");
	}

	d3.select("."+blHoovered).attr("fill", "#009688");

	colorText = d3.select(this).attr("fill");
	d3.select(this)
		.attr("fill", "white")
		.attr("font-weight", "bold");		
}

function resetBlColor(){	
	if(d3.select(this)._groups[0][0].classList[0] != 'selected-bl'){
		d3.select("."+blHoovered).attr("fill", colorBackground);
		d3.select(this)
			.attr("fill", "black")
			.attr("font-weight", "normal");	
	} 
}

function clickEvent(){
	const clickedBl = d3.select(this)._groups[0][0].id;

	// Check if a Bundesland has already been clicked
	let clickedBool = false;
	
	clickedBlArray.forEach( bl => {
		if(bl === clickedBl){
			clickedBool = true;
		}
	})

	// If the clicked on Bundesland wasn't clicked before, it is marked and added to `clickedBlArray`
	if(clickedBool === false & clickedBlArray.length <= 2) {
		d3.select("."+d3.select(this)._groups[0][0].id)
			.attr("fill", "#009688")

		clickedBlArray.push(blHoovered);
		// Necessary to get the selected Bundesland in main.js
		d3.select(this)._groups[0][0].classList.add('selected-bl'); 
	}  
	else if(clickedBlArray.length == 1){
		alert("Mindestens 1 Bundesland muss ausgewählt sein.")
	}

	/** If it has been clicked before the selection is revoked by changing the stroke coloring and removing the 
		Bundesland from the array.
	*/
	else if(clickedBool === true){	
		d3.select("."+d3.select(this)._groups[0][0].id)
			.attr("stroke", "white")
			.attr("fill", colorBackground)
			.attr("stroke-width", 0.5) 

		// Guarantees that at least one Bundesland is always selected after the map was initialized
		if(clickedBlArray.length > 1){
			const index = clickedBlArray.indexOf(clickedBl);
			clickedBlArray.splice(index, 1);
			// Necessary to get the selected Bundesland in main.js
			d3.select(this)._groups[0][0].classList.remove('selected-bl'); 	
		} 
	} 
	// Alert when more when the user wants to select more than 4 Bundesländer. This would get too messy for the line chart.
	else if(clickedBlArray.length == 3){
		alert("Du hast bereits 3 Bundesländer ausgewählt. Entferne eins per Klick, um ein neues auswählen zu können.")
	} 
}