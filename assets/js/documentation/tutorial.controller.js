(function(){

  angular
    .module('linguine.documentation')
    .controller('DocumentationTutorialController', DocumentationTutorialController);

  function DocumentationTutorialController($http, $scope, $state) {
    $scope.back = function () {
      $window.history.back();
    };
  }
})();
