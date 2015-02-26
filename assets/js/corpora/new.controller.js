(function(){

  angular
    .module('linguine.corpora')
    .controller('CorporaNewController', CorporaNewController);

  function CorporaNewController($scope, $upload, $state, $http) {

    $scope.corpus = {};
    $scope.files = [];

    $scope.onFileSelect = function ($files) {
      $scope.files = $files
    };

    $scope.upload = function () {
      if ( $scope.files && $scope.files.length) {
        for (var i = 0; i < $scope.files.length; i++) {
          var file = $scope.files[i];
          $upload
            .upload({
              url: 'api/corpora',
              data: $scope.corpus,
              file: file,
            })
            .progress(function (evt) {
              $scope.progress = parseInt( 100.0 * evt.loaded /evt. total );
            })
            .success(function(data){
              $state.go('linguine.corpora.index');
            })
        }
      }
    }


  }
})();
