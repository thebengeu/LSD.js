(function (window, document, L) {

var map = L.map('map').setView([51.505, -0.09], 9);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

})(window, document, window.L, window.localforage);