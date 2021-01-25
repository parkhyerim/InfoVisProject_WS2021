export function Displaymobilitydata(selectedMonth, param="driving"){
    let mobilityData = [];
    let month, day;
    var temp = [];
    let monthparam = selectedMonth[0].substr((selectedMonth[0].indexOf("-")+1), 2);

    d3.csv('../src/data/Apple_mobility_shortened_german.csv').then(function(data){
        data.forEach(function(element) {
            if (element.country == "Germany" &&
            element["sub-region"] == "" &&
            element["transportation_type"]==param) {
                mobilityData.push(element);
            }
        });

        //calculate average value for every month
        for (let m=1; m<13; m++){

            // if clause to make the month value fitting to the formatting in the dataset
            if (m<10) month="0"+m;
            else month=m;

            for (let i=0; i< mobilityData.length; i++){
                //since each month has a different number of days and the data has some gaps for two days we need to store the individual number of days each month in the variable div
                let div = 0;

                for (let d=1; d<32; d++){

                // if clause to make the day value fitting to the formatting in the dataset
                if (d<10) day="0"+d;
                else day=d;

                //format of the date stored in a variable
                let s = "2020-"+month+"-"+day;

                    if (mobilityData[i][s] !== undefined && mobilityData[i][s] !== "") {
                        div++;
                        if (mobilityData[i][month]== null)
                            mobilityData[i][month]= mobilityData[i][s];

                        else {mobilityData[i][month]= parseFloat(mobilityData[i][month]) + parseFloat(mobilityData[i][s]);}
                    }
                }

                mobilityData[i][month]=(parseFloat(mobilityData[i][month])/div).toFixed(2);
            }
        }

        //generate TreeChart from the provided Dateset
        createTreeChart(mobilityData, monthparam)
    });
};

function createTreeChart(data, monthparam){

    var substring;

    //in case new treemap shall be loaded, the one before gets removed
    d3.select("#treemapwrapper").select("svg").remove();

    var margin = {top: 0, right: 30, bottom: 30, left: 30},
        width = 700 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    var svg = d3.select("#treemapwrapper")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 700 450")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", "translate(" +margin.left + "," + margin.top + ")");

    //Group the data by "Germany", so our tree has a root node
    let groupedData = data.reduce((k, v)=> {
        k[v.country] = [...k[v.country] || [], v];
        return k;
    }, {});

    //Transform the data grouped by "Germany" into a hiearchy by usind d3.js hierachy (first param is root, second param is child nodes
    var hgroup = d3.hierarchy(groupedData, function(d){return d.Germany})
        .sum((d) => {return d[monthparam]});

    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
    const treemap= d3.treemap()
        .size([width, height])
        .padding(4)
        (hgroup)

    // Determine the color of each field
    // Explanation from https://stackoverflow.com/questions/42546344/how-to-apply-specific-colors-to-d3-js-map-based-on-data-values?rq=1
    var color= d3.scale.linear()
                .domain([50, 180])
                .range(["#D29C1A", "#3C8863"]);

    var blName= data[0].region;
    //console.log(treemap.leaves());

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
            return color(d.data[monthparam]);});

    // and to add the text labels
      svg
        .selectAll("text")
        .data(treemap.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .each(function (d){
        substring = d.data.region.substring(0, d.data.region.indexOf("-")+1);
        if (substring == "")
            d3.select(this).text(d.data.region)
        else{
            d3.select(this).text(d.data.region.substring(0, d.data.region.indexOf("-")+1));
            d3.select(this).append('svg:tspan').attr('x', function(d){ return d.x0+5}).attr('dy', 20).text(d.data.region.substring(d.data.region.indexOf("-")+1, d.data.region.length))
        }
        })
        .attr("font-size", "14px")
        .attr("fill", "white")
        .append('svg:tspan')
        .attr('x', function(d){ return d.x0+5})
        .attr('dy', 30)
        .text(function(d){ return d.data[monthparam]+"%"})
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "white")
}