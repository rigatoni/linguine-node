describe('CorporaNewController', function(){
  var createController, $controller, $scope, $rootScope, $httpBackend, $upload, $state;

  beforeEach(module('linguine'));
  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new;
    $httpBackend = $injector.get('$httpBackend');
    $controller = $injector.get('$controller');
    $upload = $injector.get('$upload');
    $state = $injector.get('$state');
    createController = function(){
      return $controller('CorporaNewController', {
        $scope: $scope,
        $uplaod: $upload,
        $state: $state
      });
    }
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
  }));

  describe('onCreateCorpus', function(){
    it('should work', function(done){


      createController();

      $scope.corpus = {
        fileName: 'Thing',
        fileSize: 100,
        fileType: 'text'
      };
      $scope.onCreateCorpus();
      $httpBackend.expectPOST('/api/corpora').respond(201, {});
      $httpBackend.flush();
      done();
    });
  });
});
