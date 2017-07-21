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
            var _getClient = function (clientId, callback) {
                callback = callback || function () {};
                return $http({
                    method: 'GET',
                    url: '/simple_crm/web/api.php/client/' + clientId
                });
            };

            var _updateClient = function (clientId, clientData, callback) {
                callback = callback || function () {};

                return $http({
                    method: 'PUT',
                    url: '/simple_crm/web/api.php/client/' + clientId,
                    data: clientData
                });
            }
            return {
                getClients: _getClients,
                getClient: _getClient,
                updateClient: _updateClient
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