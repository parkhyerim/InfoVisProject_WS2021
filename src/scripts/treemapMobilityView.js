// let counterRegion = 0; // number of selected regions
let regionNameList = [];
export function UpdateSelectedRegionsList(regionParam, isRegionSelected, monthParam, monthChanged){
   // Array or string (Array: select/unselect Regions, string: change Month)
   // -> monthChanged 
   // console.log(regionParam)
  // console.log(typeof regionParam == "string")
  // console.log(Array.isArray(regionParam))
  console.log(regionParam, isRegionSelected, monthParam, monthChanged)
  
  
//   let regionListlength;

//   //if(Array.isArray(regionParam)){  //  if(!newMonthSelected)
//   if(isRegionSelected){
//   regionListlength = regionParam.length;
//    for(var i = 0; i < regionListlength; i++){
//     //   console.log(regionParam[i])
    
//        let region = ReplaceRegionName(regionParam[i]);
//      //  console.log(regionNameList.includes(region))
//        if(!regionNameList.includes(region)){
//         regionNameList.push(region)
//        }
//        if(!isRegionSelected && regionNameList.includes(region) ){
//            let index = regionNameList.findIndex(element => element === region)
//          //  console.log("region" + region)
//          //  console.log("index: " + index)
//            regionNameList.splice(index, 1)
//          //  console.log(regionNameList)
//        }
    
//        if(!isRegionSelected){
//         regionNameList = [];
//     }
  
       
//        //let index = selectedRegionsList.findIndex(element => element["region"] == regionParam)
//     //     //     selectedRegionsList.splice(index, 1)

//     //   console.log(region)
//     //   console.log(regionNameList)
//      //  console.log(region)
//    //    const cretM = CreateMobilityData(region, month, newRegionAdded, newMonthSelected)
//       // console.log(cretM)
//    }
//   }
 


    //  if(isRegionSelected === undefined) isRegionSelected = true;
    let month =  monthParam[0].substr((monthParam[0].indexOf("-")+1), 2);
    let regionEng = ReplaceRegionName(regionParam); // replace the german region name to the english one
      // isSelected: true -> a new region selected, false -> a region unselecte
    let newRegionAdded = isRegionSelected;
    let newMonthSelected = monthChanged;

    if(newRegionAdded){
        CreateMobilityData(regionEng, month, newRegionAdded, newMonthSelected)
    }

    if(!newRegionAdded){
        CreateFinishedArray([], regionEng, month, newRegionAdded)
    }


   // console.log(regionNameList.includes(regionEng))
   
    if(newRegionAdded && !regionNameList.includes(regionEng)){
      //  regionNameList.push(regionEng)
      
    } else {
         // regionNameList.
    }
    //if(regionNameList != null)

   // CreateMobilityData(region, month, newRegionAdded, newMonthSelected); // params: region, month      
    // if(newRegionAdded){
    //     counterRegion++;
    //    // CreateMobilityData(region, month, isSelected); // params: region, month      
    // } else {
    //    counterRegion--;
    //   //  CreateMobilityData(region, month, isSelected); // params: region, month
    // }

  //  CreateMobilityData("Bavaria", "03", true, false)
   // CreateMobilityData("Berlin", "03", true, false)
}

