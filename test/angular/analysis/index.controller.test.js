describe('AnalysisIndexController', function(){
  var createController, $controller, $rootScope, $scope, $httpBackend;

  beforeEach(module('linguine'));
  beforeEach(inject(function($injector){
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');

    createController = function(){
      return $controller('AnalysisIndexController', {
        $scope: $scope
      });
    }
  }));

  it('should be able to find the right corpus', function(done){
    $httpBackend.whenGET('/api/corpora').respond(200, [
      {
        _id: 1,
        user_id: 1,
        createdAt: Date(),
        fileName: 'file_name.txt',
        fileSize: 100,
        fileType: 'text',
        title: 'File Name',
        contents: "Here are some contents brah",
        tags: ['here', 'are', 'tags']
      },
      {
        _id: 2,
        user_id: 1,
        createdAt: Date(),
        fileName: 'something.txt',
        fileSize: 100,
        fileType: 'text',
        title: 'Something',
        contents: "Wow contents are cool",
        tags: ['here', 'are', 'tags', 'word']
      }
    ]);
    $httpBackend.whenGET('/api/analysis').respond(200, []);

    createController();
    $httpBackend.flush();
    var corpus = $scope.findCorpus(1);
    expect(corpus).to.equal($scope.corpora[0]);
    done();
  });
});
