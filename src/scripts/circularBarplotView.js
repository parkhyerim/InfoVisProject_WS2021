export function Displaydestinationdata(selectedMonth="03"){

    let destinationData = [];
    let month, day;
    var temp = [];

    //let monthparam = selectedMonth[0].substr((selectedMonth[0].indexOf("-")+1), 2);

    d3.csv('../src/data/googlemobilityreport.csv').then(function(data){
        var retail = 'retail_and_recreation_percent_change_from_baseline'
        var grocpharma = 'grocery_and_pharmacy_percent_change_from_baseline'
        var parks = 'parks_percent_change_from_baseline'
        var transit = 'transit_stations_percent_change_from_baseline'
        var work = 'workplaces_percent_change_from_baseline'
        var residential = 'residential_percent_change_from_baseline'

        data.forEach(function(element) {
            if (element["country_region"] == "Germany" &&
                element["sub_region_1"]!== "" && element["sub_region_1"]!== undefined && element[retail]!== "" && element[grocpharma]!== "" && element[parks]!== "" &&
                element[transit]!== "" && element[work]!== "" && element[residential]!== "") {
                destinationData.push(element);
            }
        });

       const newarray = {};
       const counterarray = [];

       for (let i=0; i<destinationData.length; i++){
           let currentmonth = destinationData[i].date;

           currentmonth = String(new Date(currentmonth).getMonth());

            //currentmonth = parseInt(currentmonth.substring(5, 7));
           if (newarray[currentmonth] == undefined) {
               newarray[currentmonth] = []
               counterarray[currentmonth] = []
           }


           if (typeof (newarray[currentmonth][destinationData[i].sub_region_1]) == "undefined"){

               newarray[currentmonth][destinationData[i].sub_region_1]= {
                   "state" : destinationData[i].sub_region_1,
                   "retail" : parseInt(destinationData[i][retail]),
                   "grocpharma" : parseInt(destinationData[i][grocpharma]),
                   "parks" : parseInt(destinationData[i][parks]),
                   "transit" : parseInt(destinationData[i][transit]),
                   "work" : parseInt(destinationData[i][work]),
                   "residential" : parseInt(destinationData[i][residential])
               }
               counterarray[currentmonth][destinationData[i].sub_region_1] =1

           } else {
               newarray[currentmonth][destinationData[i].sub_region_1]["state"] = destinationData[i].sub_region_1
               newarray[currentmonth][destinationData[i].sub_region_1]["retail"] += parseInt(destinationData[i][retail])
               newarray[currentmonth][destinationData[i].sub_region_1]["grocpharma"] += parseInt(destinationData[i][grocpharma])
               newarray[currentmonth][destinationData[i].sub_region_1]["parks"] += parseInt(destinationData[i][parks])
               newarray[currentmonth][destinationData[i].sub_region_1]["transit"] += parseInt(destinationData[i][transit])
               newarray[currentmonth][destinationData[i].sub_region_1]["work"] += parseInt(destinationData[i][work])
               newarray[currentmonth][destinationData[i].sub_region_1]["residential"] += parseInt(destinationData[i][residential])
               counterarray[currentmonth][destinationData[i].sub_region_1] +=1

           }

       }

       for (var month in newarray){
           for (var prop in newarray[month]){

               newarray[month][prop]['retail'] = parseInt(parseInt(newarray[month][prop]['retail']) / parseInt(counterarray[month][prop]))
               newarray[month][prop]['grocpharma'] = parseInt(parseInt(newarray[month][prop]['grocpharma']) / parseInt(counterarray[month][prop]))
               newarray[month][prop]['parks'] = parseInt(parseInt(newarray[month][prop]['parks']) / parseInt(counterarray[month][prop]))
               newarray[month][prop]['transit'] = parseInt(parseInt(newarray[month][prop]['transit']) / parseInt(counterarray[month][prop]))
               newarray[month][prop]['work'] = parseInt(parseInt(newarray[month][prop]['work']) / parseInt(counterarray[month][prop]))
               newarray[month][prop]['residential'] = parseInt(parseInt(newarray[month][prop]['residential']) / parseInt(counterarray[month][prop]))
               newarray[month][prop]['total'] = parseInt(parseInt(newarray[month][prop]['retail']) + parseInt(newarray[month][prop]['grocpharma']))
                   + parseInt(newarray[month][prop]['parks'])+ parseInt(newarray[month][prop]['transit']) + parseInt(newarray[month][prop]['work']) + parseInt(newarray[month][prop]['residential'])
               console.log(newarray[month][prop])
           }
       }
       console.log(newarray)

        const arraydata = Object.entries(newarray).map(element => {
          console.log(element)
            return Object.values(element[1])
        });

       var testmonth = arraydata[3]
        for ( let i=0; i<testmonth.length; i++){

        }
        console.log(testmonth)

        console.log(arraydata[7])
        createCircularBarplot(arraydata[7], destinationData);
    });

};


