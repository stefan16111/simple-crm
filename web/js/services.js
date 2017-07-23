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
            };
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

    app.factory('timeline', ['$http', function ($http) {

            var helperOptions = {
                'phone': {
                    color: 'blue',
                    message: 'telefon do klienta'
                },
                'envelope-o': {
                    color: 'green',
                    message: 'wysyĹ‚ka maila do klienta'
                },
                'users': {
                    color: 'purple',
                    message: 'spotkanie z kilentem'
                },
                'file-text-o': {
                    color: 'red',
                    message: 'podpisanie umowy z klientem'
                }
            };
            var _timelineHelper = function (contactType, option) {
                return helperOptions[contactType][option];
            };

            var _getClientTimeline = function (clientId, callback) {
                callback = callback || function () {};
                return $http({
                    method: 'GET',
                    url: '/simple_crm/web/api.php/client/' + clientId + '/timeline'
                });
            };

            var _parseTimeline = function (timeline) {
                angular.forEach(timeline, function (element, index) {
                    element['contact_date'] = new Date(element['contact_date']);
                });
                return timeline;
            }
            return {
                parseTimeline: _parseTimeline,
                getClientTimeline: _getClientTimeline,
                getTimelineHelper: function () {
                    return _timelineHelper;
                }
            };
        }]);
})();

//'/simple_crm/web/api.php/clients'