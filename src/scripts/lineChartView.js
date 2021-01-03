// Set the dimensions of the canvas / graph
let casesData = [];
let testLandkreis = [];
function fetchDataCases(){
    fetch(
        'https://opendata.arcgis.com/datasets/dd4580c810204019a7b8eb3e0b329dd6_0.geojson',
        {
            method: 'GET'
        })
        .then(response => {
            return response.json()

        })
        .then(data => {
            var dateFeat = data.features;
            dateFeat.forEach(elem => {
                if(elem.properties.Bundesland == "Bayern" &
                    elem.properties.Geschlecht === "W" & elem.properties.AnzahlFall > 60 &
                    elem.properties.AnzahlFall < 75 & elem.properties.Altersgruppe === "A15-A34"){
                    casesData.push(elem.properties);
                }
            });

           // console.log(casesData[0]);
           // console.log(casesData[1]);

            visualiseChart(casesData);
        });
};

fetchDataCases();


function visualiseChart(data) {

    var formattedData = groupData(data);

    var margin = {top:10, right: 30, bottom: 30, left: 60},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;


    var svg = d3.select("#visualisationContainer")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);



    var xAxis = d3.scaleTime()
        .domain(d3.extent(data, d => getDate(d)))
        .range([0, width]);



    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xAxis));


    var yAxis = d3.scaleLinear()
        .domain([0, d3.max(data, item => Number(100))])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(yAxis));


    var curve = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "turquoise")
        .attr("stroke-width", 1)
        .attr("d", d3.line()
            .x(item => xAxis(getDate(item)))
            .y(item => yAxis(getCasesPerDay(formattedData, item)))
        );

    d3.select("#mySlider").on("change", function(d){
        selectedValue = this.value
        xAxis.domain([selectedValue, d3.max(data, item => Number(parseDate(item.Meldedatum)))])
            .range([0, width]);

        svg.select("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xAxis));

        curve.datum(data)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .x(item => xAxis(Number(12)))
                .y(item => yAxis(Number(3000)))
            );
    })
}

function groupData(data){
    casesPerDay = d3.group(data, d => d.Meldedatum);
    var mapAsc = new Map([...casesPerDay.entries()].sort());
    return mapAsc;
}


function getCasesPerDay(formattedDate, dailyData){
    // Map.prototype.get() returns the value associated to the key
    // Returned array consists of more than one value, because the data returns
    // several objects for the same date
    // one object then contains numbers for female, the other for male and the third one
    // for another age group

    const dataObjects = formattedDate.get(dailyData.Meldedatum);
    let sumDailyCaseNumbers = 0;
    dataObjects.forEach(elem => {
        sumDailyCaseNumbers += elem.AnzahlFall
    })

    //console.log(dailyData.Meldedatum + ' ' + sumDailyCaseNumbers)

    return sumDailyCaseNumbers;

    //return dataObjects[0].AnzahlFall

}

function getDate(d) {
    return new Date(d.Meldedatum);
}


function parseDate(date){
    var parseTime = d3.timeParse("%Y-%m-%d");
    var date = date.replaceAll("/", "-").slice(0, 10);
    var dateParsed = parseTime(date);
    return dateParsed;
}

