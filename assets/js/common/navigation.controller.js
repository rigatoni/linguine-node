(function(){
  angular
    .module('linguine')
    .controller('NavigationController', NavigationController);

  function NavigationController($scope, $http) {
    $scope.user = {}
    $http.get('/api/logged_in')
      .success(function(data){
        if(data.loggedIn){
          $scope.loggedIn = true;
          $scope.currentUser = data.user;
        }else{
          $scope.loggedIn = false;
        }
      });

    $scope.login = function(){
      $http.post('/api/login', $scope.user)
        .success(function(data){
          $scope.currentUser = data.user;
          $scope.loggedIn = true;
          $scope.user = {};
        });
    }

    $scope.logout = function() {
      $http.post('/api/logout')
        .success(function(data){
          $scope.currentUser = {};
          $scope.loggedIn = false;
        })
    }

    $scope.formattedName = function() {
      if($scope.currentUser.name){
        return $scope.currentUser.name.split(' ')[0];
      }else{
        return $scope.currentUser.dce;
      }
    }
  }
})();
