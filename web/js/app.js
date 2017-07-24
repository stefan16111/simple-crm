(function () {

    var app = angular.module('crmApp', ['ngRoute', 'crmService', 'ngMessages']);

    app.config(['$routeProvider', '$locationProvider', '$qProvider', function ($routeProvider, $locationProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
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

            $scope.addEvent = function () {

                if ($scope.eventForm.$invalid)
                    return;

                timeline.addTimelineEvent($scope.client.id, $scope.timelineEvent, function (timeline) {
                    $scope.timeline = timeline;
                    $scope.timelineEvent = {};

                    $scope.newEventCreatedMsg = true;
                    $scope.eventForm.$setUntouched();
                    $scope.eventForm.$submitted = false;

                    $timeout(function () {
                        $scope.newEventCreatedMsg = false;
                    }, 5000);
                });

            };
        }]);

    app.controller('ClientDetailCtrl', ['$scope', 'clients', 'users', 'sectors', '$routeParams', '$timeout', 'time', '$location',
        function ($scope, clients, users, sectors, $routeParams, $timeout, time, $location) {

            $scope.client = {};
            $scope.users = [];
            $scope.sectors = [];

            $scope.timeline = [];
            $scope.timelineHelper = time.getTimelineHelper();
            $scope.timelineEvent = {};
            $scope.eventTypes = time.getEventsType();
            $scope.newEventCreatedMsg = false;

            $scope.clientNotFound = false;
            $scope.showSaveClientFormMsg = false;

            if ('new' !== $routeParams.clientId) {

                clients.getClient($routeParams.clientId)
                        .then(
                                function (success) {
                                    $scope.client = success.data;

                                    time.getClientTimeline($scope.client.id)
                                            .then(
                                                    function (success) {
                                                        timeline = time.parseTimeline(success.data);
                                                        $scope.timeline = timeline;
                                                    });
                                },
                                function (error) {
                                    if (404 == error.status) {
                                        $scope.clientNotFound = true;
                                    }
                                }
                        );
            }

            users.getUsers(function (users) {
                $scope.users = users.data;
            });

            sectors.getSectors(function (sectors) {
                $scope.sectors = sectors.data;
            });

            $scope.saveClientData = function () {
                if ($scope.clientForm.$invalid)
                    return;
                
                if ('new' === $routeParams.clientId) {

                    clients.saveNewClient($scope.client)
                            .then(
                                    function () {
                                        console.log($scope.client);
                                        $location.path('/simple_crm/web/api.php/client/' + $scope.client.id);
                                    });
                } else {
                    clients.updateClient($scope.client.id, $scope.client)
                            .then(
                                    function () {
                                        $scope.showSaveClientFormMsg = true;

                                        $timeout(function () {
                                            $scope.showSaveClientFormMsg = false;
                                        }, 5000);
                                    }
                            );
                }
            };

            $scope.addTimelineEvent = function () {
console.log('time');
                time.addTimelineEvent($scope.client.id, $scope.timelineEvent)
                        .then(
                                function (data) {
                                    console.log(data);
                                    $scope.timeline = data;
                                    $scope.timelineEvent = {};

                                    $scope.newEventCreatedMsg = true;
                                    $scope.eventForm.$setUntouched();
                                    $scope.eventForm.$submitted = false;

                                    $timeout(function () {
                                        $scope.newEventCreatedMsg = false;
                                    }, 5000);
                                });

            };

            $scope.deleteClient = function () {
                console.log('delete');

                if (!confirm('Czy na pewno chcesz usunąć tego klineta ?'))
                    return;

                clients.deleteClient($scope.client.id)
                        .then(
                                function () {
                                    alert('klient został poprawnie usunięty');
                                    $location.path('/simple_crm/web/#/clients');
                                });
            };

        }]);
})();