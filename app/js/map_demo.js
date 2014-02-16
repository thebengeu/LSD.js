(function () {
  LSD.init({
    shardingFunction: function (key) {
      var keyArr = key.split('/');
      var zoom = keyArr[3];
      var x = parseInt(keyArr[4]);
      var y = parseInt(keyArr[5].split('.')[0]);

      return zoom + '-' + (parseInt(x / 50) * 50) + '-' + (parseInt(y / 50) * 50);
    }
  }, function () {
    var map = L.map('map').setView([1.28251, 103.85104], 10);

    var hello = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    hello.addTo(map);

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
    console.log(map);
    map.on('zoomend', getAllAround);
    map.on('click', onMapClick);




    var data = [];
    var totalPoints = 100;
    var updateInterval = 1000;
    var now = new Date().getTime();

    function GetData() {
      var newLength = LSD.getShardLengths();
      var current = 0;
      for (i in newLength) {
        current += newLength[i];
      }

      if (data.length >= 100) {
        data.shift(); //to remove first item of array
      }
      var temp = [now += updateInterval, current]; //data format [x, y]

            data.push(temp);
    }

      $(document).ready(function () {
          GetData();

          dataset = [
          { label: "Memory", data: data, color: "#00FF00" }
          ];
          var options = {
            series: {
              lines: {
                show: true,
                lineWidth: 1.2,
                fill: true
              }
            },
            xaxis: {
              mode: "time",
              tickSize: [1, "second"],
              tickFormatter: function (v, axis) {
                return "";
              },
              axisLabel: "Time",
              axisLabelUseCanvas: true,
              axisLabelFontSizePixels: 9,
              axisLabelFontFamily: 'Verdana, Arial',
              axisLabelPadding: 10
            },
            yaxis: {
              min: 0,
          //max: 100,                         
          tickFormatter: function (v, axis) {
            if (v % 10 == 0) {
              return v;
            } else {
              return "";
            }
          },
          axisLabel: "Total Memory",
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Verdana, Arial',
          axisLabelPadding: 6
        },
        legend: {        
          labelBoxBorderColor: "#fff"
        },
        grid: {                
          backgroundColor: "#000000",
          tickColor: "#008040"
        }
      };
      $.plot($("#graph"), dataset, options);

      function update() {
        GetData();

        $.plot($("#graph"), dataset, options)
        setTimeout(update, updateInterval);
      }

      update();
    });
  });
})();