function createCircularBarplot(data, testdata){

     //var keys = (Object.keys(data[0].Value["03"])).slice(-1);
    var categories = ["retail","grocpharma", "parks", "transit", "work", "residential"]
    console.log(categories)


    // set the dimensions and margins of the graph
    var margin = {top: 120, right: 10, bottom: 100, left: 10},
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        innerRadius = 50,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object to the body of the page
    var svg = d3.select("#circularbarplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 1100 650")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + ( height/2+100 )+ ")"); // Add 100 on Y translation, cause upper bars are longer
  
    // X scale
    var x = d3.scaleBand()
        .domain(data.map(d => d.state))
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing ?

    const maxDomain = (d3.max(data, d => d.total) - d3.max(data, d => d. total))+20;
    // Y scale
    var y = d3.scaleRadial()
        .domain([d3.min(data, d=> d.total)-10, maxDomain]) // Domain of Y is from 0 to the max seen in the data, CAN BE ADAPTED later!!!!
        .range([innerRadius, outerRadius])   // Domain will be define later.

    // set Z scale
    var z = d3.scaleOrdinal()
        .domain(categories)
        .range(d3.schemeSet3)
        //.range(["#8fba82", "#037c87", "#3c6955", "#0f5858", "#c4d2cc", "#3498DB"])

    const yAxis = g => g
      .attr("text-anchor", "middle")
      .call(g => g.append("text")
          .attr("y", d => -y(y.ticks().pop()))
          .attr("dy", "-1em")
          .text("%"))
      .call(g => g.selectAll("g")
          .data(y.ticks(10))
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
              //.clone(true)
              .attr("fill", "black")))


     const xAxis = g => g
      .attr("text-anchor", "start")
      .call(g => g.selectAll("g")
        .data(data)
        .join("g")
          .attr("transform", d => `
            rotate(${((x(d.state) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
            translate(${innerRadius},0)
          `)
          //.call(g => g.append("line")
          //   .attr("x2", -5)
          //    .attr("stroke", "#000"))
          .call(g => g.append("text")
              .attr("fill", "black")
              .attr("transform", d => (x(d.state) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                  ? "rotate(0)translate(20,0)"
                  : "rotate(0)translate(20,0)")
              .text(d => d.state)))

    var arc = d3.arc()     
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
        .data(d => {console.log(d)
            return d})
        .join("path")
          .attr("d", arc);

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    const legend = g => g.append("g")
        .selectAll("g")
        .data(categories.reverse())
        .join("g")
        .attr("transform", (d, i) => `translate(-40,${(i - (categories.length - 1) / 2) * 20})`)
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
                if(d === "parks") return "Parks";
                if(d === "transit") return "transit";
                if(d === "work") return "work";
                if(d === "residential") return "residential";


            }))

    svg.append("g")
        .call(legend);

     


}