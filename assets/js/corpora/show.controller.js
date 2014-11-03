(function(){

  angular
    .module('linguine.corpora')
    .controller('CorporaShowController', CorporaShowController);

  function CorporaShowController ($scope, $http, $stateParams, $window, flash, $state) {

    $scope.back = function () {
      $window.history.back();
    };

    $http.get('/api/corpora/' + $stateParams.id)
      .success(function (data) {
        $scope.corpus = data;
      })
      .error(function (data) {
        flash.danger.setMessage("You need to be the owner of this corpus to view it");
        $state.go('linguine.corpora.index')
      });

  }
})();
