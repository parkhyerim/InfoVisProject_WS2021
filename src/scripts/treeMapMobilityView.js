
// Get Information of selected regions and month from main.js(From Landkarte and DatePicker)
export function UpdateSelectedRegionsList(regionParam, regionSelected, monthParam, monthChanged){
     console.log(regionParam, regionSelected, monthParam, monthChanged)
     let month =  monthParam[0].substr((monthParam[0].indexOf("-")+1), 2); // get only month string(ex. "03")
     let regionEng = ReplaceRegionNameWithEng(regionParam); // replace the German region name with the English one
     let newRegionAdded = regionSelected;
     let newMonthSelected = monthChanged;
 
     // Update array when new region is selected or deselected
     if(newRegionAdded){ 
         CreateMobilityData(regionEng, month, newRegionAdded, newMonthSelected)
     } else {
         // if the region is deselected´
         CreateArrayForTreemap([], regionEng, month, newRegionAdded, newMonthSelected)
     }
 }
 
 
 // Create filtered data according to the region and the month selected
 function CreateMobilityData(regionParam, monthParam, regionSelected, monthChanged){
     let mobilityData = [];
  
    // Filter data only for Germany and the selected region and month only
     d3.csv('../src/data/applemobilitytrends.csv').then(function(data){
         data.filter(function(element){
             if (element.country == "Germany" 
                 && element["sub-region"] == "" 
                 &&  element["region"] == regionParam){ 
                 mobilityData.push(element);  // Create a new dataset(array) that only contains data for Germany 
             }
         })
 
         /**
          * To calculate the monthly average
          */
         // 1. Create a nested array 
         let nestedData = d3.group(mobilityData,  d => d.region, d => d.transportation_type)
         // 2. nested array over and over to get data by type of transport
         let dataByRegion = nestedData.get(regionParam)
         let dataByDriving = dataByRegion.get("driving")
         let dataByWalking = dataByRegion.get("walking")
         let dataByTransit = dataByRegion.get("transit")
 
         // Calculate the monthly average for each means of transport separately
         if(dataByDriving) CalculateMonthlyAverage(dataByDriving) 
         if(dataByWalking) CalculateMonthlyAverage(dataByWalking)
         if(dataByTransit) CalculateMonthlyAverage(dataByTransit)
         
         CreateArrayForTreemap(mobilityData, regionParam, monthParam, regionSelected, monthChanged)
     }); 
 };
 
 
 let selectedRegionsData = [];
 let regNameList = [];
 // Create Array to send to visualize the treemap
 function CreateArrayForTreemap(data, regionParam, monthPram, regionSelected, monthChanged){
     let region = regionParam;
     
     if(!monthChanged){
         if(regionSelected){
             regNameList.push(region)
             selectedRegionsData.push(data);
         } else { 
            let index = regNameList.findIndex(element => element == region)
            regNameList.splice(index, 1)
            selectedRegionsData.splice(index, 1)
         }
     } 
     // console.log(regNameList)
     // console.log(selectedRegionsData)
 
     HierarchyTreemapData(selectedRegionsData, monthPram)
 }
 
 
 function HierarchyTreemapData(data, month){
     let groupArray = [];
 
     data.forEach(region => {
         let regionArray = [];
         region.forEach(transportType => {
             regionArray.push(transportType);
         })
         groupArray.push({ "children": regionArray}) 
     })
 
     const groupedData = { "children": groupArray }
 
     //Transform the data grouped by "Germany" into a hiearchy by usind d3.js hierachy (first param is root, second param is child nodes)
     let hgroup = d3.hierarchy(groupedData, d =>  d.children )
         .sum((d) => {return d[month]});
         
         createTreeChart(hgroup, month); 
 };
 
 
 
 function createTreeChart(hgroup, month){
     // Old treemap gets removed
     d3.select("#treemap2").select("svg").remove();
 
     var margin = {top: 10, right: 10, bottom: 10, left: 10};
     var width = 400;
     var height = 400;
 
     var svg = d3.select("#treemap2")
     .append("svg")
     .attr("width", width + 20)
     .attr("height", height)
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
     // Then d3.treemap computes the position of each element of the hierarchy
     // The coordinates are added to the root object above
    const treemap= d3.treemap()
        .size([width, height])
        .padding(2)
        .paddingInner(2)
        .round(true)
        (hgroup)
 
     // color options
     var color= d3.scale.linear().domain([60, 200]).range(["orange", "indianred"]);
     var color1 = d3.scale.category10();
     var color2 = d3.scale.category20();         
     var color3 = d3.scale.category20b();  
     var color4 = d3.scale.category20c();  
   //  var color5 = d3.scaleOrdinal().domain(["1","2","3"]).range([ "#402D54", "#D18975", "#8FD175"])
 
 
     // Add a opacity scale
     var opacity =d3.scaleLinear()
                 .domain([90, 200])
                 .range([.6,1])
 
     // use this information to add rectangles:
     svg
         .selectAll("rect")
         .data(treemap.leaves())
         .enter()
         .append("rect")
         .attr("id", (d) =>{return d.id;})
         .attr('x', function (d) { return d.x0; })
         .attr('y', function (d) { return d.y0})
         .attr('width', function (d) { return d.x1 - d.x0; })
         .attr('height', function (d) { return d.y1 - d.y0})
         .style("fill", function(d) {
             return color2(d.data[month]);})
         // .style("opacity", function(d) {
         //     return opacity(d.data[month])
         // });
 
         
     // and to add the text labelsd
     svg
     .selectAll("text")
     .data(treemap.leaves())
     .enter()
     .append("text")
     .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
     .attr("y", function(d){ return d.y0+30})    // +20 to adjust position (lower)
     .attr("dy", "1.1em")
     .text(function(d){ 
         // Temporal: kurze Syntax und bessere Images
         if(d.data.transportation_type === "driving"){
              return "🚘 " + d.data.region + ' ' +d.data.transportation_type +" "+ d.data[month]+"%"; }
         else if(d.data.transportation_type === "walking"){
             return "🚶‍♀️ " + d.data.region + ' ' + d.data.transportation_type +" "+ d.data[month]+"%";
         } else if(d.data.transportation_type === "transit") {
             return "🚌 "+ d.data.region + ' ' + d.data.transportation_type + " "+ d.data[month]+"%";
         }})
     .attr("font-size", "14px")
     .attr("fill", "white")
     .attr("font-weight","bold")
 }
 
 
 // Calculate the monthly average separately for the means of transportation 
 function CalculateMonthlyAverage(data){
     let monthName = "";  // to use for calculating of monthly average value
     var janSum, febSum, marSum, aprSum, maySum, junSum, julSum, augSum, sepSum, octSum, novSum, decSum;
     janSum = febSum = marSum = aprSum = maySum = junSum = julSum = augSum = sepSum = octSum = novSum = decSum = 0; // variable for each monthly total
     var janAvg, febAvg, marAvg, aprAvg, mayAvg, junAvg, julAvg, augAvg, sepAvg, octAvg, novAvg, decAvg;
     janAvg = febAvg = marAvg = aprAvg = mayAvg = junAvg = julAvg = augAvg = sepAvg = octAvg = novAvg = decAvg = 0; // variable for each monthly average
     let counter = 0; // count only the day that has a valid value 
     let month, day = "";
 
     for (let m=1; m<13; m++){ // loop over months
         if (m<10) month="0"+m;
         else month=m.toString();
        // console.log(month)
 
         for (let d=1; d<32; d++){  // loop over days
             if(monthName == "" || monthName != month){  // first calculation of the average or calculation of the new month
                 monthName = month;
                 counter = 0;
                // console.log("monthname: " + monthname + "monthtype:" + typeof(month) + " counter: " + counter)
             } 
 
             if (d<10) day="0"+d; 
             else day=d;
 
             let ymd = "2020-"+month+"-"+day;  // ymd : year-month-day
             
             data.forEach(function(element){
                 if(element[ymd] == undefined || element[ymd] == "" || element[ymd] == null ){
                     // set 0 for undefined value 
                     element[ymd] = 0           
                 }else{
                     counter++  
 
                     switch(month){
                         case "01":
                             janSum += parseFloat(element[ymd])
                             janAvg = janSum/counter
                            // console.log(month + " " + typeof(month))
                             element[month] = janAvg.toFixed(2)
                             //console.log(ymd + " " + "sum: " + parseFloat(janSum) + " counter: " + counter + " result: " + janResult)
                             break;
                         case "02":
                             febSum += parseFloat(element[ymd])
                             febAvg = febSum /counter
                             element[month] = febAvg.toFixed(2)
                            // console.log(ymd + " " + "sum: " + parseFloat(febSum)  + " counter: " + counter + " result: " + febAvg)
                             break;
                         case "03":
                             marSum += parseFloat(element[ymd])
                             marAvg = marSum /counter
                             element[month] = marAvg.toFixed(2)
                            // console.log(ymd + " " + "sum: " + parseFloat(marSum)  + " counter: " + counter + " result: " + marAvg)
                             break;
                         case "04":
                             aprSum += parseFloat(element[ymd])
                             aprAvg = aprSum /counter
                             element[month] = aprAvg.toFixed(2)
                            // console.log(ymd + " " + "sum: " + parseFloat(aprSum)  + " counter: " + counter + " result: " + aprAvg)
                             break;
                         case "05":
                             maySum += parseFloat(element[ymd])
                             mayAvg = maySum /counter
                             element[month] = mayAvg.toFixed(2)
                           //  console.log(ymd + " " + "sum: " + parseFloat(maySum)  + " counter: " + counter + " result: " + mayAvg)
                             break;
                         case "06":
                             junSum += parseFloat(element[ymd])
                             junAvg = junSum /counter
                             element[month] = junAvg.toFixed(2)
                           //  console.log(ymd + " " + "sum: " + parseFloat(junSum)  + " counter: " + counter + " result: " + junAvg)
                             break;
                         case "07":
                             julSum += parseFloat(element[ymd])
                             julAvg = julSum /counter
                             element[month] = julAvg.toFixed(2)
                           //  console.log(ymd + " " + "sum: " + parseFloat(julSum)  + " counter: " + counter + " result: " + julAvg)
                             break;
                         case "08":
                             augSum += parseFloat(element[ymd])
                             augAvg = augSum /counter
                             element[month] = augAvg.toFixed(2)
                           //  console.log(ymd + " " + "sum: " + parseFloat(augSum)  + " counter: " + counter + " result: " + augAvg)
                             break;
                         case "09":
                             sepSum += parseFloat(element[ymd])
                             sepAvg = sepSum /counter
                             element[month] = sepAvg.toFixed(2)
                          ///   console.log(ymd + " " + "sum: " + parseFloat(sepSum)  + " counter: " + counter + " result: " + sepAvg)
                             break;
                         case "10":    
                             octSum += parseFloat(element[ymd])
                             octAvg = octSum /counter
                             element[month] = octAvg.toFixed(2)
                            // console.log(ymd + " " + "sum: " + parseFloat(octSum)  + " counter: " + counter + " result: " + octAvg)
                             break;
                         case "11":
                             novSum += parseFloat(element[ymd])
                             novAvg = novSum /counter
                             element[month] = novAvg.toFixed(2)
                           //  console.log(ymd + " " + "sum: " + parseFloat(novSum)  + " counter: " + counter + " result: " + novAvg)
                             break;
                         case "12":
                             decSum += parseFloat(element[ymd])
                             decAvg = decSum /counter
                             element[month] = decAvg.toFixed(2)
                           //  console.log(ymd + " " + "sum: " + parseFloat(decSum)  + " counter: " + counter + " result: " + decAvg)
                             break;
                         default:
                     }
                 }
             });
         }}
     }
 
 
     function ReplaceRegionNameWithEng(regionParam){
         switch (regionParam) {
             case "Bayern":
               return "Bavaria"
             case "Hessen":
               return "Hesse"
             case "Niedersachsen":
               return "Lower Saxony"
             case "Nordrhein-Westfalen":
                 return "North Rhine-Westphalia"
             case "Bremen":
                 return "Bremen (state)"
             case "Rheinland-Pfalz":
                 return "Rhineland-Palatinate"
             case "Sachsen":
                 return "Saxony"
             case "Sachsen-Anhalt":
                 return "Saxony-Anhalt"
             case "Thüringen":
              return "Thuringia"
             default:   
              return regionParam
         }
     }
     