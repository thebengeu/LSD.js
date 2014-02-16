(function () {
  var map = L.map('map').setView([37.4349, -122.1644], 11);

  var hello = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }, function () {
    this.addTo(map);
  });

  function doSomething(e) {
    var search = document.getElementById('search').value;
  }

  var marker = [];
  function onMapClick(e) {

    if(marker.length != 0) {
      for (var i = 0; i < marker.length; i++) {
        map.removeLayer(marker[i]);
      }
    }

    //Extend the Default marker class
    var RedIcon = L.Icon.Default.extend({
      options: {
        iconUrl: 'images/marker-icon-red.png',
        shadowUrl: 'images/marker-shadow.png'
      }
    });
    var redIcon = new RedIcon();

    var BlueIcon = L.Icon.Default.extend({
      options: {
        iconUrl: 'images/marker-icon.png',
        shadowUrl: 'images/marker-shadow.png'
      }
    });
    var blueIcon = new BlueIcon();

    var tmpMarker = new L.marker(e.latlng, {icon: redIcon});
    tmpMarker.bindPopup("You clicked the map at " + e.latlng.toString());
    marker.push(tmpMarker);
    map.addLayer(tmpMarker);

    //map.removeLayer(marker);
    //marker = new L.marker(e.latlng);
    //map.addLayer(marker);
    //marker.bindPopup("You clicked the map at " + e.latlng.toString());
    //marker.openPopup();

    //L.marker(e.latlng).addTo(map)
    //.bindPopup("You clicked the map at " + e.latlng.toString()).openPopup();

    Yelp.setCredentials(
      "sy_dqaaRlT6u_-Ilez-qyA",
      "wwZjPzhHV1g5lj8TCB7daluc1l8",
      "xk3agjfaF7pttsF-XmbVT9PjodN5fXiO",
      "3Ejttk8-u56maYxZ3aP02ebMuWs"
    );

    Yelp.query(e.latlng['lat'] , e.latlng['lng'], 'food', getNearby);
    function getNearby(data){
      for (var i in data['businesses']){
        var tmpLat = data['businesses'][i]['location']['coordinate']['latitude'];
        var tmpLong = data['businesses'][i]['location']['coordinate']['longitude'];
        var tmpMarker = new L.marker([tmpLat, tmpLong], {icon: blueIcon});
        tmpMarker.bindPopup(data['businesses'][i]['name']);
        marker.push(tmpMarker);
        map.addLayer(tmpMarker);
      }
    }
  } //End of onMapClick()

  function cacheMap(e) {
    hello.preCache();
    alert("Cached!");
  }

  $('#myModal').on('show', function(){console.log(LSD.getShardLengths());});


  $('.cache-me').click(cacheMap);

  function getAllAround(e) {
    Yelp.setCredentials(
      "sy_dqaaRlT6u_-Ilez-qyA",
      "wwZjPzhHV1g5lj8TCB7daluc1l8",
      "xk3agjfaF7pttsF-XmbVT9PjodN5fXiO",
      "3Ejttk8-u56maYxZ3aP02ebMuWs"
    );
    var points = hello.getTileCoords();
    for (var j in points) {
      Yelp.query(points[j]['lat'], points[j]['lon'], 'food', getNearby);
      function getNearby(data){
        console.log(data);
      }
    }
  }

  map.on('zoomend', getAllAround);
  map.on('click', onMapClick);
})();
