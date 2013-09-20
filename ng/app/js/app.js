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

angular.module('tutt', ['tutt.filters', 'tutt.services', 'tutt.directives', 'tutt.controllers','timer','ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/projects', {templateUrl: 'partials/projects.html', controller: 'ProjectsCtrl'})
    $routeProvider.when('/project/:projectId', {templateUrl: 'partials/project.html', controller: 'ProjectCtrl'})
    $routeProvider.when('/infos', {templateUrl: 'partials/infos.html', controller: 'InfosCtrl'});
    $routeProvider.otherwise({redirectTo: '/projects'});
  }]);
