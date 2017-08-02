///Google Mao API

function initMap() {
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 28.7041 , lng: 77.1025},
        scrollwheel: false,
        zoom: 6
    });
    var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(
        input, {placeIdOnly: true});
    autocomplete.bindTo('bounds', map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var geocoder = new google.maps.Geocoder;
    var marker = new google.maps.Marker({
        map: map
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete.getPlace();


        if (!place.place_id) {
            return;
        }
        geocoder.geocode({'placeId': place.place_id}, function(results, status) {

            if (status !== 'OK') {
                window.alert('Geocoder failed due to: ' + status);
                return;
            }
            map.setZoom(11);
            map.setCenter(results[0].geometry.location);
            // Set the position of the marker using the place ID and location.
            marker.setPlace({
                placeId: place.place_id,
                location: results[0].geometry.location
            });

            var city = place.name.split(',')[0];

            infoContent(city);
            marker.addListener('click', function() {
                infoContent(city)
            });

            function infoContent(city1) {
                $.get('http://api.openweathermap.org/data/2.5/weather?q='+city1+',in&APPID=7e3f0772cc9fd0ac421d526ec44cd9ac',function(result) {
                    // console.log(result);
                    marker.setVisible(true);
                    infowindowContent.children['place-name'].textContent = place.name;
                    infowindowContent.children['temp'].textContent = (parseFloat(result.main.temp) - 273.15).toPrecision(3);
                    infowindowContent.children['humidity'].textContent = result.main.humidity;
                    infowindowContent.children['wind'].textContent = (parseFloat(result.wind.speed) * (18 / 5)).toPrecision(3);
                    infowindow.open(map, marker);
                });
            }
        });
    });

    google.maps.event.addListener(map, "click", function (e) {
        infowindow.close();
        // console.log(e.latLng.lat()+' '+e.latLng.lng());
        var marker = new google.maps.Marker({
            map: map,
            position: {lat:e.latLng.lat(),lng:e.latLng.lng()},
        });

        infoContent(e.latLng.lat(),e.latLng.lng());

        marker.addListener('click', function() {
            infoContent(e.latLng.lat(),e.latLng.lng());
        });


        function infoContent(lat,lng) {
            $.get('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&APPID=7e3f0772cc9fd0ac421d526ec44cd9ac',function(result){
                // console.log(result);
                marker.setVisible(true);
                infowindowContent.children['place-name'].textContent = result.name+', India';
                infowindowContent.children['temp'].textContent = (parseFloat(result.main.temp)-273.15).toPrecision(3);
                infowindowContent.children['humidity'].textContent =result.main.humidity;
                infowindowContent.children['wind'].textContent = (parseFloat(result.wind.speed)*(18/5)).toPrecision(3) ;
                infowindow.open(map, marker);
            });
        }

    });

}
