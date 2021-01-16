let svg, xAxis, yAxis, currentDomain;
const blDomainStorage = [];

const margin = {top:10, right: 30, bottom: 60, left: 60},
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

/** Saves the checked Bundesländer to the array `blDomainStorage` 
  and visualises the chosen Bundesland.
*/
export function VisualiseChosenBL(BLToBeVisualized, newBLWasSelected, selectedMonth){ 
    
  let foundBL = false;
  blDomainStorage.forEach(arr => {
    if(BLToBeVisualized == arr[0]) foundBL = true;
  })
  
  // Checks if Bundesland is newly checked or if it already exists in blDomainStorage
  if(foundBL == false){

    // Fetching the data of the newly selected Bundesland
    fetchData(BLToBeVisualized, selectedMonth).then((data) => {

      // To figure out the max y-value which is necessary to correctly display the data
      const neededYValue = d3.scaleLinear().domain([0, d3.max(data, item => item.Infos.AnzahlFall)])

      /** Sorts the array in increasing order.
        The Bundesland with the smallest needed y-value comes first and the one with the highest comes last.
      */
      blDomainStorage.sort((a,b) => {
        return a[1] - b[1];
      })

      /** Checks whether the last Bundesland in `blDomainStorage` still obtains the highest needed
        y-value compared to the newly selected Bundesland. If the newly checked Bundesland has
        more Covid cases and therefore needs a higher y-value the current axes are removed 
        and the updated ones are added.
      */
      if(blDomainStorage.length == 0 || blDomainStorage[blDomainStorage.length-1][1] < neededYValue.domain()[1]){
        svg.select(".y-axis").remove(); // instead of deleting they should be updated,
        svg.select(".x-axis").remove(); // but that seems more complicated
        svg.select(".case-line").remove(); //removes existing vertical line
        addAxes(data);
      }
    
      // Stores the Bundesland and the highest y-value needed for that Bundesland
      blDomainStorage.push([data[0].Infos.Bundesland, neededYValue.domain()[1]]); 

      /** The curve of the newly selected Bundesland is added.
        `blClassN` is necessary to give each curve a distinguishable class name.
        It will be used to select the d3 element and then to update and delete it.
      */
      const blClassN = data[0].Infos.Bundesland;
      visualiseCurve(svg, data, xAxis, yAxis, blClassN, randomColor());
        
      // Circles of the already displayed Bundesländer are updated according to the new axis. 
      updateExistingCurvesCircles(blDomainStorage);
    })    
  } 
  // If the selection of a Bundesland is revoked (by clicking on the map again), but it is still found in `blDomainStorage`
  else if(newBLWasSelected === false && foundBL == true) { 

      // Removes the curve and circles of the recently unselected Bundesland.
      svg.select(".curve."+BLToBeVisualized).remove();
      svg.selectAll(".circles."+BLToBeVisualized).remove();

     /** Sorts the array in increasing order.
        The Bundesland with the smallest needed y-value comes first and the one with the 
        highest comes last.
      */
      blDomainStorage.sort((a,b) => {
        return a[1] - b[1];
      })

      // Removes the recently unselected Bundesland from `blDomainStorage`
      blDomainStorage.forEach((arr, i) => {
        if(arr[0] == BLToBeVisualized) {
         blDomainStorage.splice(i,1)
        }
      })

      /** Updates the axes, the existing curves and circles if the highest needed y-value 
        has changed after unselecting a Bundesland
      */
      if(yAxis.domain()[1] > blDomainStorage[blDomainStorage.length-1][1]){
        fetchData(blDomainStorage[blDomainStorage.length-1][0], selectedMonth).then((data) => {
          svg.select(".y-axis").remove(); 
          svg.select(".x-axis").remove(); 
          svg.select(".case-line").remove(); //removes existing vertical line

          addAxes(data)
          updateExistingCurvesCircles(blDomainStorage);            
        }) 
      } 
    }

    else if(selectedMonth){

    blDomainStorage.sort((a,b) => {
        return a[1] - b[1];
    })

    // Fetching the data of the newly selected Bundesland
    fetchData(BLToBeVisualized, selectedMonth).then((data) => {

      // To figure out the max y-value which is necessary to correctly display the data
      const neededYValue = d3.scaleLinear().domain([0, d3.max(data, item => item.Infos.AnzahlFall)])

      // Removes the Bundesland from `blDomainStorage` if it already exists
      blDomainStorage.forEach((arr, i) => {
        if(BLToBeVisualized == arr[0]){
          blDomainStorage.splice(i, 1)
          // Removes the curve and circles of the recently unselected Bundesland.
          svg.select(".curve."+arr[0]).remove();
          svg.selectAll(".circles."+arr[0]).remove();
        }
      })


      // Stores the Bundesland and the highest y-value needed for that Bundesland
     blDomainStorage.push([data[0].Infos.Bundesland, neededYValue.domain()[1]]);

      /** Sorts the array in increasing order.
        The Bundesland with the smallest needed y-value comes first and the one with the highest comes last.
      */
      blDomainStorage.sort((a,b) => {
        return a[1] - b[1];
      })


      /** Checks whether the last Bundesland in `blDomainStorage` still obtains the highest needed
        y-value compared to the newly selected Bundesland. If the newly checked Bundesland has
        more Covid cases and therefore needs a higher y-value the current axes are removed 
        and the updated ones are added.
      **/
      if(currentDomain > blDomainStorage[blDomainStorage.length-1][1]){
        svg.select(".y-axis").remove(); // instead of deleting they should be updated,
        svg.select(".x-axis").remove(); // but that seems more complicated
        svg.select(".case-line").remove(); //removes existing vertical line
        addAxes(data);
      }

      if(currentDomain < blDomainStorage[blDomainStorage.length-1][1]){
        svg.select(".y-axis").remove(); // instead of deleting they should be updated,
        svg.select(".x-axis").remove(); // but that seems more complicated
        svg.select(".case-line").remove(); //removes existing vertical line
        addAxes(data);
      }

      /** The curve of the newly selected Bundesland is added.
        `blClassN` is necessary to give each curve a distinguishable class name.
        It will be used to select the d3 element and then to update and delete it.
      */
      const blClassN = data[0].Infos.Bundesland
      visualiseCurve(svg, data, xAxis, yAxis, blClassN, randomColor());
        
      // Circles of the already displayed Bundesländer are updated according to the new axis. 
      updateExistingCurvesCircles(blDomainStorage);
    })
  } 

  
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


function fetchData(bundesland, selectedMonth){
    return fetch(
      `https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=Meldedatum%20%3E%3D%20TIMESTAMP%20%27${selectedMonth[0]}%2000%3A00%3A00%27%20AND%20Meldedatum%20%3C%3D%20TIMESTAMP%20%27${selectedMonth[1]}%2000%3A00%3A00%27%20AND%20Bundesland%20%3D%20%27${bundesland}%27&outFields=Bundesland,AnzahlFall,Meldedatum,IdBundesland&outSR=4326&f=json`,
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
            return groupDataByDate(casesData)
        });
};

  
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
  const parseDate = d3.timeFormat("%B %d, %Y") //https://d3-wiki.readthedocs.io/zh_CN/master/Time-Scales/
  xA.tickFormat(d => parseDate(d));
 
  // Appends the xAxis
  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .attr("class", "x-axis")
      .call(xA)
      .selectAll("text")
      .attr("transform", "rotate(330)") //rotates the labels of the x axis by 
      .style("text-anchor", "end"); //makes sure that the end of the text string is anchored to the ticks

  // Initializes and formats the yAxis
  yAxis = d3.scaleLinear()
      .domain([0, d3.max(data, item => item.Infos.AnzahlFall)])
      .range([height, 0])
      .nice(); //without that the highest tick of the y axis wouldn't be labelled
  
  // Appends the yAxis
  svg.append("g")
      .call(d3.axisLeft(yAxis))
      .attr("class", "y-axis"); // Class added to be able to remove the axis;

  const domain = d3.scaleLinear().domain([0, d3.max(data, item => item.Infos.AnzahlFall)])
  currentDomain = domain.domain()[1]
}


