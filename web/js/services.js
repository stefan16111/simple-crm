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
})();

//'/simple_crm/web/api.php/clients'