export function Displaydestinationdata(selectedMonth="03"){
    let destinationData = [];
    let month, day;
    var temp = [];

    //let monthparam = selectedMonth[0].substr((selectedMonth[0].indexOf("-")+1), 2);

    d3.csv('../src/data/googlemobilityreport.csv').then(function(data){
        data.forEach(function(element) {
            if (element["country_region"] == "Germany" &&
                element["sub_region_1"]!== "") {
                destinationData.push(element);
            }
        });

       const dataByRegion = destinationData.reduce((newdata, value) => {
            // Group initialization
            if (!newdata[value["sub_region_1"]]) {
                newdata[value["sub_region_1"]] = [];
            }

            // Grouping
            newdata[value["sub_region_1"]].push(value);

            return newdata;
        }, {});
       const newarray = [];
       const counterarray = []

       for (let i=0; i<destinationData.length; i++){
           let currentmonth = destinationData[i].date;
           let retail = 'retail_and_recreation_percent_change_from_baseline'
           let grocpharma = 'grocery_and_pharmacy_percent_change_from_baseline'
               currentmonth = currentmonth.substring(5, 7);
           if (newarray[currentmonth] == undefined) {
               newarray[currentmonth] = []
               counterarray[currentmonth] = []
           }

           if (typeof (newarray[currentmonth][destinationData[i].sub_region_1]) == "undefined"){

               newarray[currentmonth][destinationData[i].sub_region_1]= {
                   "state" : destinationData[i].sub_region_1,
                   "retail" : parseFloat(destinationData[i][retail]),
                   "grocpharma" : parseFloat(destinationData[i][grocpharma])

               }
               counterarray[currentmonth][destinationData[i].sub_region_1] =1

           } else {
               newarray[currentmonth][destinationData[i].sub_region_1]["state"] = destinationData[i].sub_region_1
               newarray[currentmonth][destinationData[i].sub_region_1]["retail"] += parseFloat(destinationData[i][retail])
               newarray[currentmonth][destinationData[i].sub_region_1]["grocpharma"] += parseFloat(destinationData[i][grocpharma])
               counterarray[currentmonth][destinationData[i].sub_region_1] +=1
           }

       }

       for (var month in newarray){
           for (var prop in newarray[month]){

               newarray[month][prop]['retail'] = parseFloat(newarray[month][prop]['retail']) / parseFloat(counterarray[month][prop])
               newarray[month][prop]['grocpharma'] = parseFloat(newarray[month][prop]['grocpharma']) / parseFloat(counterarray[month][prop])
               newarray[month][prop]['total'] = parseFloat(newarray[month][prop]['retail']) + parseFloat(newarray[month][prop]['grocpharma'])
           }
       }

        const arraydata = Object.entries(newarray).map(element => {
            return Object.values(element[1])
        });

       console.log(arraydata[3])

        createCircularBarplot(arraydata[3], destinationData);
    });

};



Displaydestinationdata();

function createCircularBarplot(data, testdata){

     //var keys = (Object.keys(data[0].Value["03"])).slice(-1);
    var categories = ["retail","grocpharma"]


    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 460 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom,
        innerRadius = 60,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object to the body of the page
    var svg = d3.select("#circularbarplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + ( height/2+100 )+ ")"); // Add 100 on Y translation, cause upper bars are longer
  
    // X scale
    var x = d3.scaleBand()
        .domain(data.map(d => d.state))
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing ?
        
    // Y scale
    var y = d3.scaleRadial()
        .domain([0, d3.max(data, d => d.total)]) // Domain of Y is from 0 to the max seen in the data, CAN BE ADAPTED later!!!!
        .range([innerRadius, outerRadius])   // Domain will be define later.

    // set Z scale
    var z = d3.scaleOrdinal()
        .domain(categories)
        .range(["#98abc5", "#8a89a6"])

    const yAxis = g => g
      .attr("text-anchor", "middle")
      .call(g => g.append("text")
          .attr("y", d => -y(y.ticks(5).pop()))
          .attr("dy", "-1em")
          .text("%"))
      .call(g => g.selectAll("g")
          .data(y.ticks(5).slice(1))
          .join("g")
          .attr("fill", "none")
          .call(g => g.append("circle")
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.2)
              .attr("r", y))
          .call(g => g.append("text")
              .attr("y", d => -y(d))
              .attr("dy", "0.35em")
              .attr("stroke-width", 5)
              .text(y.tickFormat(5, "s"))
              .clone(true)
              .attr("fill", "#008080")))


     const xAxis = g => g
      .attr("text-anchor", "middle")
      .call(g => g.selectAll("g")
        .data(data)
        .join("g")
          .attr("transform", d => `
            rotate(${((x(d.state) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
            translate(${innerRadius},0)
          `)
          .call(g => g.append("line")
              .attr("x2", -5)
              .attr("stroke", "#000"))
          .call(g => g.append("text")
              .attr("transform", d => (x(d.state) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                  ? "rotate(90)translate(0,16)"
                  : "rotate(-90)translate(0,-9)")
              .text(d => d.state.substr(0,2))))

    var arc = d3.arc()     // imagine your doing a part of a donut plot
      .innerRadius(d => y(d[0]))
      .outerRadius(d => y(d[1]))
      .startAngle(d => x(d.data.state))
      .endAngle(d => x(d.data.state) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius)

    svg.append("g")
        .selectAll("g")
        .data(d3.stack().keys(categories)(data))
        .join("g")
          .attr("fill", d => z(d.key))
        .selectAll("path")
        .data(d => d)
        .join("path")
          .attr("d", arc);

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

     


}