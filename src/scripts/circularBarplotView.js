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

        console.log(dataByRegion);


        console.log(destinationData[0]["17.02.2020"])

        //calculate average value for every month
        for (let m=1; m<13; m++){

            // if clause to make the month value fitting to the formatting in the dataset
            if (m<10) month="0"+m;
            else month=m;

            for (let i=0; i< dataByRegion.length; i++){
                //since each month has a different number of days and the data has some gaps for two days we need to store the individual number of days each month in the variable div
                let div = 0;

                for (let d=1; d<32; d++){

                    // if clause to make the day value fitting to the formatting in the dataset
                    if (d<10) day="0"+d;
                    else day=d;

                    //format of the date stored in a variable
                    let s = "2020."+month+"."+day;
                    let currentmonth = dataByRegion[i][date];
                    currentmonth = currentmonth.substring(3, 4);
                    console.log(currentmonth)
                    while (month > currentmonth){
                        if (dataByRegion[i]["retail_and_recreation_percent_change_from_baseline"] !== undefined && dataByRegion["retail_and_recreation_percent_change_from_baseline"][s] !== "") {
                            div++;

                            if (dataByRegion[i][month]== null)
                                dataByRegion[i][month]= dataByRegion[i]["retail_and_recreation_percent_change_from_baseline"];

                            else {dataByRegion[i][month]= parseFloat(dataByRegion[i][month]) + parseFloat(dataByRegion[i]["retail_and_recreation_percent_change_from_baseline"]);}
                        }

                    }

                }

                dataByRegion[i][month]=(parseFloat(dataByRegion[i][month])/div).toFixed(2);
            }
        }
        console.log(dataByRegion);


        //generate TreeChart from the provided Dateset
      //  createTreeChart(mobilityData, monthparam)
    });
};

Displaydestinationdata();