(function(){

  angular
    .module('linguine.corpora', ['ui.router', 'angularFileUpload'])
    .config(config);

  function config($stateProvider){
    $stateProvider
      .state('linguine.corpora', {
        url: '/corpora',
        abstract: true,
        template: '<div ui-view />'
      })
      .state('linguine.corpora.index', {
        url: '',
        templateUrl: '/templates/corpora/index',
        controller: 'CorporaIndexController'
      })
      .state('linguine.corpora.new', {
        url: '/new',
        templateUrl: '/templates/corpora/new',
        controller: 'CorporaNewController'
      });
  }
})();
