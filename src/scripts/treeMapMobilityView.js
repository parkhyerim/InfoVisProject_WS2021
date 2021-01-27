let selectedBundesland;

let clickedBlArray =[];

let newRegionAdded;

// Get Information of selected regions and month from main.js(From Landkarte and DatePicker)
export function UpdateSelectedRegionsList(regionParam, regionSelected, monthParam, monthChanged, selectedBL){
    selectedBundesland = selectedBL;

    let month =  monthParam[0].substr((monthParam[0].indexOf("-")+1), 2); // get only month string(ex. "03")
     let regionEng = regionParam;
     //ReplaceRegionNameWithEng(regionParam); // replace the German region name with the English one
     newRegionAdded = regionSelected;
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
     d3.csv('../src/data/Apple_mobility_shortened_german.csv').then(function(data){
         data.filter(function(element){
             if (element.country == "Germany" 
                 && element["sub-region"] == "" 
                 &&  element["region"] == regionParam){ 
                 mobilityData.push(element);  // Create a new dataset(array) that only contains data for Germany 
             }
         })
 
         //To calculate the monthly average:
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
 
     HierarchyTreemapData(selectedRegionsData, monthPram)
 }
 
 function HierarchyTreemapData(data, month){
    clickedBlArray=[];
     data.forEach((d) =>{
        clickedBlArray.push(d[0].region);
     })
    
     let groupArray = [];
     let selectedNumber = data.length;
 
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
         
         createTreeChart(hgroup, month, selectedNumber); 
 };
 function createTreeChart(hgroup, month){
     // Old treemap gets removed
     d3.select("#treemap2").select("svg").remove();
 
     var margin = {top: 10, right: 10, bottom: 10, left: 10};
     var width = 700; 
     var height = 450; 
 
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

   

         
 
     // Add a opacity scale
     var opacity =d3.scaleLinear()
                 .domain([90, 200])
                 .range([1,3])

 
     // use this information to add rectangles:
     svg
         .selectAll("rect")
         .data(treemap.leaves())
         .enter()
         .append("rect")
         .attr("id", (d) =>{return d.id;})
         .attr("class", (d) =>{return d.data.region;})
         .attr('x', function (d) { return d.x0; })
         .attr('y', function (d) { return d.y0})
         .attr('width', function (d) { return d.x1 - d.x0; })
         .attr('height', function (d) { return d.y1 - d.y0})
         .style("fill", function(d){ 
            let chosenColor;

            clickedBlArray.forEach(bundesland => {
                if(d.data.region == bundesland){
                    const usedColor = d3.select("."+bundesland+".map")._groups[0][0].getAttribute('fill');
                   chosenColor = usedColor;
                }

              })


              return d3.color(chosenColor)
            })
         .style("opacity", function(d) {
            
             return opacity(d.data[month])
         });
 
    //add the icons 
    svg
    .selectAll("image")
    .data(treemap.leaves())
    .enter()
    .append('image')
    .attr('xlink:href', function(d){ 
        // Temporal: kurze Syntax und bessere Images
        if(d.data.transportation_type === "driving"){
               return './img/icon_driving.png' }
        else if(d.data.transportation_type === "walking"){
               return './img/icon_walking.png';
        } else if(d.data.transportation_type === "transit") {
               return  './img/icon_transit.png';
        }})
    .attr('class', 'icon')
    .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
    .attr("y", function(d){ return d.y0+30}) 
    .attr('width', 40)
    .attr('height', 40)

     //add the text labels
     svg
     .selectAll("text")
     .data(treemap.leaves())
     .enter()
     .append("text")
     .attr("x", function(d){ return d.x0+15})    // +10 to adjust position (more right)
     .attr("y", function(d){ return d.y0+70})    // +20 to adjust position (lower)
     .attr("dy", "1.1em")
     .text(function(d){ 
         // Temporal: kurze Syntax und bessere Images
         if(d.data.transportation_type === "driving"){
                return " "+ d.data[month]+"%"; }
         else if(d.data.transportation_type === "walking"){
                return " "+ d.data[month]+"%";
         } else if(d.data.transportation_type === "transit") {
                return   " "+ d.data[month]+"%";
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
 
 

     