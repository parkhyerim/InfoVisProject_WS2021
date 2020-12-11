

window.onload = function(){
var http =  new XMLHttpRequest();
http.open("GET", "https://opendata.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0.geojson");
http.send(); 
};