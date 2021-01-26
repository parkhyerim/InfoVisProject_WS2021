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

               let dest = 'retail_and_recreation_percent_change_from_baseline'
               currentmonth = currentmonth.substring(5, 7);
                   if (newarray[destinationData[i].sub_region_1] == undefined) {
                       newarray[destinationData[i].sub_region_1] = {}
                       counterarray[destinationData[i].sub_region_1] = {}
                   }
                   if (newarray[destinationData[i].sub_region_1][currentmonth]!== undefined){
                       newarray[destinationData[i].sub_region_1][currentmonth] += parseFloat(destinationData[i][dest])
                       counterarray[destinationData[i].sub_region_1][currentmonth] +=1
                   }
                   else {
                       newarray[destinationData[i].sub_region_1][currentmonth] = parseFloat(destinationData[i][dest])
                       counterarray[destinationData[i].sub_region_1][currentmonth] =1
                   }
       }


       for (var prop in newarray){
           for (month in newarray[prop]){
               newarray[prop][month] = (parseFloat(newarray[prop][month]) / parseFloat(counterarray[prop][month])).toFixed(2)
           }
       }
    });

};

Displaydestinationdata();