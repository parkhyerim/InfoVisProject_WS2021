let colorBackground, colorText, blHoovered;

// `labelBlArray` stores the names of all the Bundesländer which are appended to the svg
let labelBlArray = [];

// `clickedBlArray` stores the names of all the Bundesländer which have been selected via click
let clickedBlArray = [];

let colors = ["#e29578", "#c16a70", "#A4AA88"]


export async function LoadMap(){

	// Source http://opendatalab.de/projects/geojson-utilities/
	await d3.json('../src/data/bundeslaender.geojson').then((geojson)=>{
				
		const width = 600;
		const height =450;


		const svg = d3  
			.select("#mapGermany")
			.classed("svg-container", true)   
			.append("svg")
			.attr("class", "map-germany")
			.attr("preserveAspectRatio", "xMinYMin meet")
          	.attr("viewBox", "0 0 600 450")
          	.classed("svg-content-responsive", true)
			.attr("id", "svgMap")



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
			.attr("class", d => d.properties.GEN + " map") // Sets the name of the Bundesland as the classname
			.attr("id", d => d.properties.GEN) // Sets the name of the Bundesland as the id
			.attr("fill", "#e5f2f2")  
			.attr("stroke", "#008080")  
			.attr("stroke-width", 0.75)
			.style("cursor", "pointer")
			.on("click", clickEvent);
			

		 svg.append("g")  
			.selectAll("text")  
			.data(geojson.features)  
			.enter()  
			.append("text")  
			.attr("text-anchor", "middle") 
			.attr("font-size", 20)
			.style("fill", "#D58E00")
			.style("font-weight", "bold")
			.style("font-family", "Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
			.style("visibility", "hidden")
			.attr("class", d => d.properties.GEN + " label") // Sets the name of the Bundesland as the ID
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
					return d.properties.GEN.toUpperCase();
				}
				
			})
			//.on("mouseover", highlightBl)
			//.on("mouseout", resetBlColor)
			.on("click", clickEvent)
			.style("cursor", "pointer");  
			

	});

	
}



/*function highlightBl(){

	// Get the name of the Bundesland currently hoovered over via the ID of the HTML element
	blHoovered = d3.select(this)._groups[0][0].id
	
	// The name of the Bundesland was given as a class name to each path and with its help gets filled now
	if(d3.select(this)._groups[0][0].classList[0] != 'selected-bl'){
		colorBackground = d3.select("."+blHoovered).attr("fill");
	}

	d3.select("."+blHoovered).attr("fill", "#009688");

	colorText = d3.select(this).style("fill");
	d3.select(this)
		.style("fill", "white")
		.attr("font-weight", "bold");		
}

function resetBlColor(){	
	if(d3.select(this)._groups[0][0].classList[0] != 'selected-bl'){
		d3.select("."+blHoovered).attr("fill", colorBackground);
		d3.select(this)
			.style("fill", colorText)
			.attr("font-weight", "normal");	
	} 
}*/


function clickEvent(){

	const className = d3.select(this)._groups[0][0].className.baseVal;
	const clickedBl = className.substr(0, (className.indexOf(" ")));

	// Check if a Bundesland has already been clicked
	let clickedBool = false;
	
	clickedBlArray.forEach( bl => {
		if(bl === clickedBl){
			clickedBool = true;
		}
	})

	// If the clicked on Bundesland wasn't clicked before, it is marked and added to `clickedBlArray`
	if(clickedBool === false & clickedBlArray.length <= 2) {
		const firstColor = colors[0];

		d3.select("."+clickedBl)
			.attr("fill", firstColor)

		//d3.select(".label." + clickedBl)._groups[0][0].style.visibility = "visible";

		clickedBlArray.push(clickedBl);
		
		// Necessary to get the selected Bundesland in main.js
		d3.select(".label."+clickedBl)._groups[0][0].classList.add('selected-bl');
		d3.select(".map."+clickedBl)._groups[0][0].classList.add('selected-bl');

		//d3.select(".label."+clickedBl)._groups[0][0].classList.add(firstColor);
		//d3.select(".path."+clickedBl)._groups[0][0].classList.add(firstColor);
		// Removes the just used color from the first place of the array to the last
		colors.shift();
		colors.splice(colors.length, 0, firstColor);
	}  

	/** If it has been clicked before the selection is revoked by changing the stroke coloring and removing the 
		Bundesland from the array.
	*/
	else if(clickedBool === true){	

		// Gets the color value of the unselected Bundesland
		const revokedColor = d3.select("."+clickedBl)._groups[0][0].attributes[3].value;	
		colors.pop(); // Removes the revoked color from the array (it is always the last item of the array)
		colors.splice(0, 0, revokedColor); // Inserts revoked color in the beginning so it is chosen next

		d3.select("."+clickedBl)
			.attr("stroke", "white")
			.attr("fill", "#e5f2f2")
			.attr("stroke", "#008080")  
			.attr("stroke-width", 0.75)

		d3.select(".label." + clickedBl)._groups[0][0].style.visibility = "hidden"; // hides the Bundesland label
		const indexBundesland = clickedBlArray.indexOf(clickedBl);
		clickedBlArray.splice(indexBundesland, 1);
		
		// Necessary to get the selected Bundesland in main.js
		d3.select(".label."+clickedBl)._groups[0][0].classList.remove('selected-bl'); 	
		d3.select(".map."+clickedBl)._groups[0][0].classList.remove('selected-bl'); 

		//d3.select(".label."+clickedBl)._groups[0][0].classList.remove(revokedColor); 	
		//d3.select(".label."+clickedBl)._groups[0][0].classList.remove(revokedColor); 	
	} 
	// Alert when more when the user wants to select more than 4 Bundesländer. This would get too messy for the line chart.
	else if(clickedBlArray.length == 3){
		M.toast({html: 'Du hast bereits 3 Bundesländer ausgewählt. Entferne eins per Klick, um ein neues auswählen zu können.'}, 3000);
		// alert("Du hast bereits 3 Bundesländer ausgewählt. Entferne eins per Klick, um ein neues auswählen zu können.")
	} 
}