
//wir könnten die Daten entweder in json in eine funktion schreiben oder über die API abrufen(?!) 

fetch(
    'https://opendata.arcgis.com/datasets/ef4b445a53c1406892257fe63129a8ea_0.geojson',
    {
        method: 'GET'
    })
    .then(response => {
        return response.json()
    
    })
    .then(json => {
       var data = json.features
       console.log (data);

    })
   