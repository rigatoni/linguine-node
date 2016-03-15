(function(){

  angular
    .module('linguine.analysis')
    .controller('AnalysisIndexController', AnalysisIndexController);

  function AnalysisIndexController ($scope, $http, $interval) {
    
    $scope.reapply = false;

    $scope.fetchAnalyses = function() {
			$http.get('api/analysis')
				.success(function (data) {
					$scope.analyses = data;
			});
    }
      
    $scope.fetchAnalyses();
    $scope.reapply = true;

    $http.get('api/corpora')
      .success(function (data) {
        $scope.corpora = data;
    });
    
    var timeIntervalInSec = 10; 
    $interval($scope.fetchAnalyses, 1000 * timeIntervalInSec);

    $scope.findCorpus = function (id) {
      return _.find($scope.corpora, {'_id': id});
    };

    $scope.getEtaTime = function(analysis) {
      var d = new Date(analysis.time_created); 
      d.setSeconds(d.getSeconds() + analysis.eta);
      return d.toLocaleTimeString()
    };

    $scope.showTimeCreated = function(analysis) {
      var d = new Date(analysis.time_created); 
      return d.toLocaleDateString() + " " + d.toLocaleTimeString()
    };
  }
})();
