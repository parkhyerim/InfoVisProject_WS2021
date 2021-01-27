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
        console.log(destinationData)

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
                   if (newarray[destinationData[i].sub_region_1] == undefined) {
                       newarray[destinationData[i].sub_region_1] = {}
                       counterarray[destinationData[i].sub_region_1] = {}
                   }
                   if (newarray[destinationData[i].sub_region_1][currentmonth]!== undefined){
                       newarray[destinationData[i].sub_region_1][currentmonth]["retail"] += parseFloat(destinationData[i][retail])
                       newarray[destinationData[i].sub_region_1][currentmonth]["grocpharma"] += parseFloat(destinationData[i][grocpharma])
                       counterarray[destinationData[i].sub_region_1][currentmonth] +=1
                   }
                   else {
                      newarray[destinationData[i].sub_region_1][currentmonth] = {
                           'retail' : parseFloat(destinationData[i][retail]),
                           'grocpharma' : parseFloat(destinationData[i][grocpharma])
                       }

                       counterarray[destinationData[i].sub_region_1][currentmonth] =1

                   }

       }

       for (var prop in newarray){
           for (month in newarray[prop]){
               newarray[prop][month]['retail'] = (parseFloat(newarray[prop][month]['retail']) / parseFloat(counterarray[prop][month])).toFixed(2)
               newarray[prop][month]['grocpharma'] = (parseFloat(newarray[prop][month]['grocpharma']) / parseFloat(counterarray[prop][month])).toFixed(2)
               newarray[prop][month]['total'] = (parseFloat(newarray[prop][month]['retail']) + parseFloat(newarray[prop][month]['grocpharma'])).toFixed(2)
           }
       }

        const arraydata = Object.entries(newarray).map(element => {
            return {
                state: element[0],
                Value: element[1]
            }
        });
        console.log(arraydata)

        createCircularBarplot(arraydata, destinationData);
    });

};

Displaydestinationdata();

function createCircularBarplot(data, testdata){
    console.log(data[0].state);
    console.log(data[0].Value["03"]);

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

    var arc = d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(function(d) {
            console.log(d)
            return y(d.Value['03'].retail); })
        .startAngle(function(d) { return x(d.state); })
        .endAngle(function(d) { return x(d.state) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius)

    // X scale
    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing ?
        .domain(data.map(function(d) {return d.state; }) );


    ; // The domain of the X axis is the list of states.

    // Y scale
    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([-60, 60]); // Domain of Y is from 0 to the max seen in the data, CAN BE ADAPTED later!!!!

    // set Z scale
    var z = d3.scaleRadial()
        .domain(data.map(function(d) {return d.Value["03"]; }))
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

   // svg.append("g")
     //   .call(yAxis);

    svg.append("g")
        .selectAll("g")
        .data(d3.stack().keys(data[0])(data))
        .join("g")
        .attr("fill", d => z(d.key))
        .selectAll("path")
        .data(d => d)
        .join("path")
        .attr("d", arc);

    /*
    var yAxis = g => g
        .attr("text-anchor", "middle")
        .call(g => g.append("text")
            .attr("y", d => -y(y.ticks(5).pop()))
            .attr("dy", "-1em")
            .text("Population"))
        .call(g => g.selectAll("g")
            .data(y.ticks(5).slice(1))
            .join("g")
            .attr("fill", "none")
            .call(g => g.append("circle")
                .attr("stroke", "#000")
                .attr("stroke-opacity", 0.5)
                .attr("r", y))
            .call(g => g.append("text")
                .attr("y", d => -y(d))
                .attr("dy", "0.35em")
                .attr("stroke", "#fff")
                .attr("stroke-width", 5)
                .text(y.tickFormat(5, "s"))
                .clone(true)
                .attr("fill", "#000")
                .attr("stroke", "none")))

                */


    // Add bars
    /*svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("fill", "#69b3a2")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius(function(d) {
                console.log(d)
                return y(d.Value['03'].retail); })
            .startAngle(function(d) { return x(d.state); })
            .endAngle(function(d) { return x(d.state) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))
        .append("text")
        .text(function(d){return(d.Value["03"].retail)})
        .attr("transform", function(d) { return (x(d.state) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")

     */


    // Add the labels
    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("text-anchor", function(d) { return (x(d.state) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.state) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.Value['03'].retail)+10) + ",0)"; })
        .append("text")
        .text(function(d){return(d.state)})
        .attr("transform", function(d) { return (x(d.state) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")

}