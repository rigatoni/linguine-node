(function(){

  angular
    .module('linguine.corpora')
    .controller('CorporaShowController', CorporaShowController);

  function CorporaShowController ($scope, $http, $stateParams, $window) {

    $scope.back = function () {
      $window.history.back();
    };

    $http.get('/api/corpora/' + $stateParams.id)
      .success(function (data) {
        $scope.corpus = data;
      });

  }
})();
