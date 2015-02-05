(function(){

  angular
    .module('linguine.corpora')
    .controller('CorporaIndexController', CorporaIndexController);

  function CorporaIndexController ($scope, $http) {

    $http.get('/api/corpora')
      .success(function (data) {
        $scope.corpora = data;
      });

  }
})();
