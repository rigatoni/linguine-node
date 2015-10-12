(function(){

  angular
    .module('linguine.corpora')
    .controller('CorporaIndexController', CorporaIndexController);

  function CorporaIndexController ($scope, $http, $modal) {

    function onStartup() {
      refreshCorpora();
      refreshQuota();
    }

    onStartup();

    $scope.removeTag = function (corporaId, tagName) {
      $http
        .put('/api/corpora/' + corporaId + '/removeTag', {tagName: tagName})
        .success(function () {
          refreshCorpora();
        });
    }

    $scope.openPopup = function (corporaId) {

      var modalInstance = $modal.open({
        template:
          '<div class="modal-header">' + 
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">&times;</button>' +
            '<h4 class="modal-title">Add Tag</h4>' + 
          '</div>' + 
          '<div class="modal-body">' + 
            '<input class="form-control" ng-model="tagName" placeholder="Tag name...">' +
          '</div>' + 
          '<div class="modal-footer">' +
            '<button class="btn btn-primary" ng-click="ok()">Add</button>' +
            '<button class="btn btn-default" ng-click="cancel()">Close</button>' +
          '</div>',
        controller: 'ModalInstanceCtrl',
        resolve: {
          corporaId: function () {
            return corporaId;
          }
        }
      });

      modalInstance.result.then(function (tagName, corporaId) {
        refreshCorpora();
      });

    };

    function refreshCorpora () {
      $http.get('/api/corpora')
      .success(function (data) {
        $scope.corpora = data;
      });
    }

    function refreshQuota () {
      $http.get('/api/corpora/quota')
      .success(function (data) {
        $scope.quota = data;
      });
    }

  }
})();
