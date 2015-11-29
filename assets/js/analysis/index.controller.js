(function(){

  angular
    .module('linguine.analysis')
    .controller('AnalysisIndexController', AnalysisIndexController);

  function AnalysisIndexController ($scope, $http) {

    $http.get('api/corpora')
      .success(function (data) {
        $scope.corpora = data;
      });
    $http.get('api/analysis')
      .success(function (data) {
        $scope.analyses = data;
      });

    $scope.findCorpus = function (id) {
      return _.find($scope.corpora, {'_id': id});
    }

  }
})();
