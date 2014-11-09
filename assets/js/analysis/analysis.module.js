(function(){

  angular
    .module('linguine.analysis', ['ui.router'])
    .config(config);

  function config($stateProvider){
    $stateProvider
      .state('linguine.analysis', {
        url: '/analysis',
        abstract: true,
        template: '<div ui-view />'
      })
      .state('linguine.analysis.index', {
        url: '',
        templateUrl: '/templates/analysis/index',
        controller: 'AnalysisIndexController',
        resolve: {
          loggedIn: function(loggedIn) {
            loggedIn.loggedIn();
          }
       }
      })
      .state('linguine.analysis.new', {
        url: '/new',
        templateUrl: '/templates/analysis/new',
        controller: 'AnalysisNewController',
        resolve: {
          loggedIn: function(loggedIn) {
            loggedIn.loggedIn();
          }
       }
      })
      .state('linguine.analysis.show', {
        url: '/:id',
        templateUrl: '/templates/analysis/show',
        controller: 'AnalysisShowController',
        resolve: {
          loggedIn: function(loggedIn) {
            loggedIn.loggedIn();
          }
       }
      });
  }
})();
