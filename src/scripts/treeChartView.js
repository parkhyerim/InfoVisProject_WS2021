let mobilityData = [];
var temp = [];


function displaymobilitydata(){
    d3.csv('../src/data/applemobilitytrends.csv').then(function(data){
        data.forEach(element => temp.push(element));
        temp.forEach(function(element) {
            if (element.country == "Germany" && element["sub-region"] == "" ){
                mobilityData.push(element)
            }
        });
        console.log(mobilityData);
        createTreeChart(mobilityData)
    });


    //d3.csv('../src/data/applemobilitytrends.csv').then(data => console.log(data));
};

displaymobilitydata();

function createTreeChart(data){

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#treemapwrapper")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" +margin.left + "," + margin.top + ")");

//Group the data by "Germany", so our tree has a root node
let groupedData = data.reduce((k, v)=> {
   // console.log(k);
  //  console.log(v);
    k[v.country] = [...k[v.country] || [], v];
    return k;

}, {});

//Transform the data grouped by "Germany" into a hiearchy by usind d3.js hierachy (first param is root, second param is child nodes
var hgroup = d3.hierarchy(groupedData, function(d){return d.Germany})
    .sum((d) => {return d["2020-05-16"]});
console.log(hgroup);
console.log(hgroup.descendants());
console.log(hgroup.leaves());


 //  var root = d3.stratify()
  //.id(function(d) { return d.region; })   // Name of the entity (column name is name in csv)
    //    .parentId(function(d) { return d.data.Germany; })   // Name of the parent (column name is parent in csv)
   //    (hgroup);
 //  console.log(root);
   // root.sum(function(d) { return +d.value })

    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
   const treemap= d3.treemap()
       .size([width, height])
       .padding(4)
      (hgroup)

    console.log(treemap);

    // use this information to add rectangles:
    svg
        .selectAll("rect")
        .data(hgroup)
        .enter()
        .append("rect")
        .attr("id", (d) =>{return d.id;})
        .attr('x', function (d) { return d.x0; })
       .attr('y', function (d) { return d.y0})
       .attr('width', function (d) { return d.x1 - d.x0; })
       .attr('height', function (d) { return d.y1 - d.y0})
        .style("stroke", "black")
        .style("fill", "#69b3a2");

    // and to add the text labels
    svg
        .selectAll("text")
        .data(hgroup.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.region + d.data["2020-05-16"]})
        .attr("font-size", "15px")
        .attr("fill", "white")





}