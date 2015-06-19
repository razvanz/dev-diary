(function () {
  'use strict';

  angular.module('app')
    .directive('projectList', [function () {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/views/templates/projects.html',
        scope: true
      };
        }])
    .directive('toolbar', [function () {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/views/templates/toolbar.html',
        scope: true
      };
    }])
    .directive('pages', [function () {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'app/views/templates/pages.html',
        scope: true
      };
    }]);

})();
