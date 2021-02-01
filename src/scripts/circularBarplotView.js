export function Displaydestinationdata(selectedMonth){

    d3.select(".barplot").remove();

    const chosenMonth = new Date(selectedMonth[0]).getMonth();

    let destinationData = [];
    let month, day;
    var temp = [];

    var retail = 'retail_and_recreation_percent_change_from_baseline'
    var grocpharma = 'grocery_and_pharmacy_percent_change_from_baseline'
    var parks = 'parks_percent_change_from_baseline'
    var transit = 'transit_stations_percent_change_from_baseline'
    var work = 'workplaces_percent_change_from_baseline'
    var residential = 'residential_percent_change_from_baseline'

    d3.csv('../src/data/googlemobilityreport.csv').then(function(data){
        data.forEach(function(element) {
           if (element["country_region"] == "Germany" &&
                element["sub_region_1"]!== "" && element["sub_region_1"]!== undefined && element[retail]!== "" && element[grocpharma]!== "") {
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
                   "retail" : parseInt(destinationData[i][retail]),
                   "grocpharma" : parseInt(destinationData[i][grocpharma])

               }
               counterarray[currentmonth][destinationData[i].sub_region_1] =1

           } else {
               newarray[currentmonth][destinationData[i].sub_region_1]["state"] = destinationData[i].sub_region_1
               newarray[currentmonth][destinationData[i].sub_region_1]["retail"] += parseInt(destinationData[i][retail])
               newarray[currentmonth][destinationData[i].sub_region_1]["grocpharma"] += parseInt(destinationData[i][grocpharma])
               counterarray[currentmonth][destinationData[i].sub_region_1] +=1

           }

       }

       for (var month in newarray){
           for (var prop in newarray[month]){

               newarray[month][prop]['retail'] = Math.floor(parseInt(newarray[month][prop]['retail']) / parseInt(counterarray[month][prop]))
               newarray[month][prop]['grocpharma'] = Math.floor(parseInt(newarray[month][prop]['grocpharma']) / parseInt(counterarray[month][prop]))
               newarray[month][prop]['total'] = Math.floor(parseInt(newarray[month][prop]['retail']) + parseInt(newarray[month][prop]['grocpharma']))
           }
       }

        const arraydata = Object.entries(newarray).map(element => {
            return Object.values(element[1])
        });

        //console.log(arraydata[chosenMonth])
        createCircularBarplot(arraydata[chosenMonth]);
    });

};


function createCircularBarplot(data){
     
    var categories = ["retail","grocpharma"]


    // set the dimensions and margins of the graph
    var margin = {top: 120, right: 0, bottom: 100, left: 200},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        innerRadius = 50,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object to the body of the page
    var svg = d3.select("#circularbarplot")
        .append("svg")
        .attr("class", "barplot")
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 1100 450")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + ( height/2+100 )+ ")"); // Add 100 on Y translation, cause upper bars are longer
  
    // X scale
    var x = d3.scaleBand()
        .domain(data.map(d => d.state))
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing ?
      
    let maxDomain;
    if(d3.max(data, d => d.total) < 0){
      maxDomain = d3.max(data, d => d.total)-d3.max(data, d => d.total);
    } else {
      maxDomain = d3.max(data, d => d.total)+d3.max(data, d => d.total);
    }
    console.log(d3.min(data, d => d.total)-5)
        
    // Y scale
    var y = d3.scaleRadial()
        .domain([d3.min(data, d => d.total)-10, maxDomain]) // Domain of Y is from 0 to the max seen in the data, CAN BE ADAPTED later!!!!
        .range([innerRadius, outerRadius])   

    // set Z scale
    var z = d3.scaleOrdinal()
        .domain(categories)
        .range(["#8fba82", "#037c87", "#3C6955"])

    const yAxis = g => g
      .attr("text-anchor", "middle")
      .call(g => g.append("text")
          .attr("y", d => -y(y.ticks().pop()))
          .attr("dy", "-1em")
          .text("%"))
      .call(g => g.selectAll("g")
          .data(y.ticks(4))
          .join("g")
          .attr("fill", "none")
          .call(g => g.append("circle")
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.2)
              .attr("r", y))
          .call(g => g.append("text")
              .attr("y", d => -y(d))
              .attr("dy", "0.35em")
              .style("font-style", "italic")
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
            translate(${y(y.ticks()[y.ticks().length-1])},0)
          `)
          //.call(g => g.append("line")
          //   .attr("x2", -5)
          //    .attr("stroke", "#000"))
          .call(g => g.append("text")
              .attr("fill", "#0f5858")
              .attr("transform", d => (x(d.state) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                  ? `rotate(0)translate(${0},${0})`
                  : `rotate(0)translate(${0},${0})`)
              .text(d => d.state)))

    const legend = g => g.append("g")
        .selectAll("g")
        .data(categories.reverse())
        .join("g")
          .attr("transform", (d, i) => `translate(200,${(i - (categories.length - 1) / 2) * 20})`)
          .call(g => g.append("rect")
              .attr("width", 18)
              .attr("height", 18)
              .attr("fill", z))
          .call(g => g.append("text")
              .attr("x", 24)
              .attr("y", 9)
              .attr("dy", "0.35em")
              .text(d => {
                if(d === "retail") return "Einzelhandel";
                if(d === "grocpharma") return "Apotheke";
              }))

    var arc = d3.arc()     
      .innerRadius(d => {
          //console.log(d);
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