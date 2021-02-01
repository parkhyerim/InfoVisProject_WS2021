export function Displaydestinationdata(selectedMonth){

    d3.select(".barplot").remove();

    const chosenMonth = new Date(selectedMonth[0]).getMonth();

    let destinationData = [];
    let month, day;
    var temp = [];

    let grocpharma = 'grocery_and_pharmacy_percent_change_from_baseline'
    let transit = 'transit_stations_percent_change_from_baseline'

    d3.csv('../src/data/googlemobilityreport.csv').then(function(data){
        data.forEach(function(element) {

            if (element["country_region"] == "Germany" &&
                element["sub_region_1"]!== "" && element["sub_region_1"]!== undefined && element[grocpharma]!== "" &&
                element[transit]!== "") {
                destinationData.push(element);
            }
        });

       const newarray = {};
       const counterarray = [];

       for (let i=0; i<destinationData.length; i++){
           let currentmonth = destinationData[i].date;
           currentmonth = new Date(currentmonth).getMonth();

            //currentmonth = parseInt(currentmonth.substring(5, 7));
           if (newarray[currentmonth] == undefined) {
               newarray[currentmonth] = []
               counterarray[currentmonth] = []
           }


           if (typeof (newarray[currentmonth][destinationData[i].sub_region_1]) == "undefined"){

               newarray[currentmonth][destinationData[i].sub_region_1]= {
                   "state" : destinationData[i].sub_region_1,
                   "grocpharma" : parseInt(destinationData[i][grocpharma]),
                   "transit" : parseInt(destinationData[i][transit]),
               }
               counterarray[currentmonth][destinationData[i].sub_region_1] =1

           } else {
               newarray[currentmonth][destinationData[i].sub_region_1]["state"] = destinationData[i].sub_region_1
               newarray[currentmonth][destinationData[i].sub_region_1]["grocpharma"] += parseInt(destinationData[i][grocpharma])
               newarray[currentmonth][destinationData[i].sub_region_1]["transit"] += parseInt(destinationData[i][transit])
               counterarray[currentmonth][destinationData[i].sub_region_1] +=1

           }

       }

       for (var month in newarray){
           for (var prop in newarray[month]){

               newarray[month][prop]['grocpharma'] = parseInt(parseInt(newarray[month][prop]['grocpharma']) / parseInt(counterarray[month][prop]))
               newarray[month][prop]['transit'] = parseInt(parseInt(newarray[month][prop]['transit']) / parseInt(counterarray[month][prop]))
               newarray[month][prop]['total'] = parseInt(newarray[month][prop]['grocpharma']) + parseInt(newarray[month][prop]['transit']) 
           }
       }

        const arraydata = Object.entries(newarray).map(element => {
            return Object.values(element[1])
        });
        createCircularBarplot(arraydata[chosenMonth]);
    });

};



function createCircularBarplot(data){
    
    var categories = ["grocpharma", "transit"]

    // set the dimensions and margins of the graph
    var margin = {top: 0, right: 0, bottom: 100, left: 0},
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom,
        innerRadius = 30,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object to the body of the page
    var svg = d3.select("#circularbarplot")
        .append("svg")
        .attr("class", "barplot")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 700 600")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", "translate(" + 370 + "," + 120 + ")"); // Add 100 on Y translation, cause upper bars are longer
  
    // X scale
    var x = d3.scaleBand()
        .domain(data.map(d => d.state))
        .range([0, 2 * Math.PI])    
        .align(0)                  
              
    // Y scale
    var y = d3.scaleRadial()
        .domain([d3.min(data, d => d.total)-10, d3.max(data, d => d.total)+20]) 
        .range([innerRadius, outerRadius])   

    // set Z scale
    var z = d3.scaleOrdinal()
        .domain(categories)
        .range(["#78909c", "#c4d2cc"])

    const yAxis = g => g
      .attr("text-anchor", "middle")
      .call(g => g.append("text")
          .attr("y", d => -y(y.ticks().pop()))
          .attr("dy", "-1em")
          .style("font-family", "Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
          .attr("font-size", "10px")
          .attr("fill", "black")
          .text("%"))
      .call(g => g.selectAll("g")
          .data(y.ticks(5))
          .join("g")
          .attr("fill", "none")
          .call(g => g.append("circle")
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.2)
              .attr("r", y))
          .call(g => g.append("text")
              .attr("y", d => -y(d))
              .attr("dy", "0.35em")
              .attr("font-size", "10px")
              .style("font-family", "Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
              .attr("stroke-width", 5)
              .text(y.tickFormat(5, "s"))
              //.clone(true)
              .attr("fill", "black")))


     const xAxis = g => g
      .attr("text-anchor", "start")
      .call(g => g.selectAll("g")
        .data(data)
        .join("g")
          .attr("transform", d => `
            rotate(${((x(d.state) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
            translate(${y(y.ticks()[y.ticks().length-1]+5)},0)
          `)
          //.call(g => g.append("line")
          //   .attr("x2", -5)
          //    .attr("stroke", "#000"))
          .call(g => g.append("text")
              .attr("fill", "black")
              .attr("font-size", "10px")
              .style("font-family", "Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
              .attr("transform", d => (x(d.state) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                  ? `rotate(0)translate(${0},${0})`
                  : `rotate(0)translate(${0},${0})`)
              .text(d => d.state)))

    const legend = g => g.append("g")
        .selectAll("g")
        .data(categories.reverse())
        .join("g")
        .attr("transform", (d, i) => `translate(150,${(i - (categories.length - 1) / 2) * 20})`)
        .call(g => g.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", z))
        .call(g => g.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .style("font-family", "Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell, Helvetica Neue,sans-serif")
            .attr("font-size", "10px")
            .text(d => {
                if(d === "grocpharma") return "Apotheke";
                if(d === "transit") return "Haltestellen";
            }))

    var arc = d3.arc()     
      .innerRadius(d => {
          return y(d[0]);
      })
      .outerRadius(d => y(d[1]))
      .startAngle(d => x(d.data.state))
      .endAngle(d => x(d.data.state) + x.bandwidth())
      .padAngle(0.05)
      .padRadius(innerRadius)

    svg.append("g")
        .selectAll("g")
        .data(d3.stack().keys(categories)(data))
        .join("g")
          .attr("fill", d => {return z(d.key)})
        .selectAll("path")
        .data(d => {return d})
        .join("path")
          .attr("d", arc);

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    svg.append("g")
        .call(legend);

}