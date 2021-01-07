let colorBackground, colorText, blSelected;
export let chosenBl;

export function loadMap(){

	// Source http://opendatalab.de/projects/geojson-utilities/
	d3.json('../src/data/bundeslaender.geojson').then((geojson)=>{
				
		const width = 900;
		const height =500;

		const svg = d3  
			.select("#mapGermany")  
			.append("svg")  
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
			//.attr("transform", d => `translate(${path.centroid(d)})`)  
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
			.text(d => d.properties.GEN)
			.on("mouseover", highlightBl)
			.on("mouseout", resetBlColor)
			.on("click", clickEvent)
			.style("cursor", "pointer");  
	});
}

function highlightBl(){

	// Get the name of the Bundesland currently hoovered over via the ID of the HTML element
	blSelected = d3.select(this)._groups[0][0].id
	
	// The name of the Bundesland was given as a class name to each path and with its help gets filled now
	colorBackground = d3.select("."+blSelected).attr("fill");
	d3.select("."+blSelected).attr("fill", "green");

	colorText = d3.select(this).attr("fill");
	d3.select(this)
		.attr("fill", "white")
		.attr("font-weight", "bold");
}

function resetBlColor(){
	d3.select("."+blSelected).attr("fill", colorBackground);
	d3.select(this)
		.attr("fill", colorText)
		.attr("font-weight", "normal");
}

function clickEvent(){
	console.log(d3.select(this)._groups[0][0].id)
	return chosenBl = d3.select(this)._groups[0][0].id;
}

