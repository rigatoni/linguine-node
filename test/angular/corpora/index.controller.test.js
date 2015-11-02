describe('CorporaIndexController', function(){
  var createController, $controller, $scope, $rootScope, $httpBackend;

  beforeEach(module('linguine'));
  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new;
    $httpBackend = $injector.get('$httpBackend');
    $controller = $injector.get('$controller');
    createController = function(){
      return $controller('CorporaIndexController', {
        $scope: $scope
      });
    }
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  //describe('corpora', function(){
    //it('should get the corpora', function(done){
      //$httpBackend.expectGET('/api/corpora').respond(200, [
        //{
          //title: 'Thing',
          //fileName: 'thing.txt',
          //tags: ['something', 'or', 'other']
        //},
        //{
          //title: 'Other Thing',
          //fileName: 'other_thing.txt',
          //tags: ['something', 'or', 'other']
        //}
      //]);

      //createController();
      //$httpBackend.flush();
      //expect($scope.corpora).to.have.length(2);
      //done();
    //});
  //});
});
