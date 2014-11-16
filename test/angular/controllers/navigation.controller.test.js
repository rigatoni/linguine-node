describe('NavigationController', function(){
  var controller, scope, httpBackend, state, rootScope, flash;

  beforeEach(function(done){
    module('linguine');
    inject(function($controller, $rootScope, flash, $state, $httpBackend) {
      rootScope = $rootScope;
      flash = flash;
      state = $state;
      httpBackend = $httpBackend;
      scope = $rootScope.$new();
      createController = function(){
        return $controller('NavigationController', {
          $scope: scope,
          $rootScope: $rootScope,
          $state: $state,
          flash: flash,
          $http: $httpBackend
        });
      }
    });
    done();
  });

  describe('currentUser', function(){

    it('should set the current user if logged in', function(done){
      done();
    });
  });
});
