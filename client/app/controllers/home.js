(function () {
  'use strict';

  var home = function ($state) {
    var ctrl = this;

    ctrl.addProject = function () {
      $state.go('app.project', {id: 0});
    };
  };

  home.$inject = ['$state'];

  angular.module('app')
    .controller('homeCtrl', home);

})();
