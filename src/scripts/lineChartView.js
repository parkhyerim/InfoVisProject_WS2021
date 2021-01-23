import { GetCasesDE, FetchData } from './getLineChartData.js';
let svg, xAxis, yAxis, currentDomain;
const blDomainStorage = [];

    
const margin = {top:10, right: 160, bottom: 80, left: 60},
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;



export async function ShowDEData(selectedMonth, allData){
    const month = new Date(selectedMonth[0]).getMonth();
    const casesDE = allData[month];

    removeDEData();
    /** Function should load the axis and the graph for DE when loading the page (default month)
    and when the month is updates
    */

    addAxes(casesDE)
  
    svg.append("path")
      .datum(casesDE)
      .attr("fill", "none")
      .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
      .attr("id", "DE-curve")
      //.attr("stroke", randomColor())
      //.attr("stroke-width", 1)
      .attr("class", "curve" + " " + "DE") //necessary to add a specific class for every Bundesland shown
      .attr("d", d3.line()
          .x(item => xAxis(new Date(item.Meldedatum)))
          .y(item => yAxis(new Date(item.Infos.AnzahlFall)))
      );

    let area = d3.area()
      .x(d => xAxis(new Date(d.Meldedatum)))
      .y0(d => height)
      .y1(d => yAxis(new Date(d.Infos.AnzahlFall)))

    svg.append("path")
      .datum(casesDE)
      .attr("fill", "#b2dfdb")
      .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
      .style("opacity", 0.6) // default is 1.0
      .attr("class", "area")
      .attr("d", area);


    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "start")
      .attr("transform", () => {
         return `translate(${width/2}, ${height+margin.bottom})`
      }) 
      .text("Meldedatum");
      /*.text("Gemeldete Fälle");
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .text("Meldedatum"); */


    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", () => {
         return `translate(0, ${height/2}) rotate(-90)`
      }) 
      .text("Gemeldete Fälle");

    /*svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "start")
      .attr("dy", "1.75em")
      .attr("dx", 8)
      .attr("transform", "rotate(-360)")
      .text("Fälle");*/

    /*
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Fallzahlen gesamt");
    */

  
    //document.getElementById("spinner").classList.remove("active");
 
}

export function UpdateLineChartPathMonth(bundesland, selectedMonth){

  RemoveBundeslandFromLineChart(bundesland)
  
  AddBundeslandToLineChart(bundesland, selectedMonth)
}


export function AddBundeslandToLineChart(bundesland, selectedMonth){

  // Fetching the data of the newly selected Bundesland
  FetchData(bundesland, selectedMonth).then((data) => {
    visualiseCurve(svg, data, bundesland, randomColor());
  })     
}

export function RemoveBundeslandFromLineChart(bundesland){
  svg.select(".curve."+bundesland).remove();
  svg.selectAll(".circles."+bundesland).remove();
  svg.select(".segment-text." +bundesland).remove();
}


function visualiseCurve(svg, formattedData, classN, color){
  svg.append("path")
    .datum(formattedData)
    .attr("fill", "none")
    .attr("id", classN+"-curve")
    .attr("stroke", color)
    .attr("stroke-width", 1)
    .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
    .attr("class", "curve" + " " + classN) //necessary to add a specific class for every Bundesland shown
    .attr("d", d3.line()
        .x(item => xAxis(new Date(item.Meldedatum)))
        .y(item => yAxis(new Date(item.Infos.AnzahlFall)))
    );

  // Appends name of the Bundesland to the corresponding path
  svg.append("text")
    .datum(formattedData)
    .attr("transform", item => {
      const xpos = xAxis(new Date(item[item.length-1].Meldedatum)) + 50;
      return `translate(${xpos}, ${yAxis(item[item.length-1].Infos.AnzahlFall)})`;
    })
    .attr("x", 15)
    .attr("dy", ".35em")
    .attr("class", "segment-text " + formattedData[0].Infos.Bundesland)
    .text(formattedData[0].Infos.Bundesland);

  // Appends name of the Bundesland to the corresponding path
  /*svg.append("text")
    .attr("x", 200) // move the text from the start of the path
    .attr("dy", -10) // move the text up
    .append("textPath")
      .attr("xlink:href","#"+classN+"-curve") // links the text to the element with the corresponding id, which was given to the path in the code block above
      .text(formattedData[0].Infos.Bundesland);*/

  // Appends circles to the path at the dates where data is returned
  svg.selectAll("circles")
      .data(formattedData)
      .enter()
      .append("circle")
        .attr("class", "circles" + " " + classN)
        .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
        .attr("fill", "darkblue")
        .attr("stroke", "none")
        .attr("cx", item => xAxis(new Date(item.Meldedatum)))
        .attr("cy", item => yAxis(new Date(item.Infos.AnzahlFall)))
        .attr("r", 2)
}

