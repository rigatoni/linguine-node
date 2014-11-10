(function(){

  angular
    .module('linguine.analysis')
    .controller('AnalysisNewController', AnalysisNewController);

  function AnalysisNewController($http, $scope, $state) {

    $scope.analysisTypes = [
      {
        name: "tfidf",
        description: "Term Frequency - Inverse Document Frequency"
      }
    ];

    $http.get('/api/corpora')
      .success(function (data) {
        $scope.corpora = data;
      });

    $scope.onCorpusClick = function (e) {
      e.corpus.active = !e.corpus.active;
    };

    $scope.onAnalysisClick = function (e) {
      $scope.selectedAnalysis = e.analysis;
    };

    $scope.onCreateAnalysis = function () {
      var payload = {
        corpora_ids: _.pluck(_.where($scope.corpora, 'active'), '_id'),
        operation: $scope.selectedAnalysis.name,
        library: "",
        transaction_id: ""
      };
      $http.post('/api/analysis', payload)
        .success(function(data) {
          $state.go('linguine.analysis.index');
        })
        .error(function (data) {
          // to-do: handle error case
        });
    };

  }
})();
