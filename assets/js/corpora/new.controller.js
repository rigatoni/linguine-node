(function(){

  angular
    .module('linguine.corpora')
    .controller('CorporaNewController', CorporaNewController);

  function CorporaNewController($scope, $upload, $state, $http) {

    $scope.corpus = {};

    $scope.onFileSelect = function ($files) {
      var reader = new FileReader();
      reader.onload = function() {
        $scope.corpus.contents = reader.result;
      };
      reader.readAsText($files[0]);
      $scope.corpus.fileName = $files[0].name;
      $scope.corpus.fileSize = $files[0].size;
      $scope.corpus.fileType = $files[0].type;
    };

    $scope.onCreateCorpus = function () {
      $http.post('/api/corpora', $scope.corpus)
        .success(function(data) {
          $state.go('linguine.corpora.index');
        });
    };


  }
})();