function removeDEData(){
  /** Is called whenever a new month is selected to update the data for whole DE
  */
  svg.select(".y-axis").remove(); 
  svg.select(".x-axis").remove();
  svg.select(".area").remove();
  svg.select(".DE").remove();
  svg.select(".x-label").remove();
  svg.selectAll(".y-label").remove();
  svg.selectAll(".curve").remove();
  svg.selectAll(".circles").remove();
  svg.selectAll(".grid").remove();
  svg.selectAll(".segment-text").remove();
}

 




export function InitializeSVG(){
  svg = d3.select("#lineChartContainer")
          .append("div")
          .classed("svg-container", true) 
          .append("svg")
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", "0 0 600 400")
          .classed("svg-content-responsive", true)
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);             
}




function addAxes(data){
  /** The next 7 lines initialize and format the labels of the xAxis nicely.    
    If there are too less dates will be repeated on the x-axis. To avoid that we have to create a function 
    for that edge case and work with xa.tickValues to set the labels manually.
    xA.tickValues([new Date(data[0].Meldedatum), new Date(data[1].Meldedatum), new Date(data[2].Meldedatum)])
  */
  xAxis = d3.scaleTime()
               .domain(d3.extent(data, item => new Date(item.Meldedatum)))
              .range([0, width]);
  const xA = d3.axisBottom(xAxis);
  xA.tickSizeOuter(0); // removes the last tick on the xAxis
  d3.timeFormatDefaultLocale({
      "decimal": ",",
      "thousands": ".",
      "grouping": [3],
      "currency": ["€", ""],
      "dateTime": "%a %b %e %X %Y",
      "date": "%d.%m.%Y",
      "time": "%H:%M:%S",
      "periods": ["AM", "PM"],
      "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
      "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      "shortMonths": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
  })
  const parseDate = d3.timeFormat("%d %B") // "%B %d, %Y" https://d3-wiki.readthedocs.io/zh_CN/master/Time-Scales/
  xA.tickFormat(d => parseDate(d));

  // Appends the xAxis
  svg.append("g")
      .attr("transform", `translate(${margin.left}, ${height})`) // moves x axis to the right
      .attr("class", "x-axis")
      .call(xA)
      .selectAll("text")
      .attr("transform", "rotate(330)") //rotates the labels of the x axis by 
      .style("text-anchor", "end"); //makes sure that the end of the text string is anchored to the ticks

  /** Hides the last label, because that would display the next month which might be misleading.
    Makes sure that still all the data of the month is fetched.
  */    
  const labelNodelist = svg.selectAll("text")._groups[0];
  labelNodelist[labelNodelist.length-1].style.visibility = "hidden"

  // Initializes and formats the yAxis
  yAxis = d3.scaleLinear()
      .domain([0, d3.max(data, item => item.Infos.AnzahlFall)])
      .range([height, 0])
      .nice(); //without that the highest tick of the y axis wouldn't be labelled
  
  // Appends the yAxis
  svg.append("g")
      .call(d3.axisLeft(yAxis))
      .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
      .attr("class", "y-axis"); // Class added to be able to remove the axis;

  svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
      .style("stroke-width", 0.6)
      .call(d3.axisLeft(yAxis)
              .tickSize(-width)
              .tickFormat("")
      );

  const domain = d3.scaleLinear().domain([0, d3.max(data, item => item.Infos.AnzahlFall)])
  currentDomain = domain.domain()[1]
}


function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}