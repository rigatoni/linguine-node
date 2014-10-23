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
          $scope.username = data.dce;
        }else{
          $scope.loggedIn = false;
        }
      });


    $scope.login = function(){
      $http.post('/api/login', $scope.user)
        .success(function(data){
          $scope.username = data.dce;
          $scope.loggedIn = true;
        });
      $scope.user = {};
    }

    $scope.logout = function() {
      $http.post('/api/logout', {})
        .success(function(data){
          console.log('here')
          $scope.username = '';
          $scope.loggedIn = false;
        })
        .error(function(data){
          console.log(data);
        });
    }
  }
})();
