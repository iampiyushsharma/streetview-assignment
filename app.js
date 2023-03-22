// create map
var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([0, 0]),
      zoom: 2
    })
  });
  
// add vector layer for points
var vectorSource = new ol.source.Vector();
var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 0, 0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ff0',
        width: 2
      })
    })
  })
});
map.addLayer(vectorLayer);

fetch('coordinates.txt')
  .then(response => response.text())
  .then(text => {
    var rows = text.trim().split('\n');
   // console.log(rows);
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i].trim().split(/\s+/);
     // console.log(row);
      var coords = ol.proj.fromLonLat([parseFloat(row[2]), parseFloat(row[3])]);
      var url = row[0].replace('./', ''); // remove the ./ characters
      var feature = new ol.Feature({
        geometry: new ol.geom.Point(coords),
        url: row[0]
      });
      vectorSource.addFeature(feature);
    }
  });



var panorama = new PANOLENS.ImagePanorama('images/HMTpano_000001_000008.jpg');
var viewer = new PANOLENS.Viewer({
  container: document.getElementById('panorama')
});
viewer.add(panorama);

map.on('click', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      return feature;
    });
      var imageUrl = 'images/'+feature.get('url').replace('./', '').replace('"','').replace('"','');;
      var np = new PANOLENS.ImagePanorama(imageUrl);
      viewer.dispose();
      viewer.add(np)
    }
  );
  


  