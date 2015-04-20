     (function(){

  angular
    .module('linguine.documentation')
    .controller('DocumentationAboutController', DocumentationAboutController);

  function DocumentationAboutController ($http, $scope, $state, $stateParams, $window) {

    $scope.back = function () {
      $window.history.back();
    };

    $http.get('/api/analysis/' + $stateParams.id)
      .success(function (data) {
        $scope.analysis = data;
        $scope.defaultView();
        $scope.visualize();
      })

    $http.get('/api/corpora')
      .success(function (data) {
        $scope.corpora = data;
      });

    

  }
})();
