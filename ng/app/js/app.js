'use strict';


// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      window.location.reload();
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);
}, false);

// Declare app level module which depends on filters, and services
angular.module('tutt', ['tutt.filters', 'tutt.services', 'tutt.directives', 'tutt.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/projects', {templateUrl: 'partials/projects.html', controller: 'ProjectsCtrl'});
    $routeProvider.when('/infos', {templateUrl: 'partials/infos.html', controller: 'InfosCtrl'});
    $routeProvider.otherwise({redirectTo: '/projects'});
  }]);
