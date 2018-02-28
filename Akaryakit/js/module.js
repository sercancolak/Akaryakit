var markers = L.markerClusterGroup();
var markerList = [];
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib }),
    map = new L.Map('map', { center: new L.LatLng(38.0619, 35.5), zoom: 7 }),
    drawnItems = L.featureGroup().addTo(map);
L.control.layers({
    'osm': osm.addTo(map),
    "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
        attribution: 'google'
    })
}, { 'drawlayer': drawnItems }, { position: 'topleft', collapsed: false }).addTo(map);
var featureGroup = new L.FeatureGroup();
map.addControl(new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        poly: {
            allowIntersection: false
        }
    },
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true
        }
    }
}));
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
});
map.on('draw:created', function (e) {

    var collection = drawnItems.toGeoJSON();
    console.log(collection);

});
map.on('draw:editing', function (e) {
    var collection2 = drawnItems.toGeoJSON();
    console.log(collection2);
});
map.on('draw:editing', function (e) {
    var collection2 = drawnItems.toGeoJSON();
    console.log(collection2);
});
var module = (function () {

    var sehir = function () {
        $(document).ready(function () {
            $.ajax({
                type: 'POST',
                url: '../api/Akaryakit/ComboSehirDoldur',
                datatype: "json",
                data: '',
                success: function (output) {
                    for (var i = 0; i < output.length; i++) {
                        $('#cmbSehir').append(new Option(output[i].Il + " " + output[i].count));
                    }
                },
                error: function (request, status, error) {
                    alert(error);
                }
            })
        });
    }
    var akaryakitGoster = function () {
        drawnItems.clearLayers();
        var sehir = document.getElementById('cmbSehir').value;
        var arr = sehir.split(" ");
        kordinat = {
            "Il": arr[0],
        };
        $.ajax({
            type: 'POST',
            url: '../api/Akaryakit/GosterSehir',
            datatype: "json",
            //content-type:"application/json",
            data: kordinat,
            success: function (output) {
                var ters = [];
                for (var i = 0; i < output.length; i++) {
                    ters[i] = output[i].Geo.coordinates;
                }
                if (output[0].Geo.type == "MultiPolygon") {
                    for (var i = 0; i < ters[0].length; i++) {
                        for (var j = 0; j < ters[0][i].length; j++) {
                            for (var k = 0; k < ters[0][i][j].length; k++) {
                                ters[0][i][j][k].reverse();
                            }
                        }
                    }
                    for (var l = 0; l < ters.length; l++) {
                        L.polygon(ters[0][l]).addTo(drawnItems);
                        //L.polygon(ters[l]).addTo(drawnItems).bindPopup(output.Mahalle + "<br>" + output.Name + "<br>" + output.Geo.type);
                        var ortalamalat;
                        var ortalamalng;
                        var count = 0;
                        var toplamlat = 0;
                        var toplamlng = 0;
                        for (var i = 0; i < ters[0].length; i++) {
                            for (var j = 0; j < ters[0][i].length; j++) {
                                toplamlat = toplamlat + ters[0][i][0][j][0];
                                toplamlng = toplamlng + ters[0][i][0][j][1];
                                count++;
                            }
                        }
                        ortalamalat = toplamlat / count;
                        ortalamalng = toplamlng / count;
                        map.setView(new L.LatLng(ortalamalat, ortalamalng), 8);
                    }
                }
                else if (output[0].Geo.type == "Polygon") {
                    for (var i = 0; i < ters[0].length; i++) {
                        for (var j = 0; j < ters[0][i].length; j++) {
                            ters[0][i][j].reverse();
                        }
                    }
                    L.polygon(ters[0]).addTo(drawnItems);
                    var ortalamalat;
                    var ortalamalng;
                    var count = 0;
                    var toplamlat = 0;
                    var toplamlng = 0;
                    for (var l = 0; l < ters[0].length; l++) {
                        toplamlat = toplamlat + ters[0][0][l][0];
                        toplamlng = toplamlng + ters[0][0][l][1];
                        count++;
                    }
                    ortalamalat = toplamlat / count;
                    ortalamalng = toplamlng / count;
                    map.setView(new L.LatLng(ortalamalat, ortalamalng), 8);
                }
            },
            error: function (request, status, error) {
                alert(error);
            }
        });
        $.ajax({
            type: 'POST',
            url: '../api/Akaryakit/Goster',
            datatype: "json",
            //content-type:"application/json",
            data: kordinat,
            success: function (output) {
                var ters = [];
                for (var i = 0; i < output.length; i++) {
                    ters[i] = output[i].Geo.coordinates;
                }
                for (var j = 0; j < ters.length; j++) {
                    ters[j].reverse();
                }
                function populate() {
                    for (var i = 0; i < ters.length; i++) {
                        var marker = L.marker(ters[i]).bindPopup(output[i].Ad);
                        markers.addLayer(marker);
                        markerList.push(marker);
                    }
                }
                populate();
                map.addLayer(markers);
            },
            error: function (request, status, error) {
                alert(error);
            }
        });
    }
    var ilceGoster = function () {

        var sehir = document.getElementById('cmbSehir').value;
        var arr = sehir.split(" ");
        kordinat = {
            "IlAdi": arr[0],
        };
        $.ajax({
            type: 'POST',
            url: '../api/Akaryakit/GosterIlce',
            datatype: "json",
            //content-type:"application/json",
            data: kordinat,
            success: function (output) {
               // drawnItems.clearLayers();
                var ters = [];
                for (var i = 0; i < output.length; i++) {
                    ters[i] = output[i].Geo.coordinates;
                }
                for (var o = 0; o < output.length; o++) {
                    if (output[o].Geo.type == "MultiPolygon") {
                        for (var i = 0; i < ters[o].length; i++) {
                            for (var j = 0; j < ters[o][i].length; j++) {
                                for (var k = 0; k < ters[o][i][j].length; k++) {
                                    ters[o][i][j][k].reverse();
                                }
                            }
                        }
                        for (var l = 0; l < ters.length; l++) {
                            L.polygon(ters[o][l]).addTo(drawnItems);
                            //L.polygon(ters[l]).addTo(drawnItems).bindPopup(output.Mahalle + "<br>" + output.Name + "<br>" + output.Geo.type);
                            var ortalamalat;
                            var ortalamalng;
                            var count = 0;
                            var toplamlat = 0;
                            var toplamlng = 0;
                            for (var i = 0; i < ters[o].length; i++) {
                                for (var j = 0; j < ters[o][i].length; j++) {
                                    toplamlat = toplamlat + ters[0][i][0][j][0];
                                    toplamlng = toplamlng + ters[0][i][0][j][1];
                                    count++;
                                }
                            }
                            ortalamalat = toplamlat / count;
                            ortalamalng = toplamlng / count;
                            map.setView(new L.LatLng(ortalamalat, ortalamalng), 8);
                        }
                    }
                    else if (output[o].Geo.type == "Polygon") {
                        for (var i = 0; i < ters[o].length; i++) {
                            for (var j = 0; j < ters[o][i].length; j++) {
                                ters[o][i][j].reverse();
                            }
                        }
                        L.polygon(ters[0]).addTo(drawnItems);
                        var ortalamalat;
                        var ortalamalng;
                        var count = 0;
                        var toplamlat = 0;
                        var toplamlng = 0;
                        for (var l = 0; l < ters[o].length; l++) {
                            toplamlat = toplamlat + ters[o][0][l][0];
                            toplamlng = toplamlng + ters[o][0][l][1];
                            count++;
                        }
                        ortalamalat = toplamlat / count;
                        ortalamalng = toplamlng / count;
                        map.setView(new L.LatLng(ortalamalat, ortalamalng), 8);
                    }
                }
    },
        error: function (request, status, error) {
            alert(error);
        }
});
        }
return {
    sehir: sehir,
    akaryakitGoster: akaryakitGoster,
    ilceGoster: ilceGoster
};
    })();
module.sehir();
document.getElementById('gosterSehir').onclick = function (e) {
    module.akaryakitGoster();
    module.ilceGoster();
}