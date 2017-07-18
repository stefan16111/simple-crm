(function () {

    var app = angular.module('crmApp', ['ngRoute']);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

            $routeProvider
                    .when('/clients', {
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
})();