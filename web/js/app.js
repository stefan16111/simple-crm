(function () {

    var app = angular.module('crmApp', ['ngRoute', 'crmService', 'ngMessages']);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

            $routeProvider
                    .when('/clients', {
                        controller: 'ClientsListCtrl',
                        templateUrl: 'views/clients-list.html'
                    })
                    .when('/clients/:clientId', {
                        controller: 'ClientDetailCtrl',
                        templateUrl: 'views/client-details.html'
                    })
                    .when('/sectors', {
                        templateUrl: 'views/sectors-list.html'
                    })
                    .when('/users', {
                        templateUrl: 'views/users-list.html'
                    })
                    .otherwise({
                        redirectTo: '/clients'
                    });

            $locationProvider.html5Mode(true).hashPrefix('');
        }]);

    app.controller('ClientsListCtrl', ['$scope', 'clients', 'users', 'sectors', function ($scope, clients, users, sectors) {
            $scope.clients = [];
            $scope.users = [];
            $scope.sectors = [];

            $scope.orderByColumn = 'id';
            $scope.orderByDir = false;

            $scope.filterBy = {};

            clients.getClients(function (clients) {
                $scope.clients = clients.data;
            });

            users.getUsers(function (users) {
                $scope.users = users.data;
            });

            sectors.getSectors(function (sectors) {
                $scope.sectors = sectors.data;
            });

            $scope.changeOrder = function (columnName) {
                if ($scope.orderByColumn == columnName) {
                    $scope.orderByDir = !$scope.orderByDir;
                } else {
                    $scope.orderByColumn = columnName;
                    $scope.orderByDir = false;
                }
            };

            $scope.isOrderedBy = function (columnName) {
                return ($scope.orderByColumn == columnName);
            };
            $scope.orderedReverse = function () {
                return !$scope.orderByDir;
            };
        }]);

    app.controller('ClientDetailCtrl', ['$scope', 'clients', 'users', 'sectors', '$routeParams', '$timeout', 'timeline',
        function ($scope, clients, users, sectors, $routeParams, $timeout, timeline) {

            $scope.client = {};
            $scope.clientNotFound = false;
            $scope.users = [];
            $scope.sectors = [];
            $scope.showSaveClientFormMsg = false;
            $scope.timeline = [];
            $scope.timelineHelper = timeline.getTimelineHelper();
            console.log($scope.timelineHelper);
            clients.getClient($routeParams.clientId)
                    .then(
                            function (success) {
                                $scope.client = success.data;

                                timeline.getClientTimeline($scope.client.id)
                                        .then(
                                                function (success) {
                                                    timeline = timeline.parseTimeline(success.data);
                                                    $scope.timeline = timeline;
                                                });

                            },
                            function (error) {
                                if (404 == error.status) {
                                    $scope.clientNotFound = true;
                                }
                            }
                    );

            users.getUsers(function (users) {
                $scope.users = users.data;
            });

            sectors.getSectors(function (sectors) {
                $scope.sectors = sectors.data;
            });

            $scope.saveClientData = function () {
                if ($scope.clientForm.$invalid)
                    return;

                clients.updateClient($scope.client.id, $scope.client)
                        .then(
                                function (success) {
                                    $scope.showSaveClientFormMsg = true;

                                    $timeout(function () {
                                        $scope.showSaveClientFormMsg = false;
                                    }, 5000);
                                    //console.log(success.data);
                                },
                                function (error) {
                                    console.log(error);
                                }
                        );
            };



        }]);
})();