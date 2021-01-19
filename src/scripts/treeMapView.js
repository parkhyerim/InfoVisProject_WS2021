// dimensitons and margins of the treemap
const margin = { top: 10, bottom: 10, left:10, right: 10 };
const width = 400 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#treemap_Viz")
        .append('svg')
            .attr('width', width)
            .attr('height', height)
            // .append('g')
            // .attr('transform', `translate(${margin.left},${margin.top})`);

var color = d3.scale.category10();

// Read json data
// temporal!!!! 
 d3.json('data/transports.json').then(data => {

    // join the data to rects
    const rects = svg.selectAll('rect')

    // Give the data to this cluster layout:
    var root = d3.hierarchy(data).sum(d => d.percentage).sort((a,b) => (b.percentage -a.percentage)) // Here the size of each leave is given in the 'value' field in input data

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height])
        .padding(2)
        (root)

    // use this information to add rectangles:
    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "IndianRed")
            .style("fill", "Salmon")

    // and to add the text labels
    svg.selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.name })
        .attr("font-size", "11px")
        .attr("fill", "white")
        // .attr("alignment-baseline", "center")   
    }
)



