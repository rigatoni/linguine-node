(function(){

  angular
    .module('linguine.corpora')
    .controller('ModalInstanceCtrl', ModalInstanceCtrl);

  function ModalInstanceCtrl ($scope, $http, $modalInstance, corporaId) {

    $scope.ok = function () {
      $http
        .put('/api/corpora/' + corporaId + '/addTag', {tagName: $scope.tagName})
        .success(function () {
          $modalInstance.close();
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  };

})();
