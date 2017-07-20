(function () {

    var app = angular.module('crmService', []);

    app.factory('clients', ['$http', function ($http) {

            var _getClients = function (callback) {

                callback = callback || function () {};

                $http({
                    method: 'GET',
                    url: '/simple_crm/web/api.php/clients'
                }).then(function (data) {
                    callback(data);
                }, function (error) {
                    console.log(error);
                });
            };
            return {
                getClients: _getClients
            };
        }]);
    
        app.factory('users', ['$http', function ($http) {

            var _getUsers = function (callback) {

                callback = callback || function () {};

                $http({
                    method: 'GET',
                    url: '/simple_crm/web/api.php/users'
                }).then(function (data) {
                    callback(data);
                }, function (error) {
                    console.log(error);
                });
            };
            return {
                getUsers: _getUsers
            };
        }]);
    
        app.factory('sectors', ['$http', function ($http) {

            var _getSectors = function (callback) {

                callback = callback || function () {};

                $http({
                    method: 'GET',
                    url: '/simple_crm/web/api.php/company-sectors'
                }).then(function (data) {
                    callback(data);
                }, function (error) {
                    console.log(error);
                });
            };
            return {
                getSectors: _getSectors
            };
        }]);
})();

//'/simple_crm/web/api.php/clients'