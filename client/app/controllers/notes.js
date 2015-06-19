(function () {
  'use strict';

  var notesCtrl = function (notes) {
    var ctrl = this;

    ctrl.data = notes;
  };

  notesCtrl.$inject = ['notes'];

  angular.module('app')
    .controller('notesCtrl', notesCtrl);

})();
