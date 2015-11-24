(function(){
  angular
    .module('linguine', [
      'flash',
      'ui.router',
      'ui.bootstrap',
      'linguine.corpora',
      'linguine.analysis',
      ])
    .config(config);

  function config($stateProvider, $locationProvider, $urlRouterProvider){
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('linguine', {
        url: '',
        abstract: true,
        template: '<div ui-view />'
      })
      .state('linguine.index', {
        url: '/',
        templateUrl: 'templates/home/index',
        controller: 'IndexController'
      });
  }
})();