let selectedRegionsList = [];
let currentMonth = "";
function CreateMobilityData(regionParam, monthParam, regionSelected, monthChanged){
    let mobilityGermanyData = [];
    console.log("selected Region: " + regionParam + " selected Month: " + monthParam + " nowAdded: " + regionSelected );
    currentMonth = monthParam;
    // if(monthChanged){
    //     // mobilityGermanyData = [];
    //     selectedRegionsList = [];
    //     // if(selectedRegionsList !== null){
    //     //     selectedRegionsList = [];
    //     // }
    //     // if(selectedRegionsList !== null){
    //     //     let index = selectedRegionsList.findIndex(element => element["region"] == regionParam)
    //     //     selectedRegionsList.splice(index, 1)
    //     //    // console.log(selectedRegionsList)
    //     // }
    // }

    // if(!regionSelected){
    //     if(selectedRegionsList !== null){
    //         console.log(selectedRegionsList)
    //         let index = selectedRegionsList.findIndex(element => element["region"] == regionParam)
    //         selectedRegionsList.splice(index, 1)
    //         console.log(regionParam)
    //         console.log("index: " + index)
    //         console.log(selectedRegionsList)
    //     }
    // }

  
    d3.csv('../src/data/applemobilitytrends.csv').then(function(data){
        data.filter(function(element){
            if (element.country == "Germany" && element["sub-region"] == "" &&  element["region"] == regionParam){ //
                mobilityGermanyData.push(element);  // Create a new dataset(array) containing only data for Germany 
             // mobilityData.push({country: element.country, region: element.region, transportation_type: element.transportation_type, jan:"", feb:"", mar:""});   
            }
        })

       console.log(mobilityGermanyData)
        // let num = 0;
        // if(counterRegion > 0 && counterRegion < 4){
        //    // emptyList.push(mobilityGermanyData)
        //    num = counterRegion - 1;
        //    selectedRegionsList.push(mobilityGermanyData);   
        // }
     
    
        
        // if(regionSelected && currentMonth == monthParam){
        //     selectedRegionsList.push(mobilityGermanyData);   
        //     console.log(selectedRegionsList)
        // } else if(!regionSelected){
        //     //selectedRegionsList.findIndex(element => element["region"] == "Bavaria")
        //   //  console.log(selectedRegionsList)
        // }
        
       // selectedRegionsList.push(mobilityGermanyData);   

        //console.log(mobilityGermanyData)
         // Create a nested array 
         let nestedData = d3.group(mobilityGermanyData,  d => d.region, d => d.transportation_type)
        // nested array again and again to get data by transport
        let dataByRegion = nestedData.get(regionParam)
        let dataByDriving = dataByRegion.get("driving")
        let dataByWalking = dataByRegion.get("walking")
        let dataByTransit = dataByRegion.get("transit")
        // let dataByRegion;
        // let dataByDriving 
        // let dataByWalking 
        // let dataByTransit 

        // for(var i=0 ; i < regionList.length; i++){
        //      dataByRegion = nestedData.get(regionList[i])
        //      console.log(dataByRegion)
        //       dataByDriving = dataByRegion.get("driving")
        //  dataByWalking = dataByRegion.get("walking")
        //  dataByTransit = dataByRegion.get("transit")
        // }
       






      //  console.log(dataByDriving)
       // Calculate the monthly average separately for the means of transport 
        if(dataByDriving) CalculateMonthlyAverage(dataByDriving) 
        if(dataByWalking) CalculateMonthlyAverage(dataByWalking)
        if(dataByTransit) CalculateMonthlyAverage(dataByTransit)
        
        // for(var i = 0; i < counterRegion; i++){

        // }

       CreateFinishedArray(mobilityGermanyData, regionParam, monthParam, regionSelected)
      // createTreemapData(selectedRegionsList, monthParam)
    }); 
  //  return selectedRegionsList;
};


let selArray = [];
let regionList = [];
function CreateFinishedArray(data, regionParam, monthPram, regionSelected){
    let region = regionParam;
    
    if(regionSelected){
        regionList.push(region)
        selArray.push(data);
    }
    if(!regionSelected){
       let index = regionList.findIndex(element => element == region)
       regionList.splice(index, 1)
       console.log(regionList)
       selArray.splice(index, 1)

    }
   
    console.log(regionList)
    console.log(selArray)
   // console.log(data)
   // console.log(regionParam)
    createTreemapData(selArray, monthPram)
}


// temporary: display the treemap for default params: Bavaria, January (without checkbox selection)
// displaymobilitydata("Bavaria", "01");

function createTreemapData(data, month){

    // console.log(data)

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
    d3.select("#treemapMobility").select("svg").remove();

    var margin = {top: 10, right: 10, bottom: 10, left: 10};
    var width = 400;
    var height = 400;

  
    var svg = d3.select("#treemapMobility")
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
    var color= d3.scale.linear().domain([60, 300]).range(["orange", "indianred"]);
    var color1 = d3.scale.category10();
    var color2 = d3.scale.category20();         
    var color3 = d3.scale.category20b();  
    var color4 = d3.scale.category20c();  

    // Add a opacity scale
    var opacity =d3.scaleLinear()
                .domain([90, 150])
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
            return color1(d.data[month]);})
            // .style("opacity", function(d) {
            //     return opacity(d.data[month])
            // });
   
        
    // and to add the text labels
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
   // console.log("data")
   // console.log(data)
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



    function ReplaceRegionName(regionParam){
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
    