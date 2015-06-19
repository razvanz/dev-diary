(function () {
  'use strict';

  var mainCtrl = function ($http, projects) {
    var ctrl = this;
    ctrl.title = 'DevDiary';
    ctrl.projects = generateShortDescr(projects);

    ctrl.logout = function () {
      console.log('logout');
      $http.post('/logout')
        .then(function () {
          window.location.replace('/');
        });
    };

    ctrl.data = 'hello';

    function generateShortDescr(proj) {
      for (var i = proj.length - 1; i >= 0; i--) {
        proj[i].shortDescription = (proj[i].description ||
            'No description provided for this awesome project')
          .substring(0, 200) + ' ...';
      }

      return proj;
    }
  };

  mainCtrl.$inject = ['$http', 'projects'];

  angular.module('app')
    .controller('mainCtrl', mainCtrl);

})();
