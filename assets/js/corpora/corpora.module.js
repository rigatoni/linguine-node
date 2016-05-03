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
        templateUrl: 'templates/corpora/index',
        controller: 'CorporaIndexController',
        resolve: {
          loggedIn: function(loggedIn) {
            loggedIn.loggedIn();
          }
       }
      })
      .state('linguine.corpora.new', {
        url: '/new',
        templateUrl: 'templates/corpora/new',
        controller: 'CorporaNewController',
        resolve: {
          loggedIn: function(loggedIn) {
            loggedIn.loggedIn();
          }
       }
      })
      .state('linguine.corpora.show', {
        url: '/:id',
        templateUrl: 'templates/corpora/show',
        controller: 'CorporaShowController',
        resolve: {
          loggedIn: function(loggedIn) {
            loggedIn.loggedIn();
          }
       }
      });
  }
})();
