'use strict';

/* Controllers */

var compareProjectsByLastUpdate = function compare(p1,p2) {
  if (p1.lastUpdate < p2.lastUpdate)  return 1;
  if (p1.lastUpdate > p2.lastUpdate)  return -1;
  return 0;
}

var calcDuration = function(session) {
    var stop = session.stop
    if (!stop) {
        stop = session.start
        //stop = new Date().getTime()
    }
    return (stop - session.start)/1000    
}

angular.module('tutt.controllers', []).
    controller('ProjectsCtrl', ['$scope','$http','Project','Sessions',function($scope,$http,Project,Sessions) {
        $scope.projects = Project.query()
        $scope.sessions = Sessions.query()

        $scope.startedProject = Project.started()
            
        $scope.start = function(project) {
            $scope.startedProject = project
            $scope.startedProject.$start()
            // pour refresh de l'ordre TODO faire mieux que refaire une requête
            $scope.projects = Project.query()
            $scope.sessions = Sessions.query()
            $scope.startedProject = Project.started()

        }
        $scope.stop = function(project) {
            if ($scope.startedProject) {
                $scope.startedProject.$stop()
                $scope.startedProject=null
            }
            // pour refresh de l'ordre TODO faire mieux que refaire une requête
            $scope.projects = Project.query()
            $scope.sessions = Sessions.query()
        }
        $scope.isStarted = function(project) {
            return $scope.startedProject && $scope.startedProject.id == project.id
        }
        $scope.create = function(query) {
            $http.post('/create', query).success(function() {
                $scope.projects = Project.query()    
            });

        }
        $scope.duration = function(session) {
            return calcDuration(session)
        }        
    }])
   .controller('ProjectCtrl', ['$scope','$routeParams','$location','Project','Sessions', function($scope,$routeParams,$location,Project,Sessions) {
        $scope.project = Project.get({projectId: $routeParams.projectId}, null)
        $scope.sessions = Sessions.query({projectId: $routeParams.projectId})
        
        $scope.update = function(project) {
            $scope.project.$save()
        }
        
        $scope.delete =function(project) {
            $scope.project.$delete({'projectId':project.id})
             $location.path( "/" );
        }
        
        $scope.duration = function(session) {
            return calcDuration(session)
        }
        
    }])
    .controller('InfosCtrl', [function() { }]);
