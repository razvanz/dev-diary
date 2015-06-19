(function () {
  'use strict';

  var routesConfig = function ($stateProvider, $urlRouterProvider) {

    var routes = [{
      state: 'app',
      config: {
        abstract: true,
        templateUrl: 'app/views/main.html',
        controllerAs: 'main',
        controller: 'mainCtrl',
        settings: {
          authorize: ['*']
        },
        resolve: {
          'projects': ['$http',
            function ($http) {
              return $http.get('/api/v1.0/project')
                .then(function (res) {
                  return res.data;
                });
          }]
        }
      }
    }, {
      state: 'app.home',
      config: {
        url: '/home',
        templateUrl: 'app/views/templates/home.html',
        controllerAs: 'home',
        controller: 'homeCtrl',
        title: 'DevDiary',
        settings: {
          authorize: ['*']
        },
        resolve: {}
      }
    }, {
      state: 'app.project',
      config: {
        url: '/project/:id',
        templateUrl: 'app/views/templates/project.html',
        controllerAs: 'project',
        controller: 'projectCtrl',
        title: 'Project',
        settings: {
          authorize: ['*']
        },
        resolve: {
          'project': ['$http', '$stateParams',
            function ($http, $stateParams) {
              return $http.get('/api/v1.0/project/' + $stateParams.id)
                .then(function (res) {
                  return res.data;
                });
          }]
        }
      }
    }, {
      state: 'app.notes',
      config: {
        url: '/project/:id/notes',
        templateUrl: 'app/views/templates/notes.html',
        controllerAs: 'notes',
        controller: 'notesCtrl',
        title: 'Notes',
        settings: {
          authorize: ['*']
        },
        resolve: {
          'notes': ['$http', '$stateParams',
            function ($http, $stateParams) {
              return $http.get('/api/v1.0/project/' + $stateParams.id +
                  '/note')
                .then(function (res) {
                  return res.data;
                });
          }]
        }
      }
    }];

    $urlRouterProvider.otherwise('/home');

    for (var i = 0, j = routes.length; i < j; i++) {
      $stateProvider.state(routes[i].state, routes[i].config);
    }
  };

  routesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  angular.module('app')
    .config(routesConfig);
})();
