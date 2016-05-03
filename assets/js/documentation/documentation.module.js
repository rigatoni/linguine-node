(function(){

  angular
    .module('linguine.documentation', ['ui.router'])
    .config(config);

  function config($stateProvider){
    $stateProvider
      .state('linguine.documentation', {
        url: '/documentation',
        abstract: true,
        template: '<div ui-view />'
      })
      .state('linguine.documentation.index', {
        url: '',
        templateUrl: 'templates/documentation/index',
        controller: 'DocumentationIndexController',
      })
      .state('linguine.documentation.tutorial', {
        url: '/tutorial',
        templateUrl: 'templates/documentation/tutorial',
        controller: 'DocumentationTutorialController',
      })
      .state('linguine.documentation.about', {
        url: '/about',
        templateUrl: 'templates/documentation.about',
        controller: 'DocumentationAboutController',
      });
  }
})();
