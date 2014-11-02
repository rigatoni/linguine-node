(function(){
  angular
    .module('linguine', [
      'ui.router',
      'ui.bootstrap',
      'linguine.corpora',
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
      });
  }
})();
