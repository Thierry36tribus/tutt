'use strict';

/* Controllers */

var compareProjectsByLastUpdate = function compare(p1,p2) {
  if (p1.lastUpdate < p2.lastUpdate)  return 1;
  if (p1.lastUpdate > p2.lastUpdate)  return -1;
  return 0;
}



angular.module('tutt.controllers', []).
    controller('ProjectsCtrl', ['$scope','Project',function($scope,Project) {
        $scope.projects = Project.query()

        $scope.startedProject = Project.started()
            
        $scope.start = function(project) {
            $scope.startedProject = project
            $scope.startedProject.$start()
            // pour refresh de l'ordre TODO faire mieux que refaire une requête
            $scope.projects = Project.query()
        }
        $scope.stop = function(project) {
            if ($scope.startedProject) {
                $scope.startedProject.$stop()
                $scope.startedProject=null
            }
            // pour refresh de l'ordre TODO faire mieux que refaire une requête
            $scope.projects = Project.query()

        }
        $scope.isStarted = function(project) {
            return $scope.startedProject && $scope.startedProject.id == project.id
        }
        
    }])
    .controller('ProjectCtrl', ['$scope','$routeParams','Project', function($scope,$routeParams,Project) {
        $scope.project = Project.get({projectId: $routeParams.projectId}, null)
        
        $scope.update = function(project) {
            $scope.project.$save()
        }
        
        $scope.delete =function(project) {
            $scope.project.$delete({'projectId':project.id})
        }
        
    }])
    .controller('InfosCtrl', [function() { }]);
