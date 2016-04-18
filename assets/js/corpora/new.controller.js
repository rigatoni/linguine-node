(function(){

  angular
    .module('linguine.corpora')
    .controller('CorporaNewController', CorporaNewController);

  function CorporaNewController($scope, $upload, $state, $http, $rootScope, flash) {

    $scope.corpus = {};
    $scope.files = [];

    $scope.onFileSelect = function ($files) {
      $scope.files = $files
    };

    $scope.upload = function () {
      if ( $scope.files && $scope.files.length) {
        for (var i = 0; i < $scope.files.length; i++) {
          if ($scope.corpus.title === undefined || $scope.corpus.title.replace(/ /g,'') === '') {
            flash.danger.setMessage('Your corpus must have a title.');
            $rootScope.$emit("event:angularFlash");
          } else {
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
                .error(function(err) {
                  flash.danger.setMessage('The file size is too large! (over 35KB)');
                  $rootScope.$emit("event:angularFlash");
                })
          }
        }
      } else {
        flash.danger.setMessage('You have not uploaded a corpus.');
        $rootScope.$emit("event:angularFlash");
      }
    }


  }
})();
