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
        //console.log('Received Event: ' + id);
    },
    bootstrapAngular: function () {

        angular.module('banduk', ['ngMaterial', 'ngResource', 'ngRoute'])
            .config(config)
            .factory('provinceService', ['$resource', provinceService])
            .controller('FrontController', ['$location', FrontController])
            .controller('CreateReportController', ['provinceService', CreateReportController])
            .controller('NavController', ['$mdSidenav', NavController])
            .controller('FormPersonRegistrationController', ['provinceService', FormPersonRegistrationController]);

        angular.element(document).ready(function () {
            angular.bootstrap(document, ['banduk']);
        });

        function config($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'frontpage.html',
                    controller: 'FrontController',
                    controllerAs: 'front'
                })
                .when('/lapor', {
                    templateUrl: 'reportForm.html',
                    controller: 'CreateReportController',
                    controllerAs: 'createReport'
                });
        }

        function provinceService($resource) {
            return $resource('http://bandukrelawanapi-gpratiknya.rhcloud.com/api/provinsi', null, {})
        }

        function FrontController($location) {
            console.log('FrontController');
            var vm = this;
            vm.click = function (path) {
                console.log('click');
                $location.path(path);
            };
        }

        function CreateReportController(provinceService) {
            console.log('CreateReportController');
            var vm = this;
            vm.provinces = [];
            var result = provinceService.get(
                {},
                function () {
                    vm.provinces = result.data;
                });
            console.log(result);
            vm.lapor = function () {
                console.log('lapor');
            };
        }


        function FormPersonRegistrationController(provinceService) {
            var vm = this;
            vm.provinces = [];
            var result = provinceService.get(
                {},
                function () {
                    vm.provinces = result.data;
                });
            vm.action = function () {
                console.log('action');

            };
        }

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
                $mdSidenav('left').close().then(function () {
                    map.setClickable(true);
                });

                var onSuccess = function (position) {
                    mapGotoCurrentPosition(position, false);
                };
                function onError(error) {
                    console.log('onError');
                    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n')
                };
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            };
            vm.setMarking = function () {
                $mdSidenav('left').close().then(function () {
                    map.setClickable(true);
                });

                var onSuccess = function (position) {
                    mapGotoCurrentPosition(position, true);
                };
                function onError(error) {
                    console.log('onError');
                    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n')
                };
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            };
        }

        function mapGotoCurrentPosition(position, isDraggable) {
            var myPosition = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.addMarker({
                'position': myPosition,
                'draggable': isDraggable
            }, function (marker) {
                map.setCenter(myPosition);
            });
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