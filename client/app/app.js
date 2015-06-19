(function () {
  'use strict';

  var runApp = function ($rootScope, $state) {
    $state.go('app.home');
  };

  runApp.$inject = ['$rootScope', '$state'];

  var app = angular.module('app', ['ui.router']);

  app.run(runApp);
})();
