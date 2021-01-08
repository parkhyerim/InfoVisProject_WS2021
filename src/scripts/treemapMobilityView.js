// the entry point for the Bundesländer select ('chekbox' in index.html)
const checkboxes = document.getElementsByClassName('checkbox')
for (let checkbox of checkboxes){
  checkbox.addEventListener('change', function() {
      if(this.checked){
          displaymobilitydata(checkbox.name)
        //   console.log("Checked and the function is called");
      } else {
        //  console.log("unchecked");
      }
  }) 
}

function displaymobilitydata(param){
    // temporal: without checkbox selection, "Bavaria" is the default
    if(param ==null) var param = "Bavaria";
    let mobilityData = [];
    var temp = [];
    d3.csv('../src/data/applemobilitytrends.csv').then(function(data){
        data.forEach(element => temp.push(element));
        temp.forEach(function(element) {
            if (element.country == "Germany" && 
            element["sub-region"] == "" && 
            element["region"]==param) {
                mobilityData.push(element);
            }
        });

        //calculate average value for every month
        for (let m=1; m<13; m++){

            //since each month has a different number of days and the data has some gaps for two days we need to store the individual number of days each month in the variable div
            let div = 0;

            // if clause to make the month valuefitting to the formatting in the dataset
            if (m<10) month="0"+m;
            else month=m;

            for (let d=1; d<32; d++){

                // if clause to make the day value fitting to the formatting in the dataset
                if (d<10) day="0"+d;
                else day=d;

                //format of the date stored in a variable
                let s = "2020-"+month+"-"+day;

                mobilityData.forEach(function(element){
                    if (element[s] !== undefined && element[s] !== "") {
                        div++;
                        if (element[month]== null) 
                        element[month]= element[s];

                        else {element[month]= parseFloat(element[month]) + parseFloat(element[s]);}
                    }
                });
            }

            //div needs to be divided by 16 since it gets count up in the forEach loop for all 16 German regions
            div = div/16;

            mobilityData.forEach(function(element){
                element[month]=(parseFloat(element[month])/div).toFixed(2);
            });
        }

        //generate TreeChart from the provided Dateset
        createTreeChart(mobilityData)
    });
};

displaymobilitydata();

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


    //Transform the data grouped by "Germany" into a hiearchy by usind d3.js hierachy (first param is root, second param is child nodes
    var hgroup = d3.hierarchy(groupedData, function(d){
                                return d.Germany}
                                )
        .sum((d) => {return d["12"]});

    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
   const treemap= d3.treemap()
       .size([width, height])
       .padding(4)
      (hgroup)


    // Determine the color of each field
    // Explanation from https://stackoverflow.com/questions/42546344/how-to-apply-specific-colors-to-d3-js-map-based-on-data-values?rq=1
    var color= d3.scale.linear()
                .domain([400, 1000])
                .range(["Salmon", "IndianRed"]);

    // Add a opacity scale
    var opacity =d3.scaleLinear()
                .domain([400, 1000])
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
            return color(d.data["05"]);})
            .style("opacity", function(d) {
                return opacity(d.data["05"])
            });

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
            return "🚘 " + d.data.transportation_type +" "+ d.data["05"]+"%"; }
         else if(d.data.transportation_type === "walking"){
            return "🚶‍♀️ " + d.data.transportation_type +" "+ d.data["05"]+"%";
        } else if(d.data.transportation_type === "transit") {
            return "🚌 "+ d.data.transportation_type +" "+ d.data["05"]+"%";
        }})
        .attr("font-size", "18px")
        .attr("fill", "white")
}