function visualiseCurve(svg, formattedData, xAxis, yAxis, classN, color){
  svg.append("path")
    .datum(formattedData)
    .attr("fill", "none")
    .attr("id", classN+"-curve")
    .attr("stroke", color)
    .attr("stroke-width", 1)
    .attr("class", "curve" + " " + classN) //necessary to add a specific class for every Bundesland shown
    .attr("d", d3.line()
        .x(item => xAxis(new Date(item.Meldedatum)))
        .y(item => yAxis(new Date(item.Infos.AnzahlFall)))
    );
  
  const parseDate = d3.timeFormat("%B %d, %Y")
  // Appends name of the Bundesland to the corresponding path
  svg.append("text")
     .datum(formattedData)
    .attr("transform", item => {
      var xpos = xAxis(new Date(item[item.length-1].Meldedatum)) -20 ;
      return "translate(" + xpos + "," + yAxis(item[item.length-1].Infos.AnzahlFall) + ")";
  })
  .attr("x", 15)
  .attr("dy", ".35em")
  .attr("class", "segmentText")
  .text(formattedData[0].Infos.Bundesland);

  // Appends circles to the path at the dates where data is returned
  svg.selectAll("circles")
      .data(formattedData)
      .enter()
      .append("circle")
        .attr("class", "circles" + " " + classN)
        .attr("fill", "darkblue")
        .attr("stroke", "none")
        .attr("cx", item => xAxis(new Date(item.Meldedatum)))
        .attr("cy", item => yAxis(new Date(item.Infos.AnzahlFall)))
        .attr("r", 2)


  

}

