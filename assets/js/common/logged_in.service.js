(function(){
  angular
    .module('linguine')
    .factory('loggedIn', loggedIn);

  function loggedIn($q, $timeout, $http, $state, flash){
    return {
      loggedIn: function(){
        var deferred = $q.defer();
        $http.get('/api/logged_in').success(function(user){
          if (user.loggedIn){
            $timeout(deferred.resolve, 0);
          }
          else {
            flash.danger.setMessage('You need to be logged in to view that');
            $timeout(function(){deferred.reject();}, 0);
            $state.go('linguine.index');
          }
        });
      }
    };
  }
})();
