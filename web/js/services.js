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
            var _saveNewClient = function (clientData, callback) {
                callback = callback || function () {};
                return $http({
                    method: 'POST',
                    url: '/simple_crm/web/api.php/client',
                    data: clientData
                });
            };
            var _deleteClient = function (clientId) {

                return $http({
                    method: 'DELETE',
                    url: '/simple_crm/web/api.php/client/' + clientId
                });
            };
            return {
                getClients: _getClients,
                getClient: _getClient,
                updateClient: _updateClient,
                deleteClient: _deleteClient,
                saveNewClient: _saveNewClient
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
    app.factory('time', ['$http', function ($http) {

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
            var eventTypes = [
                {
                    value: 'phone',
                    name: 'Kontakt telefoniczny'
                },
                {
                    value: 'envelope-o',
                    name: 'Kontakt mailowy'
                },
                {
                    value: 'users',
                    name: 'Spotkanie'
                },
                {
                    value: 'file-text-o',
                    name: 'Podpisanie umowy'
                }
            ];
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
            };
            var _addTimelineEvent = function (clientId, eventData, callback) {
                callback = callback || function () {};
                return $http({
                    method: 'POST',
                    url: '/simple_crm/web/api.php/client/' + clientId + '/timeline',
                    data: eventData
                });
            };
            return {
                parseTimeline: _parseTimeline,
                getClientTimeline: _getClientTimeline,
                getTimelineHelper: function () {
                    return _timelineHelper;
                },
                getEventsType: function () {
                    return eventTypes;
                },
                addTimelineEvent: _addTimelineEvent
            };
        }]);
})();
//'/simple_crm/web/api.php/clients'