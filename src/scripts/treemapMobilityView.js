// temporary: the entry point for the regions selection ('chekbox' in index.html)
const checkboxes = document.getElementsByClassName('checkbox')
let counterRegion = 0; // number of checked regions
for (let checkbox of checkboxes){
  checkbox.addEventListener('change', function() {
      if(this.checked){
           createMobilityData(checkbox.name, "03")
        //  displaymobilitydata(checkbox.name, myMonat)  // params: region, month
          // displaymobilitydata("Berlin", "01") 
          counterRegion++; 
      }else{
          counterRegion--;
      }
  }) 
}
let multipleRegionsList = [];
function createMobilityData(regionParam, monthParam){

    let mobilityGermanyData = [];
    
    d3.csv('../src/data/applemobilitytrends.csv').then(function(data){
        data.filter(function(element){
            if (element.country == "Germany" && element["sub-region"] == "" &&  element["region"] == regionParam){
                mobilityGermanyData.push(element);  // Create a new dataset(array) containing only data for Germany 
             // mobilityData.push({country: element.country, region: element.region, transportation_type: element.transportation_type, jan:"", feb:"", mar:""});   
            }
        })

        // data.forEach(element => temp.push(element));
        // temp.forEach(function(element) {
        //     if (element.country == "Germany" && element["sub-region"] == "" &&  element["region"]==regionParam) {
        //         mobilityData.push(element);    
        //     }
        // });

     //   console.log(mobilityGermanyData)   
      //  console.log(mobilityGermanyData[0])
       
        // Create a nested array 
        let nestedData = d3.group(mobilityGermanyData,  d => d.region, d => d.transportation_type)
    
        let num = 0;
        if(counterRegion > 0 && counterRegion < 4){
           // emptyList.push(mobilityGermanyData)
           num = counterRegion - 1;
           multipleRegionsList.push(mobilityGermanyData);
           console.log("multipleRegionsList")
       // console.log(multipleRegionsList)
          
        }
    
        //  nested array again and again to get data by transport
        let dataByRegion = nestedData.get(regionParam)
        let dataByDriving = dataByRegion.get("driving")
        let dataByWalking = dataByRegion.get("walking")
        let dataByTransit = dataByRegion.get("transit")

       // Calculate the monthly average separately for the means of transport 
        if(dataByDriving) CalculateMonthlyAverage(dataByDriving)
        if(dataByWalking) CalculateMonthlyAverage(dataByWalking)
        if(dataByTransit) CalculateMonthlyAverage(dataByTransit)

       createTreemapData(multipleRegionsList, monthParam)
    }); 
};


function createTreemapData(data, month){
    console.log(data);



//THIS IS FOR THE GERMANY-BUNDESLAND HIERACHY 
//Group the data by "Germany", so our tree has a root node
  let groupedData = data.reduce((c, v)=> {
     
    c[v.region] = [...c[v.region] || [], v];
    console.log(c);
    return c;
    }, {});    
//console.log(groupedData);
//THIS IS FOR THE GERMAN"Y-BUNDESLAND-TRANSPORTAIONTYPE HIERACHY
//Group the data by country and by region, so our tree has a root node
    /* let groupedData = data.reduce((c, v) => {
    if(c[v.country] != undefined){
        c[v.country] = c[v.country]


       } 
     c[v.country] = c[v.country] || [], v;                         //Init if country property does not exist
     c[v.country][v.region] = {...c[v.country][v.region] || [], v};   //Init if region property does not exist
     return c;
     }, {});   */ 
 
//THIS IS FOR THE GERMANY-BUNDESLAND-TRANSPORTAIONTYPE HIERACHY
 /*  let groupedData = data.reduce((c,v) => {
    let con = c[v.country] = c[v.country] || {};
    con = con[v.region] = con[v.region] || {};
    con = con[v.transportation_type] = con[v.transportation_type] || v;
    console.log(con);
    return con;
}, {});  
 */

//Transform the data grouped by "Germany" into a hiearchy by usind d3.js hierachy (first param is root, second param is child nodes)
let hgroup = d3.hierarchy(groupedData, function(d){
                    console.log(groupedData);
                      return d})
    .sum((d) => {return d[month]});
console.log(hgroup);
    createTreeChart(hgroup, month); 

};


function createTreeChart(hgroup, month){
    // Old treemap gets removed
    d3.select("#treemapRegion01").select("svg").remove();

    var margin = {top: 10, right: 10, bottom: 10, left: 10};
    var width = 400;
    var height = 400;

  
    var svg = d3.select("#treemapRegion01")
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
             return "🚘 " + d.data.transportation_type +" "+ d.data[month]+"%"; }
        else if(d.data.transportation_type === "walking"){
            return "🚶‍♀️ " + d.data.transportation_type +" "+ d.data[month]+"%";
        } else if(d.data.transportation_type === "transit") {
            return "🚌 "+ d.data.transportation_type + " "+ d.data[month]+"%";
        }})
    .attr("font-size", "14px")
    .attr("fill", "white")
    .attr("font-weight","bold")
}


// Calculate the monthly average separately for the means of transport 
function CalculateMonthlyAverage(data){
    let monthName = "";  // to use for calculating of monthly average value
    let sum = janSum = febSum = marSum = aprSum = maySum = junSum = julSum = augSum = sepSum = octSum = novSum = decSum = 0; // variable for each monthly total
    let avg = janAvg = febAvg = marAvg = aprAvg = mayAvg = junAvg = julAvg = augAvg = sepAvg = octAvg = novAvg = decAvg = 0; // variable for each monthly average
    let counter = 0; // count only the day that has a valid value 

    for (let m=1; m<13; m++){ // loop over months
        if (m<10) month="0"+m;
        else month=m;

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
                            //console.log(month + " " + typeof(month))
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
                            julAvg = marSum /counter
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
                        case 10:    
                            octSum += parseFloat(element[ymd])
                            octAvg = octSum /counter
                            element[month] = octAvg.toFixed(2)
                           // console.log(ymd + " " + "sum: " + parseFloat(octSum)  + " counter: " + counter + " result: " + octAvg)
                            break;
                        case 11:
                            novSum += parseFloat(element[ymd])
                            novAvg = novSum /counter
                            element[month] = novAvg.toFixed(2)
                          //  console.log(ymd + " " + "sum: " + parseFloat(novSum)  + " counter: " + counter + " result: " + novAvg)
                            break;
                        case 12:
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