function updateExistingCurvesCircles(storageArray){
  storageArray.forEach((arr) => {
    svg.select(".curve."+ arr[0])
      .attr("d", d3.line()
      .x(item => xAxis(new Date(item.Meldedatum)))
      .y(item => yAxis(new Date(item.Infos.AnzahlFall)))
    );

    svg.selectAll(".circles."+ arr[0])
      .attr("cx", item => xAxis(new Date(item.Meldedatum)))
      .attr("cy", item => yAxis(new Date(item.Infos.AnzahlFall))
    );
  })
}

function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// var seriesColors = ["#14558f", "#43956f", "#f6c51b", "#535353", "#9C27B0"];
// var seriesColors1 = ["#1A237E", "#1976D2", "#26C6DA", "#43956f", "#9CCC65"];
// var seriesColors2 = ["#03A9F4", "#4CAF50", "#FFC107", "#FF5722", "#607D8B"];

//   var color = d3.scale.ordinal()
//               .range(seriesColors); 

// var Data = [
//       {
//           "name": "INFOSYS",
//           "WeeklyData": [
//               { "week": "06 Apr 2015", "value": 1120 },
//               { "week": "13 Apr 2015", "value": 1240 },
//               { "week": "20 Apr 2015", "value": 1400 },
//               { "week": "27 Apr 2015", "value": 1500 }
//           ]
//       },
//       {
//           "name": "GOOGLE",
//           "WeeklyData": [
//               { "week": "06 Apr 2015", "value": 1220 },
//               { "week": "13 Apr 2015", "value": 1500 },
//               { "week": "20 Apr 2015", "value": 1610 },
//               { "week": "27 Apr 2015", "value": 1700 }
//           ]
//       },
//       {
//           "name": "HCL",
//           "WeeklyData": [
//               { "week": "06 Apr 2015", "value": 1020 },
//               { "week": "13 Apr 2015", "value": 1350 },
//               { "week": "20 Apr 2015", "value": 1160 },
//               { "week": "27 Apr 2015", "value": 1300 }
//           ]
//       },
//       {
//           "name": "TCS",
//           "WeeklyData": [
//               { "week": "06 Apr 2015", "value": 1320 },
//               { "week": "13 Apr 2015", "value": 1280 },
//               { "week": "20 Apr 2015", "value": 1530 },
//               { "week": "27 Apr 2015", "value": 1600 }
//           ]
//       },
//       {
//           "name": "MICROSOFT",
//           "WeeklyData": [
//               { "week": "06 Apr 2015", "value": 1600 },
//               { "week": "13 Apr 2015", "value": 1450 },
//               { "week": "20 Apr 2015", "value": 1640 },
//               { "week": "27 Apr 2015", "value": 1750 }
//           ]
//       }
//   ];

// function fnDrawMultiLineChart(Data, DivID, RevenueName) {
//   var margin = { top: 20, right: 80, bottom: 30, left: 50 },
//    width = 600 - margin.left - margin.right,
//    height = 300 - margin.top - margin.bottom;

//   var parseDate = d3.time.format("%d-%b");

//   var x = d3.scale.ordinal()
//           .rangeRoundBands([0, width]);

//   var y = d3.scale.linear()
//           .range([height, 0]);




//   var xAxis = d3.svg.axis()
//       .scale(x)
//       .orient("bottom");

//   var yAxis = d3.svg.axis()
//       .scale(y)
//       .orient("left")
//       .ticks(10);

//   // xData gives an array of distinct 'Weeks' for which trends chart is going to be made.
//   var xData = Data[0].WeeklyData.map(function (d) { return parseDate(new Date(d.week)); });
//   //console.log(xData);

