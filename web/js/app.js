(function () {

    var app = angular.module('crmApp', ['ngRoute', 'crmService']);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

            $routeProvider
                    .when('/clients', {
                        controller: 'ClientsListCtrl',
                        templateUrl: 'views/clients-list.html'
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

})();