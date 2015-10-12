(function(){

  angular
    .module('linguine.corpora')
    .controller('ModalInstanceCtrl', ModalInstanceCtrl);

  function ModalInstanceCtrl ($scope, $http, $modalInstance, corporaId) {

    $scope.ok = function () {
      $http.get('/api/corpora/' + corporaId).success(function(corpora) {
        if ($scope.tagName != undefined && $scope.tagName.replace(/ /g,'') != '' && corpora.tags.indexOf($scope.tagName) == -1) {
          $http.put('/api/corpora/' + corporaId + '/addTag', {tagName: $scope.tagName})
              .success(function () {
                $modalInstance.close();
              });
        } else {
          $modalInstance.close();
        }
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  };

})();
