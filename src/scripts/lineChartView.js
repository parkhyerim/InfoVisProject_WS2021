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


    //console.log(nestData(data));
    var margin = {top:10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var total= d3.count(data, d => d.AnzahlFall);
    console.log(total);

  
  var svg = d3.select("#visualisationContainer")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var xAxis = d3.scaleLinear()
                  .domain(d3.extent(data, item => Number(parseDate(item.Meldedatum))))
                  .range([0, width]);
  
                  

  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xAxis));

  
  var yAxis = d3.scaleLinear()
      .domain([0, d3.max(data, item => Number(total))])
      .range([height, 0]);
  
  svg.append("g")
      .call(d3.axisLeft(yAxis));
  

  var curve = svg.append("path")
                  .datum(data)
                  .attr("fill", "none")
                  .attr("stroke", "turquoise")
                  .attr("stroke-width", 3)
                  .attr("d", d3.line()
                      .x(item => xAxis(parseDate(item.Meldedatum)) )
                      .y(item => yAxis (10000))
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
          .attr("stroke-width", 3)
          .attr("d", d3.line()
              .x(item => xAxis(Number(parseDate(item.Meldedatum))))
              .y(item => yAxis(Number(total)))
          );

  })



}

function nestData(data){
    console.log(data);
    var dataPerDate = d3.nest()
    .key(function(d) { return d.Datenstand; })
    .entries(data);
    return dataPerDate;
}

function parseDate(date){
    var parseTime = d3.timeParse("%Y-%m-%d");
    var date = date.replaceAll("/", "-").slice(0, 10);
    var dateParsed = parseTime(date);
    return dateParsed;
}

