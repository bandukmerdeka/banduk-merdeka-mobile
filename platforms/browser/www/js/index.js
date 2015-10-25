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
            .factory('categoryService', ['$resource', categoryService])
            .factory('submittedReportService', ['$resource', submittedReportService])
            .controller('FrontController', ['$location', FrontController])
            .controller('CreateReportController', ['provinceService', 'categoryService', 'submittedReportService', '$location', CreateReportController])
            .controller('MapController', ['$location', MapController])
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
                })
                .when('/peta', {
                    templateUrl: 'map.html',
                    controller: 'MapController',
                    controllerAs: 'map'
                });
        }

        function provinceService($resource) {
            return $resource('http://bandukrelawanapi-gpratiknya.rhcloud.com/api/province', null, {})
        }

        function categoryService($resource) {
            return $resource('http://bandukrelawanapi-gpratiknya.rhcloud.com/api/category', null, {})
            //return $resource('http://localhost:3000/api/category', null, {})
        }

        function submittedReportService($resource) {
            //return $resource('http://bandukrelawanapi-gpratiknya.rhcloud.com/api/submittedReport', null, {})
            return $resource('http://localhost:3000/api/submittedReport', null, {})
        }

        function FrontController($location) {
            console.log('FrontController');
            var vm = this;
            vm.click = function (path) {
                $location.path(path);
            };
        }

        function CreateReportController(provinceService, categoryService, submittedReportService, $location) {
            console.log('CreateReportController');
            var vm = this;

            vm.showButtonMap = true;
            vm.provinces = [];
            vm.categories = [];

            vm.getProvinces = function () {
                console.log('getProvinces');
                var result = provinceService.get(
                    {},
                    function () {
                        vm.provinces = result.data;
                    });
            };

            var result = categoryService.get(
                {},
                function () {
                    vm.categories = result.data;
                });

            vm.send = function () {
                console.log('send');
                console.log(angular.toJson(vm));
                submittedReportService.save(
                    {},
                    angular.toJson(vm),
                    function () {
                        console.log('success');
                    },
                    function () {
                        console.log('error');
                    })
            };

            vm.openMap = function () {
                var div = document.getElementById("map_canvasi");
                var BANDUNG = new plugin.google.maps.LatLng(-6.9110363, 107.6057592);
                map = plugin.google.maps.Map.getMap(div, {
                    'camera': {
                        'latLng': BANDUNG,
                        'zoom': 12
                    }
                });
                getCurrentPosition();
                vm.showButtonMap = false;
            };

            function getCurrentPosition() {
                var onSuccess = function (position) {
                    mapGotoCurrentPosition(position, true);
                };
                function onError(error) {
                    console.log('onError');
                    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n')
                };
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }

            function mapGotoCurrentPosition(position, isDraggable) {
                vm.latitude = position.coords.latitude;
                vm.longitude = position.coords.longitude;
                var myPosition = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.addMarker({
                    'position': myPosition,
                    'draggable': isDraggable
                }, function (marker) {
                    map.setCenter(myPosition);
                    marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function (marker) {
                        marker.getPosition(function (latLng) {
                            marker.setTitle(latLng.toUrlValue());
                            marker.showInfoWindow();
                            vm.latitude = latLng.lat;
                            vm.longitude = latLng.lng;
                        });
                    });
                });
            }
            
            vm.gotoPage = function (path) {
                $location.path(path);
            };
        }

        function MapController($location) {
            var vm = this;
            vm.back = function (path) {
                $location.path(path);
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




    },
    drawMap: function () {
        /*const BANDUNG = new plugin.google.maps.LatLng(-6.9110363, 107.6057592);
        var div = document.getElementById("map_canvas");
        map = plugin.google.maps.Map.getMap(div, {
            'camera': {
                'latLng': BANDUNG,
                'zoom': 12
            }
        });*/
    }
};

app.initialize();