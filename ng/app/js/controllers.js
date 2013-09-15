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
        //stop = session.start
        stop = new Date().getTime()
    }
    return (stop - session.start)/1000
}

var formatDuration = function(session) {
    var stop = session.stop
    if (!stop) {
        //stop = session.start
        stop = new Date().getTime()
    }
    return moment(session.start).from(moment(stop),true)
}

var calcHeight = function(session) {
    var minutes = calcDuration(session) / 60
    var h
    if (minutes < 60) {
        h = 20
    } else if (minutes > 8*60) {
        h = 300
    } else {
        h = 20 * minutes / 60
    }
    return h
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
            return formatDuration(session)
        }        
        $scope.height = function(session) {
            return calcHeight(session)
        }        
        $scope.exists = function(label) {
            return $scope.projects.some(function(project) {
                return project.label.trim().toLowerCase() == label.trim().toLowerCase()  
            })
        }
        
        $scope.toto = 12345

    }])
   .controller('ProjectCtrl', ['$scope','$routeParams','$location','Project','Sessions', function($scope,$routeParams,$location,Project,Sessions) {
        $scope.project = Project.get({projectId: $routeParams.projectId}, null)
        $scope.sessions = Sessions.query({projectId: $routeParams.projectId})
         
        $scope.startedProject = Project.started()

        $scope.isStarted = function() {
            return $scope.startedProject && $scope.startedProject.id && $scope.project.id == $scope.startedProject.id
        }    
       
        $scope.start = function(){
            $scope.project.$start()
            $scope.startedProject = $scope.project
             // pour refresh TODO faire mieux que refaire une requête
            $scope.project = Project.get({projectId: $routeParams.projectId}, null)
            $scope.sessions = Sessions.query({projectId: $routeParams.projectId})
        }
        $scope.stop = function(){
            $scope.project.$stop()
            $scope.startedProject = null
             // pour refresh TODO faire mieux que refaire une requête
            $scope.project = Project.get({projectId: $routeParams.projectId}, null)
            $scope.sessions = Sessions.query({projectId: $routeParams.projectId})
        }
        
        $scope.update = function(project) {
            $scope.project.$save()
        }
        
        $scope.delete =function(project) {
            $scope.project.$delete({'projectId':project.id})
             $location.path( "/" );
        }
        
        $scope.duration = function(session) {
            return formatDuration(session)
        }
        $scope.height = function(session) {
            return calcHeight(session)
        }
        $scope.sum = function() {
            return $scope.sessions.reduce(function(sum, session){
                return calcDuration(session) + sum;
            },0)
        }
        
    }])
    .controller('InfosCtrl', [function() { }]);
