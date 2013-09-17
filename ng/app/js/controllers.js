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

        $scope.label = function(project) {
            if ($scope.isStarted(project)) {
                return project.label + " since " + moment(project.lastUpdate).format('dddd H:mm')
            } else {
                return project.label
            }
        }
        
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
        $scope.labelModifying = false
        $scope.sessions.forEach(function(session) {
            session.modifying = false
        })
        
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
        
        $scope.updateProject = function() {
            // TODO vérifier unicité label
            $scope.project.$save()
            $scope.labelModifying = false
        }
        
        $scope.deleteProject =function() {
            if (confirm("Remove this project?")) {
                $scope.project.$delete({'projectId':$scope.project.id},function(){
                    $location.path( "/" )
                })
            }
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
        $scope.since = function() {
            return moment($scope.project.lastUpdate).format('dddd H:mm')
        }
        
        $scope.isLabelModifying = function() {
            return $scope.labelModifying;
        }
        $scope.openLabelModifying = function() {
            if (!$scope.labelModifying) {
                // pour pouvoir le restaurer en cas de cancel
                $scope.originalLabel = $scope.project.label                
            }
            $scope.labelModifying = !$scope.labelModifying;
        }
        $scope.closeLabelModifying = function() {
            if ($scope.originalLabel) {
                $scope.project.label = $scope.originalLabel
            }
             $scope.labelModifying = false
        }
        
        $scope.isSessionModifying = function(session) {
            return session.modifying
        }
        $scope.openSessionModifying = function(session) {
            if (!session.modifying) {
                if (!session.stop) {
                    alert("You can't modify a working session in progress.")
                    return
                }
                
                // pour pouvoir restaurer en cas de cancel  
                session.originalStart = session.start
                session.originalStop = session.stop
            }
            session.modifying = !session.modifying
        }
        $scope.closeSessionModifying = function(session) {
            if (session.originalStart && session.originalStop) {
                session.start = session.originalStart
                session.stop = session.originalStop
            }
            session.modifying = false
        }    
        
        $scope.updateSession = function(session) {
            session.$save()
            session.modifying = false
        }
        $scope.deleteSession = function(session) {
            if (confirm("Remove this working session?")) {
                session.$delete({'sessionId':session.id},function() {
                    var index = $scope.sessions.indexOf(session)
                    if (index >=0){
                        $scope.sessions.splice(index,1)
                    }
                })
            }            
        }
        
    }])
    .controller('InfosCtrl', [function() { }]);
