describe('NavigationController', function(){
  var $controller, $scope, $httpBackend, $state, $rootScope, flash;

  beforeEach(function(done){
    module('linguine');
    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      flash = $injector.get('flash');
      $state = $injector.get('$state');
      $httpBackend = $injector.get('$httpBackend');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');
      createController = function(){
        return $controller('NavigationController', {
          $scope: $scope,
          $rootScope: $rootScope,
          $state: $state,
          flash: flash
        });
      }
      $httpBackend.whenGET('templates/home/index').respond(200, '');
    });
    done();
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('currentUser', function(){

    it('should set the current user if logged in', function(done){
      $httpBackend.expectGET('/api/logged_in').respond(200, {
        loggedIn: true,
        user: {
          dce: 'jd1234',
          name: 'John Doe',
          _id: 1
        }
      });

      var controller = createController();
      $httpBackend.flush();
      expect($scope.loggedIn).to.be.true;
      expect($scope.currentUser).to.have.property('dce', 'jd1234');
      expect($scope.currentUser).to.have.property('name', 'John Doe');
      expect($scope.currentUser).to.have.property('_id', 1);
      done();
    });

    it('should not set the current user if not logged in', function(done){
      $httpBackend.expectGET('/api/logged_in').respond(200, {
        loggedIn: false
      });

      var controller = createController();
      $httpBackend.flush();
      expect($scope.loggedIn).to.be.false;
      expect($scope.currentUser).to.be.undefined;
      done();
    });
  });

  describe('login', function(){
    it('should login properly', function(done){
      $httpBackend.expectGET('/api/logged_in').respond(200, {});

      var controller = createController();

      $httpBackend.flush();
      $httpBackend.expectPOST('/api/login').respond(200, {
          user: {
            dce: 'jd1234',
            name: 'John Doe',
            _id: 1
          }
        });

      $scope.user.username = 'jd1234';
      $scope.user.password ='password';
      $scope.login();

      $httpBackend.flush();
      expect($scope.loggedIn).to.be.true;
      expect($scope.currentUser).to.have.property('dce', 'jd1234');
      expect($scope.currentUser).to.have.property('name', 'John Doe');
      expect($scope.currentUser).to.have.property('_id', 1);
      done();
    });

    it('should not set things when failed login', function(done){
      $httpBackend.expectGET('/api/logged_in').respond(200, {});

      var controller = createController();

      $httpBackend.flush();
      $httpBackend.expectPOST('/api/login').respond(401, {});

      $scope.user.username = 'jd1234';
      $scope.user.password ='password';
      $scope.login();

      $httpBackend.flush();
      expect($scope.loggedIn).to.be.false;
      expect($scope.currentUser).to.be.undefined;
      done();
    });
  });

  describe('logout', function(){
    it('should allow you to logout', function(done){
      $httpBackend.expectGET('/api/logged_in').respond(200, {
        loggedIn: true,
        user: {
          dce: 'jd1234',
          name: 'John Doe',
          _id: 1
        }
      });

      var controller = createController();
      $httpBackend.flush();
      $httpBackend.expectPOST('/api/logout').respond(200, {});

      $scope.logout();
      $httpBackend.flush();
      expect($scope.currentUser).to.eql({});
      expect($scope.loggedIn).to.be.false;
      done();
    })
  });

  describe('formattedName', function(){
    it('should return first name when it exists', function(done){
      $httpBackend.expectGET('/api/logged_in').respond(200, {
        loggedIn: true,
        user: {
          dce: 'jd1234',
          name: 'John Doe',
          _id: 1
        }
      });

      var controller = createController();
      $httpBackend.flush();
      expect($scope.formattedName()).to.eql('John');
      done();
    });

    it('should return dce when name does not exists', function(done){
      $httpBackend.expectGET('/api/logged_in').respond(200, {
        loggedIn: true,
        user: {
          dce: 'jd1234',
          _id: 1
        }
      });

      var controller = createController();
      $httpBackend.flush();
      expect($scope.formattedName()).to.eql('jd1234');
      done();
    });
  });
});
