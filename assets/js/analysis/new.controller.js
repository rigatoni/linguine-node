(function(){

  angular
    .module('linguine.analysis')
    .controller('AnalysisNewController', AnalysisNewController);

  function AnalysisNewController($http, $scope, $state) {

    $scope.analysisTypes = [
      {
        name: "tfidf",
        description: "Term Frequency - Inverse Document Frequency"
      },
      {
        name: "wordcloudop",
        description: "Word Cloud Generator. Note: This operation is identical to tfidf when applied to a single corpus."
      }
    ];

    $scope.cleanupTypes = [
      {
        name: "Remove Capitalization (greedy)",
        unfriendly_name: "removecapsgreedy",
        description: "Convert all uppercase letters to lowercase letters"
      },
      {
        name: "Remove Capitalization (NNP)",
        unfriendly_name: "removecapsnnp",
        description: "Conver uppercase letters to lowercase letters while leaving proper nouns capitalized"
      },
      {
        name: "Remove Punctuation",
        unfriendly_name: "removepunct",
        description: "Remove all punctuation"
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

    $scope.onCleanupClick = function(e) {
      e.cleanup.active = !e.cleanup.active
    };

    $scope.onCreateAnalysis = function () {
      var payload = {
        corpora_ids: _.pluck(_.where($scope.corpora, 'active'), '_id'),
        cleanup: _.map(_.where($scope.cleanupTypes, 'active'), function(cleanupType) {return cleanupType.unfriendly_name}),
        operation: $scope.selectedAnalysis.name,
        library: "",
        transaction_id: "",
        user_id: ""
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
