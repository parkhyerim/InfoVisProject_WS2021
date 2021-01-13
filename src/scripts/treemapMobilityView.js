// temporary: the entry point for the regions selection ('chekbox' in index.html)
const checkboxes = document.getElementsByClassName('checkbox')
let countCheck = 0; // number of checked regions
for (let checkbox of checkboxes){
  checkbox.addEventListener('change', function() {
      if(this.checked){
          displaymobilitydata(checkbox.name, "10")  // params: region, month
          countCheck++;
          console.log(countCheck)      
      }else{
          countCheck--;
        // console.log(countCheck)
      }
  }) 
}

function displaymobilitydata(regionParam, monthParam){

    let temp = [];
    let mobilityData = [];

    d3.csv('../src/data/applemobilitytrends.csv').then(function(data){
        data.forEach(element => temp.push(element));
        temp.filter(function(element){
            if (element.country == "Germany" && element["sub-region"] == ""){
                mobilityData.push(element);   
               // mobilityData.push({jan:"", feb:""})
              //mobilityData.push({country: element.country, region: element.region, transportation_type: element.transportation_type, jan:"", feb:""});   
                //console.log(mobilityData)                 
            }
        })

        console.log(mobilityData)  
              
        // data.forEach(function(element) {
        //     if (element.country == "Germany" && element["sub-region"] == "") {
        //         mobilityData.push(element);    
        //         console.log(mobilityData)    
        //     }
        // });

        // console.log(mobilityData)   

        // Create a nested array 
        let nestedData = d3.group(mobilityData, d => d.region, d => d.transportation_type)
        console.log("a nested array")        
        console.log(nestedData)

        let dataByRegion = nestedData.get(regionParam)
        console.log("data by region")
        console.log(dataByRegion)
        let dataByDriving = dataByRegion.get("driving")
        console.log("data by driving")
        console.log(dataByDriving)
        let dataByWalking = dataByRegion.get("walking")
        let dataByTransit = dataByRegion.get("transit")
        
       // Calculate the monthly average separately for the means of transport 
        if(dataByDriving) CalculateMonthlyAverage(dataByDriving)
        if(dataByWalking) CalculateMonthlyAverage(dataByWalking)
        if(dataByTransit) CalculateMonthlyAverage(dataByTransit)
        
      
        //generate TreeChart from the provided Dateset
       // console.log(mobilityData)    
      //  let mobilityDataPerMonth = d3.ascending(mobilityData);
        /* console.log(mobilityDataPerMonth)   
        console.log(mobilityDataPerMonth[1][5]) 
        console.log(mobilityDataPerMonth[0][5]) 
        console.log(mobilityDataPerMonth[2][5])  */
       // generateHierarchy(mobilityDataPerMonth)
      // console.log(mobilityData)
       createTreeChart(mobilityData, monthParam)
    });
};

// temporary: display the treemap for default params: Bavaria, January (without checkbox selection)
 displaymobilitydata("Bavaria", "01");


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
                            console.log(month + " " + typeof(month))
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
        }}}


function createTreeChart(data, month){

    //in case new treemap shall be loaded, the one before gets removed
    d3.select("#treemapMobilitywrapper").select("svg").remove();
    d3.select("#treemapMobilitywrapper2").select("svg").remove();


    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    var svg = d3.select("#treemapMobilitywrapper")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       
        var svg2 = d3.select("#treemapMobilitywrapper2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //Group the data by "Germany", so our tree has a root node
    let groupedData = data.reduce((k, v)=> {
        k[v.country] = [...k[v.country] || [], v];
        return k;
        }, {}); 

       // console.log(groupedData)

    // let hierachyData = d3.group(groupedData, d => d.region, d => d.transportation_type)
    // console.log(hierachyData)
    //Group the data by country and by region, so our tree has a root node
        // let groupedData = data.reduce((c, v) => {
        //     c[v.country] = c[v.country] || {};                         //Init if country property does not exist
        //     c[v.country][v.region] = c[v.country][v.region] || {};   //Init if region property does not exist
        //     return c;
        //   }, {});
        //   console.log("groupData: " + groupedData);


    //Transform the data grouped by "Germany" into a hiearchy by usind d3.js hierachy (first param is root, second param is child nodes)
    var hgroup = d3.hierarchy(groupedData, function(d){
                                return d.Germany}
                                )
        .sum((d) => {return d[month]});

      //  console.log(hgroup)

    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
   const treemap= d3.treemap()
       .size([width, height])
       .padding(4)
       .paddingInner(3)
      (hgroup)


    // Determine the color of each field
    // Explanation from https://stackoverflow.com/questions/42546344/how-to-apply-specific-colors-to-d3-js-map-based-on-data-values?rq=1
    var color= d3.scale.linear()
                .domain([80, 150])
                .range(["orange", "indianred"]);

    // Add a opacity scale
    var opacity =d3.scaleLinear()
                .domain([50, 120])
                .range([.4,1])

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
            return color(d.data[month]);})
            .style("opacity", function(d) {
                return opacity(d.data[month])
            });
   
        
    // and to add the text labels
    svg
    .selectAll("text")
    .data(treemap.leaves())
    .enter()
    .append("text")
    .attr("x", function(d){ return d.x0+20})    // +10 to adjust position (more right)
    .attr("y", function(d){ return d.y0+30})    // +20 to adjust position (lower)
    .text(function(d){ if(d.data.transportation_type != "" && d.data.transportation_type != undefined && d.data.transportation_type != null) return d.data.transportation_type +""+ d.data[month]+"%"})
    .attr("font-size", "18px")
    .attr("fill", "white")



    svg2
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
        return color(d.data[month]);})
        .style("opacity", function(d) {
            return opacity(d.data[month])
        });

    
// and to add the text labels
svg2
.selectAll("text")
.data(treemap.leaves())
.enter()
.append("text")
.attr("x", function(d){ return d.x0+20})    // +10 to adjust position (more right)
.attr("y", function(d){ return d.y0+30})    // +20 to adjust position (lower)
.text(function(d){ if(d.data.transportation_type != "" && d.data.transportation_type != undefined && d.data.transportation_type != null) return d.data.transportation_type +""+ d.data[month]+"%"})
.attr("font-size", "18px")
.attr("fill", "white")
}