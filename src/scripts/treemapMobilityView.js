// the entry point for the Bundesländer select ('chekbox' in index.html)
const checkboxes = document.getElementsByClassName('checkbox')
for (let checkbox of checkboxes){
  checkbox.addEventListener('change', function() {
      if(this.checked){
          displaymobilitydata(checkbox.name)
        //   console.log("Checked and the function is called");
      } 
  }) 
}

function displaymobilitydata(param){

    // d3.csv("../src/data/applemobility-germany.csv", function(data){
    //    // console.log(data);
    // })

    // temporal: without checkbox selection, "Bavaria" is the default
    if(param ==null) var param = "Bavaria";
    let mobilityData = [];
    var temp = [];
    d3.csv('../src/data/applemobilitytrends.csv').then(function(data){
      //  data.forEach(element => temp.push(element));
        data.forEach(function(element) {
            if (element.country == "Germany" && 
            element["sub-region"] == "" && 
            element["region"]==param) {
                mobilityData.push(element);     
               // console.log(mobilityData)    
            }
        });

        let monthname = "";
       
        // let janSum = 0, febSum = 0, marSum = 0, aprSum = 0,  marSum = 0, 
        let janSum = febSum = marSum = aprSum = maySum = junSum = julSum = augSum = sepSum = octSum = novSum = decSum = 0;
        let janResult = feb = mar = apr = may = jun = jul = aug = sep = oct = nov = dec = 0;
        let counter = 0;

        //calculate average value for every month
        for (let m=1; m<13; m++){

            //since each month has a different number of days and the data has some gaps for two days we need to store the individual number of days each month in the variable div
            let divider = 0;

            // if clause to make the month valuefitting to the formatting in the dataset
            if (m<10) month="0"+m;
            else month=m;

            for (let d=1; d<32; d++){
                if(monthname == "" || monthname != month){
                    monthname = month;
                    counter = 0;
                   // console.log("monthname: " + monthname + "monthtype:" + typeof(month) + " counter: " + counter)
                } else {
                   // console.log("monthname: " + monthname + " counter: " + counter)
                }

                // if clause to make the day value fitting to the formatting in the dataset
                if (d<10) day="0"+d;
                else day=d;

                //format of the date stored in a variable
                let ymd = "2020-"+month+"-"+day;
      
                mobilityData.forEach(function(element){
                    if(element[ymd] == undefined || element[ymd] == "" || element[ymd] == null ){
                        element[ymd] = 0
                        
                    }else{
                        counter++
                     // console.log("counter" + counter)
                        switch(month){
                            case "01":
                                janSum += parseFloat(element[ymd])
                                janResult = janSum/counter
                                element[month] = janResult.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(janSum) + " counter: " + counter + " result: " + janResult)
                                break;
                            case "02":
                                febSum += parseFloat(element[ymd])
                                feb = febSum /counter
                                element[month] = feb.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(febSum)  + " counter: " + counter + " result: " + feb)
                                break;
                            case "03":
                                marSum += parseFloat(element[ymd])
                                mar = marSum /counter
                                element[month] = mar.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(marSum)  + " counter: " + counter + " result: " + mar)
                                break;
                            case "04":
                                aprSum += parseFloat(element[ymd])
                                apr = aprSum /counter
                                element[month] = apr.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(aprSum)  + " counter: " + counter + " result: " + apr)
                                break;
                            case "05":
                                maySum += parseFloat(element[ymd])
                                may = maySum /counter
                                element[month] = may.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(maySum)  + " counter: " + counter + " result: " + may)
                                break;
                            case "06":
                                junSum += parseFloat(element[ymd])
                                jun = junSum /counter
                                element[month] = jun.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(junSum)  + " counter: " + counter + " result: " + jun)
                                break;
                            case "07":
                                julSum += parseFloat(element[ymd])
                                jul = marSum /counter
                                element[month] = jul.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(julSum)  + " counter: " + counter + " result: " + jul)
                                break;
                            case "08":
                                augSum += parseFloat(element[ymd])
                                aug = augSum /counter
                                element[month] = aug.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(augSum)  + " counter: " + counter + " result: " + aug)
                                break;
                            case "09":
                                sepSum += parseFloat(element[ymd])
                                sep = sepSum /counter
                                element[month] = sep.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(sepSum)  + " counter: " + counter + " result: " + sep)
                                break;
                            case 10:    
                                octSum += parseFloat(element[ymd])
                                oct = octSum /counter
                                element[month] = oct.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(octSum)  + " counter: " + counter + " result: " + oct)
                                break;
                            case 11:
                                novSum += parseFloat(element[ymd])
                                nov = novSum /counter
                                element[month] = nov.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(novSum)  + " counter: " + counter + " result: " + nov)
                                break;
                            case 12:
                                decSum += parseFloat(element[ymd])
                                dec = decSum /counter
                                element[month] = dec.toFixed(2)
                                console.log(ymd + " " + "sum: " + parseFloat(decSum)  + " counter: " + counter + " result: " + dec)
                                break;
                            default:

                        }
                    }

                });
            }

        }

        //generate TreeChart from the provided Dateset
       // console.log(mobilityData)    
        let mobilityDataPerMonth = mobilityData;
        console.log(mobilityDataPerMonth)   
        console.log(mobilityDataPerMonth[1][5]) 
        console.log(mobilityDataPerMonth[0][5]) 
        console.log(mobilityDataPerMonth[2][5]) 
       // generateHierarchy(mobilityDataPerMonth)
       // createTreeChart(mobilityData)
    });
};

// displaymobilitydata();

function generateHierarchy(data){

}


function createTreeChart(data){

    //in case new treemap shall be loaded, the one before gets removed
    d3.select("#treemapMobilitywrapper").select("svg").remove();

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    var svg = d3.select("#treemapMobilitywrapper")
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


    //Transform the data grouped by "Germany" into a hiearchy by usind d3.js hierachy (first param is root, second param is child nodes)
    var hgroup = d3.hierarchy(groupedData, function(d){
                                return d.Germany}
                                )
        .sum((d) => {return d["12"]});

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
                .domain([80, 120])
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
            return color(d.data["04"]);})
            .style("opacity", function(d) {
                return opacity(d.data["04"])
            });

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
            if(d.data.transportation_type === "driving"){
                return colorDriving(d.data["05"])}
            else if(d.data.transportation_type === "walking"){
                return colorWalking(d.data["05"])}
            else if(d.data.transportation_type === "transit") {
                return colorTransit(d.data["05"])}})
        .style("opacity", function(d){ return opacity(d.data["05"])});

        
    // and to add the text labels
    svg
        .selectAll("text")
        .data(treemap.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+20})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+30})    // +20 to adjust position (lower)
        .text(function(d){ 
            // Temporal: kurze Syntax und bessere Images
            if(d.data.transportation_type === "driving"){
            return "🚘 " + d.data.transportation_type +" "+ d.data["12"]+"%"; }
         else if(d.data.transportation_type === "walking"){
            return "🚶‍♀️ " + d.data.transportation_type +" "+ d.data["12"]+"%";
        } else if(d.data.transportation_type === "transit") {
            return "🚌 "+ d.data.transportation_type +" "+ d.data["12"]+"%";
        }})
        .attr("font-size", "18px")
        .attr("fill", "white")
}