//   var line = d3.svg.line()
//       //.interpolate("basis")
//       .x(function (d) { return x(parseDate(new Date(d.week))) + x.rangeBand() / 2; })
//       .y(function (d) { return y(d.value); });

//   var svg = d3.select("#" + DivID).append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   color.domain(Data.map(function (d) { return d.name; }));

//   x.domain(xData);

//   var valueMax = d3.max(Data, function (r) { return d3.max(r.WeeklyData, function (d) { return d.value; }) });
//   var valueMin = d3.min(Data, function (r) { return d3.min(r.WeeklyData, function (d) { return d.value; }) });
//   y.domain([valueMin, valueMax]);

//   //Drawing X Axis
//   svg.append("g")
//           .attr("class", "x axis")
//           .attr("transform", "translate(0," + height + ")")
//           .call(xAxis);

//   // Drawing Horizontal grid lines.
//   svg.append("g")
//       .attr("class", "GridX")
//     .selectAll("line.grid").data(y.ticks()).enter()
//       .append("line")
//       .attr(
//       {
//           "class": "grid",
//           "x1": x(xData[0]),
//           "x2": x(xData[xData.length - 1]) + x.rangeBand() / 2,
//           "y1": function (d) { return y(d); },
//           "y2": function (d) { return y(d); }
//       });
//   // Drawing Y Axis
//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//       .append("text")
//           .attr("transform", "rotate(-90)")
//           .attr("y", 6)
//           .attr("dy", ".71em")
//           .style("text-anchor", "end")
//           //.text(RevenueName);

//   // Drawing Lines for each segments
//   var segment = svg.selectAll(".segment")
//                   .data(Data)
//                   .enter().append("g")
//                   .attr("class", "segment");

//   segment.append("path")
//           .attr("class", "line")
//           .attr("id", function (d) { return d.name; })
//           .attr("visible",1)
//           .attr("d", function (d) { return line(d.WeeklyData); })
//           .style("stroke", function (d) { return color(d.name); });
//               // Creating Dots on line
//   segment.selectAll("dot")
//           .data(function (d) { return d.WeeklyData; })
//           .enter().append("circle")
//           .attr("r", 5)
//           .attr("cx", function (d) { return x(parseDate(new Date(d.week))) + x.rangeBand() / 2; })
//           .attr("cy", function (d) { return y(d.value); })
//           .style("stroke", "white")
//           .style("fill", function (d) { return color(this.parentNode.__data__.name); })
//           .on("mouseover", mouseover)
//           .on("mousemove", function (d) {
//               divToolTip
//               .text(this.parentNode.__data__.name +" : "+ d.value)
//               .style("left", (d3.event.pageX + 15) + "px")
//               .style("top", (d3.event.pageY - 10) + "px");
//           })
//           .on("mouseout", mouseout);

//   segment.append("text")
//           .datum(function (d) { return { name: d.name, RevData: d.WeeklyData[d.WeeklyData.length - 1] }; })
//           .attr("transform", function (d) {
//               var xpos = x(parseDate(new Date(d.RevData.week))) + x.rangeBand() / 2;
//               return "translate(" + xpos + "," + y(d.RevData.value) + ")";
//           })
//           .attr("x", 15)
//           .attr("dy", ".35em")
//           .attr("class", "segmentText")
//           .attr("Segid", function (d) { return d.name; })
//           .text(function (d) { return color(d.name); });
                     
//   d3.selectAll(".segmentText").on("click", function (d) {
//       var tempId = d3.select(this).attr("Segid");
//       var flgVisible = d3.select("#" + tempId).attr("visible");

//       var newOpacity = flgVisible == 1 ? 0 : 1;
//       flgVisible = flgVisible == 1 ? 0 : 1;

//       // Hide or show the elements
//       d3.select("#" + tempId).style("opacity", newOpacity)
//           .attr("visible", flgVisible);

//   });
//    // Adding Tooltip
//   var divToolTip = d3.select("body").append("div")
//               .attr("class", "tooltip")
//               .style("opacity", 1e-6);

//   function mouseover() {
//       divToolTip.transition()
//           .duration(500)
//           .style("opacity", 1);
//   }
//   function mouseout() {
//       divToolTip.transition()
//           .duration(500)
//           .style("opacity", 1e-6);
//   }
// }
// // Calling function
// fnDrawMultiLineChart(Data, "divChartTrends", "Revenue Data");
