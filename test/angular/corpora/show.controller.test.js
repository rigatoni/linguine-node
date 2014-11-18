describe('CorporaShowController', function(){
  var createController, $scope, $rootScope, $httpBackend, $stateParams, $window, flash, $state;

  beforeEach(module('linguine'));
  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');
    $window = $injector.get('$window');
    flash = $injector.get('flash');
    $state = $injector.get('$state');
    $stateParams = $injector.get('$stateParams');
    $controller = $injector.get('$controller');
    $httpBackend.whenGET('/templates/home/index').respond(200, '');
    $httpBackend.whenGET('/templates/corpora/index').respond(200, '');
    $httpBackend.whenGET('/api/logged_in').respond(200, {
        loggedIn: true,
        user: {
          dce: 'jd1234',
          name: 'John Doe',
          _id: 1
        }
      });

    createController = function(){
      return $controller('CorporaShowController', {
        $scope: $scope,
        $stateParams: $stateParams,
        $window: $window,
        flash: flash,
        $state: $state,
        $rootScope: $rootScope
      });
    }
  }));

  describe('delete', function(){
    it('should work when logged in', function(done){
      $httpBackend.whenGET('/api/corpora/1').respond(200, '')
      $stateParams.id = 1;
      $httpBackend.expectDELETE('/api/corpora/1').respond(204, {});
      createController();
      $scope.delete();
      $httpBackend.flush();
      expect($state.current.name).to.equal('linguine.corpora.index');
      done();
    });

    it('should work when logged in', function(done){
      $httpBackend.whenGET('/api/corpora/1').respond(200, '')
      $stateParams.id = 1;
      $httpBackend.expectDELETE('/api/corpora/1').respond(401, {});
      createController();
      $scope.delete();
      $httpBackend.flush();
      expect(flash.danger.getMessage()).to.equal('An error occured.');
      done();
    });
  });

  describe('getting corpus', function(){

    it('should work when logged in', function(done){
      $httpBackend.expectGET('/api/corpora/1').respond(200, {
        user_id: 1,
        createdAt: Date(),
        fileName: 'file_name.txt',
        fileSize: 100,
        fileType: 'text',
        title: 'File Name',
        contents: "Here are some contents brah",
        tags: ['here', 'are', 'tags']
      });
      $stateParams.id = 1;
      createController();
      $httpBackend.flush();
      expect($scope.corpus).to.be.defined;
      done();
    });
    it('should work when logged in', function(done){
      $httpBackend.expectGET('/api/corpora/1').respond(401, {});
      $stateParams.id = 1;
      createController();
      $httpBackend.flush();
      expect($scope.corpus).to.be.undefined;
      expect(flash.danger.getMessage()).to.equal('You need to be the owner of this corpus to view it');
      expect($state.current.name).to.equal('linguine.corpora.index');
      done();
    });
  });
});
