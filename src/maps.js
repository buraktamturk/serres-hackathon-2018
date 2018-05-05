
import 'js-map-label/src/maplabel.js';

module.exports = require('angular')
    .module('serres-hackathon-2018.maps', [
        require('angular-ui-router'),
        require('angular-moment')
    ])
    .directive('mapView', function ($parse) {
      'ngInject';

      return {
        restrict: 'E',
        template: `
          <div class="map_holder2"></div>
        `,
        scope: {
          data: '='
        },
        link(scope, element, $attr) {
          var mapElement = element.find(".map_holder2")[0];
          var infoWindow;

          var map = new google.maps.Map(mapElement, {});
          var markers = [];

          function update_places(places) {
            mapElement.style.display = 'block';

            for(var old_marker of markers) {
              old_marker.setMap(null);
            }

            markers = [];

            var bounds = new google.maps.LatLngBounds();
            for(var place of places) {
              var icon = {
                url: 'https://maps.gstatic.com/mapfiles/place_api/icons/civic_building-71.png',
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12, 25),
                scaledSize: new google.maps.Size(25, 25)
              };

              var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.location,
                label: place.name
              });

              if(place.name) {
                (function(place, marker) {
                  marker.addListener('click', function() {
                    if(infoWindow) {
                      infoWindow.close();
                    }

                    infoWindow = new google.maps.InfoWindow({
                        content: `<h3>${place.name}</h3>`
                    });

                    infoWindow.open(map, marker);
                  });
                })(place, marker);
              }

              markers.push(marker);

              bounds.extend(place.location);

              for(var connection of place.connections) {
                var connected_place = places.filter(a => a.name === connection)[0];

                var flightPath = new google.maps.Polyline({
                  path: [
                    connected_place.location,
                    place.location
                  ],
                  geodesic: true,
                  strokeColor: '#CCAA33',
                  strokeOpacity: 1.0,
                  strokeWeight: 3,
                  label: 'ASD'
                });

                var between = google.maps.geometry.spherical.interpolate(new google.maps.LatLng(connected_place.location), new google.maps.LatLng(place.location), 0.5);  
                
                new MapLabel({
                  text: '111km',
                  position: between,
                  map: map,
                  fontSize: 15,
                  align: 'left',
                });

                flightPath.setMap(map);
              }
            }
            
            map.fitBounds(bounds);
          }

          scope.$watch('data', (data) => {
            if(data) {
              update_places(data);
            }
          });
        }
      };
    })
    .name;
