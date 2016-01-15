(function(){

  angular
    .module('linguine.corpora')
    .controller('CorporaShowController', CorporaShowController);

  function CorporaShowController ($scope, $http, $stateParams, $window, flash, $state, $rootScope) {

    $scope.back = function () {
      $window.history.back();
    };

    $scope.delete = function () {
      $http.delete('api/corpora/' + $stateParams.id)
        .success(function (data) {
          $state.go('linguine.corpora.index')
        })
        .error(function (data) {
          flash.danger.setMessage("An error occured.");
          $rootScope.$emit("event:angularFlash");
        })
    };

    $http.get('api/corpora/' + $stateParams.id)
      .success(function (data) {
        $scope.corpus = data;
      })
      .error(function (data) {
        flash.danger.setMessage("You need to be the owner of this corpus to view it");
        $state.go('linguine.corpora.index')
      });

  }
})();
