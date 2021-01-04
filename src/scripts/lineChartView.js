/** `date` is set in the event handler added to the ticks of the xAxis. 
  It contains the selected date which should be used for the treemap.
  To import the clicked date use `import date from './lineChartView.js' in the treemap file`.
  Make sure that the type of the treemap file is set to `module` in the index.html file, e.g.:
   <script type="module" src="scripts/values.js" ></script>
  */
let exportDate = new Date();
export default exportDate;

const choosen_bl  = document.getElementById("bundesländer");
const bl = choosen_bl.value;

//TODO replace the eventListener
let sel = document.getElementById('bundesländer');
sel.addEventListener ("change", function () {
   window.location.reload();
});


function fetchDataCases(){
    fetch(
      `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=Meldedatum%20%3E%3D%20TIMESTAMP%20%272020-12-01%2000%3A00%3A00%27%20AND%20Meldedatum%20%3C%3D%20TIMESTAMP%20%272020-12-15%2000%3A00%3A00%27%20AND%20Bundesland%20%3D%20%27${bl}%27&outFields=Bundesland,AnzahlFall,Meldedatum,IdBundesland&outSR=4326&f=json`,
        {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            /** `casesData` is the array where the fetched data will be stored in.
              `feed` is the array of objects returned by the request.
              Each array entry has the following schema
              [attributes: {Bundesland: "", AnzahlFall: "", IdBundesland: "", Meldedatum: ""}]
              By iterating through `feed` and pushing the objects to `casesData` one depth is removed so
              the data can be handled more easily.
            */
            let casesData = [];
            const feed = data.features;
            feed.forEach(elem => {
              casesData.push(elem.attributes);
            });

            visualiseChart(groupDataByDate(casesData));
        });
};

fetchDataCases();
  
/** Groups the received data by date. After the grouping the data is sorted
  datewise and returned as an array
*/
function groupDataByDate(casesData){
  /** `dataEntries` is a new object and `currentValue` is the item of the array 
    currently looked at
  */
  const groupedReport = casesData.reduce((dataEntries, currentValue) => {
    let day = new Date(currentValue['Meldedatum']);
    
    /** Within the first iteration of `reduce` `dataEntries` is undefined. 
      Consequently a new object entry with the `Meldedatum` as the key is being added to
      `dataEntries`. Further information (Bundesland, IdBundesland, AnzahlFall) 
      are added as a value.       
    */
    if(dataEntries[day] !== undefined){
      /** If a key with the `Meldedatum` already exists the number of cases are
        summed up.
      */
      dataEntries[day].AnzahlFall = dataEntries[day].AnzahlFall + currentValue.AnzahlFall;  
    } else {
      dataEntries[day] = {
        Bundesland: currentValue.Bundesland,
        IdBundesland: currentValue.IdBundesland,
        AnzahlFall: currentValue.AnzahlFall
      };  
    }        
    return dataEntries
  },{})

  // `dataEntries` gets transformed into an array so it can be easily sorted by date  
  let reportArr = [];
  Object.entries(groupedReport).forEach(([key, value]) => {
    reportArr.push({Meldedatum: key, Infos: value})
  })
  // Sorts the array containing the summed up cases by `Meldedatum`
  reportArr.sort((a, b) => b.Meldedatum - a.Meldedatum)
  return reportArr;
}


function visualiseChart(data) {
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    c = d.getElementById('chartContainer'),
    x = c.innerWidth || e.clientWidth || g.clientWidth,
    y = c.innerHeight|| e.clientHeight|| g.clientHeight;

  var margin = {top:10, right: 30, bottom: 60, left: 60},
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  
  var svg = d3.select("#visualisationContainer")
          .append("div")
          .classed("svg-container", true) 
          .append("svg")
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", "0 0 600 400")
          .classed("svg-content-responsive", true)
          // .attr("width", width + margin.left + margin.right)
          // .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

              

             


  /** The next 7 lines initialize and format the labels of the xAxis nicely.    
    If there are too less dates will be repeated on the x-axis. To avoid that we have to create a function 
    for that edge case and work with xa.tickValues to set the labels manually.
    xA.tickValues([new Date(data[0].Meldedatum), new Date(data[1].Meldedatum), new Date(data[2].Meldedatum)])
  */
  const xAxis = d3.scaleTime()
                  .domain(d3.extent(data, item => new Date(item.Meldedatum)))
                  .range([0, width]);
  const xA = d3.axisBottom(xAxis);
  xA.tickSizeOuter(0); // removes the last tick on the xAxis
  const parseDate = d3.timeFormat("%B %d, %Y") //https://d3-wiki.readthedocs.io/zh_CN/master/Time-Scales/
  xA.tickFormat(d => parseDate(d));
 
  // Appends the xAxis
  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xA)
      .selectAll("text")
      .attr("transform", "rotate(330)") //rotates the labels of the x axis by 
      .style("text-anchor", "end"); //makes sure that the end of the text string is anchored to the ticks

  // Initializes and formats the yAxis
  const yAxis = d3.scaleLinear()
      .domain([0, d3.max(data, item => item.Infos.AnzahlFall)])
      .range([height, 0])
      .nice(); //without that the highest tick of the y axis wouldn't be labelled
  
  // Appends the yAxis
  svg.append("g")
      .call(d3.axisLeft(yAxis));

  const curve = svg.append("path")
                  .datum(data)
                  .attr("fill", "none")
                  .attr("stroke", "turquoise")
                  .attr("stroke-width", 1)
                  .attr("d", d3.line()
                      .x(item => xAxis(new Date(item.Meldedatum)))
                      .y(item => yAxis(new Date(item.Infos.AnzahlFall)))
                  );

  /** Selects all the labels on the xAxis. 
    The cursor becomes a pointer when moving the mouse over the xAxis labels.
    When clicking on one label the function `appendVerticalLine` is being called 
    and the selected `date` set so it can be exported. (See top of this file)
  */
  const labels = d3.selectAll('g.tick') 
  
  labels.on("mouseover", (mouseEvent) => {
    d3.select(mouseEvent.target).style("cursor", "pointer"); 
  });
  labels.on("click", (mouseEvent, date) => {
    appendVerticalLine(svg, xAxis, date, height)
    exportDate = date;
  })  
}

// Appends a vertical line at the selected date
function appendVerticalLine(svg, xAxis, date, height){
  d3.select(".caseLine").remove(); //removes existing vertical line

  svg.append("line")
    .attr("class", "caseLine")
    .attr("x1", xAxis(date))  
    .attr("y1", 0)
    .attr("x2", xAxis(date))  
    .attr("y2", height)
    .style("stroke-width", 1)
    .style("stroke", "darkblue")
    .style("fill", "none");
}