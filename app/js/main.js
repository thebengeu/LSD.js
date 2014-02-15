var storages = [];

var protocol = window.location.protocol;
var host = location.host;

for (var i = 0; i < 100; i++) {
  var domain = protocol + '//' + i + '.' + host;
  (function () {
    var c = new CrossDomainStorage(domain, '/LSD.html');
    storages.push(c);
    c.setItem('index', i, function () {
      c.getItem('index', function (value) {
        console.log(value);
      });
    });
  })();
}
