(function(){

  angular
    .module('linguine.documentation')
    .controller('DocumentationTutorialController', DocumentationTutorialController);

  function DocumentationTutorialController($http, $scope, $state) {

    
    $http.get('/api/corpora')
      .success(function (data) {
        $scope.corpora = data;
      });


  }
})();
