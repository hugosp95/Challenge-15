//Creating the map object 
let myMap = L.map("map", {
    center:[40.7128,-74.0059],
    zoom: 3
});

//Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Link to the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function getMarkerSize(magnitude){
    return magnitude*5;
}

function getMarkerColor(depth){
    return depth > 90 ? 'red':
           depth > 70 ? 'orangered':
           depth > 50 ? 'orange':
           depth > 30 ? 'yellow':
           depth > 10 ? 'green':
           'lightgreen';
}
// Legends
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [0, 10, 30, 50, 70, 90];
    let labels = [];

    for (let i = 0; i < depths.length; i++) {
        let from = depths[i];
        let to = depths[i + 1];

        labels.push(
            '<i style="background:' + getMarkerColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to + ' km' : '+ km')
        );
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(myMap);

d3.json(link).then(function(data){
    L.geoJson(data,{
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng, {
                radius: getMarkerSize(feature.properties.mag),
                fillColor: getMarkerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(
                "Magnitude: " + feature.properties.mag + "<br>"+ "Depth: " + feature.geometry.coordinates[2] + "km" +  "<br>" + "Location: " + feature.properties.place 
            );
        }
    }).addTo(myMap);
});