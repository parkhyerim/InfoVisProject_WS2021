// Set the dimensions of the canvas / graph
var casesData = [];
function fetchDataCases(){
    fetch(
        'https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.geojson',
        {
            method: 'GET'
        })
        .then(response => {
            return response.json()
        
        })
        .then(data => {
            var dateFeat = data.features;
            dateFeat.forEach(element => {
                if(element.properties.Bundesland == "Bayern"){
                    casesData.push(element.properties);
                }
              
            });
            
            visualiseChart(casesData);
    
        });
};

fetchDataCases();
  
function visualiseChart(data) {

    var formattedData = groupData(data);

    console.log(formattedData);
    var margin = {top:10, right: 30, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var total= d3.count(data, d => d.AnzahlFall);

    console.log(data[0].Meldedatum);
    console.log(getDate(data[data.length-1]));

  
  var svg = d3.select("#visualisationContainer")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", `translate(${margin.left}, ${margin.top})`);



  var xAxis = d3.scaleTime()
                  .domain(d3.extent(data, function(d) { 
                    return getDate(d)
                  }))
                  .range([0, width]);
  
                  

  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xAxis));

  
  var yAxis = d3.scaleLinear()
      .domain([0, d3.max(data, item => Number(3000))])
      .range([height, 0]);
  
  svg.append("g")
      .call(d3.axisLeft(yAxis));
  

  var curve = svg.append("path")
                  .datum(data)
                  .attr("fill", "none")
                  .attr("stroke", "turquoise")
                  .attr("stroke-width", 1)
                  .attr("d", d3.line()
                      .x(item => xAxis(getDate(item)) )
                      .y(item => yAxis (getCasesPerDay(formattedData, item)))
                  );

  d3.select("#mySlider").on("change", function(d){
      selectedValue = this.value
      xAxis.domain([selectedValue, d3.max(data, item => Number(parseDate(item.Meldedatum)))])
          .range([0, width]);
      
      svg.select("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(xAxis));

      curve.datum(data)
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 1)
          .attr("d", d3.line()
              .x(item => xAxis(Number(12)))
              .y(item => yAxis(Number(3000)))
          );

  })


}

function groupData(data){
    casesPerDay = d3.group(data, d => d.Meldedatum);
    console.log(casesPerDay.keys().next());
    var mapAsc = new Map([...casesPerDay.entries()].sort());
    return mapAsc;
}


function getCasesPerDay(formattedData, item){
    return formattedData.get(item.Meldedatum).length;

}

function getDate(d) {
    return new Date(d.Meldedatum);
}


function parseDate(date){
    var parseTime = d3.timeParse("%Y-%m-%d");
    var date = date.replaceAll("/", "-").slice(0, 10);
    var dateParsed = parseTime(date);
    return dateParsed;
}

