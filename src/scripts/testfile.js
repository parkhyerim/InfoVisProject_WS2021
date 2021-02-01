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
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing ?
        .domain(data.map(function(d) {return d.state; }) );


    // Y scale
    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([-60, 60]); // Domain of Y is from 0 to the max seen in the data, CAN BE ADAPTED later!!!!

    var xAxis = g => g
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
                .text(d => d.state)))

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

    // set Z scale
    var z = d3.scaleRadial()
        .domain(categories)
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

    svg.append("g")
        .selectAll("g")
        .data(d3.stack().keys(categories)(data))
        .join("g")
        .attr("fill", d => {
                console.log(d)
                console.log(d.key)
                z(d.key)
            }
        )
        .selectAll("path")
        .data((d) => {
            console.log(d)
            return d})
        .join("path")
        .attr("d", arc);

    var arc = d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(d => y(d[0]))
        .outerRadius(d => y(d[1]))
        .startAngle(function(d) { return x(d.data.state); })
        .endAngle(function(d) { return x(d.data.state) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius)

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

}