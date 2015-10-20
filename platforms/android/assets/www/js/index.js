/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var map;
var mapClickable;
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        app.bootstrapAngular();
        app.drawMap();

        // Initialize the map view
      

        // Wait until the map is ready status.
        //map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
        
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/

        console.log('Received Event: ' + id);
    },
    bootstrapAngular: function () {

        angular.module('banduk', ['ngMaterial'])
            .controller('NavController', ['$mdSidenav', NavController]);

        angular.element(document).ready(function () {
            angular.bootstrap(document, ['banduk']);
        });

        function NavController($mdSidenav) {
            var vm = this;
            vm.sideMenu = function () {
                $mdSidenav('left')
                    .toggle()
                    .then(function () {
                        map.setClickable(false);
                        mapClickable = false;
                    });
            };
            vm.getMyPosition = function () {
                console.log('getCurrentPosition');
                
                $mdSidenav('left').close().then(function() {
                    map.setClickable(true);
                });
                
                var onSuccess = function (position) {
                    console.log('onSuccess');
                    var myPosition = new plugin.google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    map.addMarker({
                        'position': myPosition,
                        'title': "Anda di sini"
                    }, function (marker) {
                        marker.showInfoWindow();
                        map.setCenter(myPosition);
                    });
                    /*alert(
                        'Latitude: ' + position.coords.latitude + '\n' +
                        'Longitude: ' + position.coords.longitude + '\n' +
                        'Altitude: ' + position.coords.altitude + '\n' +
                        'Accuracy: ' + position.coords.accuracy + '\n' +
                        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                        'Heading: ' + position.coords.heading + '\n' +
                        'Speed: ' + position.coords.speed + '\n' +
                        'Timestamp: ' + position.timestamp + '\n');*/
                };
                function onError(error) {
                    console.log('onError');
                    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n')
                };
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            };
        }
    },
    drawMap: function () {

        const BANDUNG = new plugin.google.maps.LatLng(-6.9110363, 107.6057592);
        var div = document.getElementById("map_canvas");
        map = plugin.google.maps.Map.getMap(div, {
            'camera': {
                'latLng': BANDUNG,
                'zoom': 12
            }
        });
    }
};

app.initialize();