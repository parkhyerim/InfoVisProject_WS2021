import { FetchData } from './getLineChartData.js';
import { gatheredMonthlyData } from '../data/gatheredMonthlyData.js';
let svg, xAxis, yAxis, currentDomain, clickedBar;
const blDomainStorage = [];

const margin = {top:40, right: 160, bottom: 80, left: 60},
  width = 1000 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

export async function ShowDEData(selectedMonth, allData){
    const month = new Date(selectedMonth[0]).getMonth();
    const casesDE = allData[month];

    removeDEData();
    /** Function should load the axis and the graph for DE when loading the page (default month)
    and when the month is updates
    */

    addAxes(casesDE)
  

    svg.selectAll(".bar")
      .data(casesDE)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", "#b2dfdb")
      .attr("x", d => xAxis(new Date(d.Meldedatum))-6)
      .attr("y", d => yAxis(new Date(d.Infos.AnzahlFall)))
      .attr("width", 15)
      .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
      .attr("height", d => height - yAxis(new Date(d.Infos.AnzahlFall)))
      .on("mouseover", mouseOverBar)
      .on("click", clickBar)

    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", () => {
         return `translate(0, ${height/2}) rotate(-90)`
      }) 
      .style("font-family", "Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
      .text("Gemeldete Infektionen");
   
}


function mouseOverBar(){
  d3.select(this)
    .style("cursor", "pointer")
}

