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
				$scope.analyses.forEach(function(analysis) {

					var now = new Date();
					var timeCreatedDate = new Date(analysis.time_created);
					var timeCreatedDatePlusTwelveHrs = timeCreatedDate.setHours(timeCreatedDate.getHours() + 12);

					if(!analysis.complete && timeCreatedDatePlusTwelveHrs < now) {
						$http.delete('api/analysis/' + analysis._id) 
						.error(function (data) {
							flash.danger.setMessage("An error occured trying to delete an erraneous analysis");
						});
					}
				});
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
