// Adding tile layer to the map
var quakeMap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
     tileSize: 512,
     maxZoom: 18,
     zoomOffset: -1,
     id: "mapbox/light-v10",
     accessToken: API_KEY
   });

// var info = L.control({
//     position: "bottomright"
//   }).addTo(map);

var layers={
   d0_50: new L.LayerGroup(),
   d51_100: new L.LayerGroup(),
   d101_300: new L.LayerGroup(),
   d300up: new L.LayerGroup()
};

// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 2,
  layers:[
    layers.d0_50,
    layers.d51_100,
    layers.d101_300,
    layers.d300up
  ]
});

quakeMap.addTo(myMap);

var overlays={
  "Under 50": layers.d0_50,
  "51 to 100": layers.d51_100,
  "101 to 300": layers.d101_300,
  "Over 300":layers.d300up
};

L.control.layers(null,overlays).addTo(myMap);

var info=L.control({
    position:"bottomright"
});

info.onAdd=function() {
  var div=L.DomUtil.create("div","legend");
  return div;
};
info.addTo(myMap);

var depthScale={
  d0_50: L.circle(color="green"),
  d51_100: L.circle(color="yellow"),
  d101_300: L.circle(color="orange"),
  d300up: L.circle(color="red")
 };

// Perform an API call to the Citi Bike Station Information endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", function(quakeData) {

console.log(quakeData);
var markers=L.markerClusterGroup();

var depth_count={
  d0_50:0,
  d51_100:0,
  d101_300:0,
  d300up:0
};

var depthCode;

// Loop through data
for (var i = 0; i < quakeData.features.length; i++) {

  // Set the data location property to a variable
  var location = quakeData.features[i].geometry;
  //console.log(location);

  var mag=quakeData.features[i].properties.mag*50000;
  //console.log(mag);

  var depth=location.coordinates[2];

  if (depth <= 50) {
    depthCode="d0_50";
    color="green";
  }
  else if (depth <=100){
    depthCode="d51_100";
    color="yellow";
  }
  else if (depth <=300){
    depthCode="d101_300";
    color="orange";
  }
  else {
    depthCode="d300up";
    color="red";
  } 
  depth_count[depthCode]++;
  console.log(depth_count);
  //console.log(depthCode);
  var desc=quakeData.features[i].properties.place;
  console.log(depthCode+" "+color+" "+desc);
  var newMarker=L.circle([location.coordinates[1],location.coordinates[0]],{
      radius:mag,
      color:color})
      .bindPopup(desc);

  newMarker.addTo(layers[depthCode]);


    // Add a new marker to the cluster group and bind a pop-up
    // markers.addLayer(L.circle([location.coordinates[1], location.coordinates[0]],{
    //     radius: mag,
    //     color: depthScale[depthCode],
    //     fillOpacity: depth}).bindPopup(desc))
    //    ;
  updateLegend(depth_count);
  }


//myMap.addLayer(markers);
//myMap.addLayer(newMarker);
});

function updateLegend (depth_count) {
  document.querySelector(".legend").innerHTML=[
      "<p class='d0_50' style='color:green'> Depth <= 50: "+depth_count.d0_50 + "</p>",
      "<p class='d51_100' style='color:yellow'>Depth 51-100: "+depth_count.d51_100 + "</p>",
      "<p class='d101-300' style='color:orange'>Depth 101-300: "+depth_count.d101_300 + "</p>",
      "<p class='d301up' style='color:red'>Depth >300: "+depth_count.d300up + "</p>"]
      .join("");
  
}

    // // Call the updateLegend function, which will... update the legend!
    // updateLegend(updatedAt, stationCount);
//});

