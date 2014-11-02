(function(){

  angular
    .module('linguine.corpora', ['ui.router'])
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
      });
  }
})();