function clickBar(){
  // Reset previously clicked bar
  if(clickedBar != undefined){
    clickedBar
      .attr("fill", "#b2dfdb")
      .classed("clicked-bar", false)
  }
  clickedBar = d3.select(this);
  clickedBar.classed("clicked-bar", true);

  d3.select(this)
    .attr("fill", "#008080"); 


  const cases = clickedBar._groups[0][0].__data__.Infos.AnzahlFall;

  svg.select(".gemeldete-infektionen").remove();
  svg.select(".cases-germany").remove(); 

  svg.append("text")
    .attr("text-anchor", "start")
    .attr("class", "gemeldete-infektionen")
    .attr("fill", "#008080")
    .style("font-weight", "bold")
    .attr("transform", `translate(${width+70}, ${30})`)
    .attr("x", 15)
    .attr("dy", ".35em")
    .style("font-family", "Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
    .text("Gemeldete Infektionen");

  // Appends the case number from the bar currently hoovered over
  svg.append("text")
    .attr("text-anchor", "start")
    .attr("class", "cases-germany")
    .attr("transform", `translate(${width+70}, ${50})`)
    .attr("x", 15)
    .attr("dy", ".35em")
    .style("font-family", "Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
    .text(cases);

  updateCaseNumbers();

}

function updateCaseNumbers(){

  if(clickedBar !== undefined){

    const clickedMeldedatum = clickedBar._groups[0][0].__data__.Meldedatum;

    const shownCurves = svg.selectAll(".curve.selected-curve")._groups[0]

    svg.selectAll(".case-numbers").remove(); 
    svg.select(".case-numbers-label").remove(); 
    
    if(shownCurves !== undefined){

      shownCurves.forEach((curve, i) => {
        const curveData = curve.__data__;
        const curveColor = curve.attributes[2].value;
        
        curveData.forEach((dates) => {
          if(dates.Meldedatum == clickedMeldedatum){
              // Appends the case number from the bar currently hoovered over
            svg.append("text")
              .attr("text-anchor", "start")
              .attr("fill", curveColor)
              .attr("class", "case-numbers " + dates.Infos.Bundesland)
              .attr("transform", `translate(${width+70}, ${(i*20)+80})`)
              .attr("x", 15)
              .attr("dy", ".35em")
              .style("font-family", "Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
              .text(dates.Infos.AnzahlFall);
          }
        })
      })
    }
  }
}

export function UpdateLineChartPathMonth(selectedMonth, selectedBL){

  selectedBL.forEach(bundesland => {
    const usedColor = d3.select("."+bundesland+".map")._groups[0][0].getAttribute('fill');
    RemoveBundeslandFromLineChart(bundesland, selectedBL) 
    AddBundeslandToLineChart(bundesland, selectedMonth, selectedBL, usedColor)
  })
}


export function AddBundeslandToLineChart(bundesland, selectedMonth, selectedBL, selectedColor){
  let month = Number(selectedMonth[0].substr((selectedMonth[0].indexOf("-")+1), 2));
  month.toString();
  const dataOfSelectedMonthBl = gatheredMonthlyData[month][bundesland];
  visualiseCurve(svg, dataOfSelectedMonthBl, bundesland, selectedColor);

  adjustLegend(selectedBL, bundesland);
  // Needed for intersection detection in lineChartView.js
  d3.select(".curve."+bundesland)._groups[0][0].classList.add('selected-curve');
  updateCaseNumbers(); 
   // If the internet connection is fast enough the data could be fetched live
  /*FetchData(bundesland, selectedMonth)
    .then((data) => {
      visualiseCurve(svg, data, bundesland, selectedColor); //"#D58E00"
    })
    .then(() => {
      adjustLegend(selectedBL, bundesland);
      // Needed for intersection detection in lineChartView.js
      d3.select(".curve."+bundesland)._groups[0][0].classList.add('selected-curve');
      updateCaseNumbers();   
    })  */  
}

export function RemoveBundeslandFromLineChart(bundesland, selectedBL){
  svg.select(".curve."+bundesland).remove();
  svg.selectAll(".circles."+bundesland).remove();
  adjustLegend(selectedBL, bundesland);
  updateCaseNumbers();
}

function adjustLegend(selectedBL, bl){

  svg.selectAll(".legend").remove();
  
  selectedBL.forEach((bundesland, i) => {
    const usedColor = d3.select("."+bundesland+".map")._groups[0][0].getAttribute('fill');

    const position1 = (width+margin.left)/4
  
    if(i === 0) {
      svg.append("text")
        .attr("class", "legend " + bundesland)
        .attr("text-anchor", "middle")
        .attr("fill", usedColor)
        .style("font-weight", "bold")
        .attr("transform", () => {
           return `translate(${position1}, ${height+margin.bottom-10})`
        }) 
        .style("font-family", "BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
        .text(bundesland);
    }

    if(i === 1) {
      svg.append("text")
        .attr("class", "legend " + bundesland)
        .attr("text-anchor", "middle")
        .attr("fill", usedColor)
        .style("font-weight", "bold")
        .attr("transform", () => {
           return `translate(${2*position1}, ${height+margin.bottom-10})`
        }) 
        .style("font-family", "BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
        .text(bundesland);
    }

    if(i === 2) {
      svg.append("text")
        .attr("class", "legend " + bundesland)
        .attr("text-anchor", "middle")
        .attr("fill", usedColor)
        .style("font-weight", "bold")
        .attr("transform", () => {
           return `translate(${3*position1}, ${height+margin.bottom-10})`
        }) 
        .style("font-family", "BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
        .text(bundesland);
    }  
  })
}


function visualiseCurve(svg, formattedData, classN, color){
  svg.append("path")
    .datum(formattedData)
    .attr("fill", "none")
    .attr("id", classN+"-curve")
    .attr("stroke", color)
    .attr("stroke-width", 2.5)
    .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
    .attr("class", "curve" + " " + classN) //necessary to add a specific class for every Bundesland shown
    .attr("d", d3.line()
        .x(item => xAxis(new Date(item.Meldedatum)))
        .y(item => yAxis(new Date(item.Infos.AnzahlFall)))
    );

  // Appends circles to the path at the dates where data is returned
  svg.selectAll("circles")
      .data(formattedData)
      .enter()
      .append("circle")
        .attr("class", "circles" + " " + classN)
        .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
        .attr("fill", color)
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
  svg.selectAll(".bar").remove();
  svg.selectAll(".y-label").remove();  
  svg.selectAll(".grid").remove();
  svg.selectAll(".case-numbers").remove(); 
  svg.select(".case-numbers-label").remove(); 
  svg.select(".gemeldete-infektionen").remove();
  svg.select(".cases-germany").remove(); 
}


export function InitializeSVG(){
  svg = d3.select("#lineChartContainer")
          .append("div")
          .classed("svg-container", true) 
          .append("svg")
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", "0 0 1100 400")
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
      .style("text-anchor", "end") //makes sure that the end of the text string is anchored to the ticks
      .style("font-family", "Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")

  /** Hides the last label, because that would display the next month which might be misleading.
    Makes sure that still all the data of the month is fetched.
  */    
  //const labelNodelist = svg.selectAll("text")._groups[0];
  //labelNodelist[labelNodelist.length-1].style.visibility = "hidden"

  // Initializes and formats the yAxis
  yAxis = d3.scaleLinear()
      .domain([0, d3.max(data, item => item.Infos.AnzahlFall)])
      .range([height, 0])
      .nice(); //without that the highest tick of the y axis wouldn't be labelled
  
  // Appends the yAxis
  svg.append("g")
      .call(d3.axisLeft(yAxis).tickSizeOuter(0))
      .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
      .attr("class", "y-axis") // Class added to be able to remove the axis;
      .attr("id", "y-axis")
      .call(g => g.select(".domain").remove());


  svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left}, 0)`) // moves y axis to the right
      .style("stroke-width", 0.8)
      .call(d3.axisLeft(yAxis)
              .tickSize(-width)
              .tickFormat("")
      );

  const domain = d3.scaleLinear().domain([0, d3.max(data, item => item.Infos.AnzahlFall)])
  currentDomain = domain.domain()[1]
}
