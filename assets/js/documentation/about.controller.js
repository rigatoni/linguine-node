     (function(){

  angular
    .module('linguine.documentation')
    .controller('DocumentationAboutController', DocumentationAboutController);

  function DocumentationAboutController ($http, $scope, $state, $stateParams, $window) {
    $scope.back = function () {
      $window.history.back();
    };

  }
})();
