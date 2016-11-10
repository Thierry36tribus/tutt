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
    if (minutes < 30) {
        h = 20
    } else if (minutes > 8*60) {
        h = 400
    } else {
        h = 40 * minutes / 60
    }
    return h
}

var searchIfIsEndOfDay = function(sessions,session) {
    for (var i=0; i < sessions.length; i++) {
        if (session.id === sessions[i].id) {
            if (i == 0) {
                return true
            }
            //console.log("searchIfIsEndOfDay " + i + ": " + moment(sessions[i].start).format('DD/MM HH:mm') + '- ' + moment(sessions[i-1].start).format('DD/MM HH:mm') + ' return ' +  !moment(sessions[i].start).isSame(sessions[i-1].start,'day'))
            return !moment(sessions[i].start).isSame(sessions[i-1].start,'day')
        }
    }
    return false    
}

angular.module('tutt.controllers', [])
    .controller('NavCtrl', ['$scope',function($scope) {
    }])
    .controller('ProjectsCtrl', ['$scope','$http',function($scope,$http) {
        
        var getProjects = function() {
            $scope.loadingProjects = true
            $http.get('/projects').success(function(projects){
                $scope.loadingProjects = false
                $scope.projects = projects
            })            
        }
        
        var updateData = function() {
            getProjects()
            $scope.loadingSessions = true
            $http.get('/sessions').success(function(sessions){
                $scope.loadingSessions = false
                $scope.sessions = sessions
            })
            $scope.loadingStartedProject = true
            $http.get('/projects?started=true').success(function(startedProject){
                $scope.loadingStartedProject = false
                $scope.startedProject = startedProject
            })            
        }
        updateData()
        

        $scope.label = function(project) {
            if ($scope.isStarted(project)) {
                return project.label + " since " + moment(project.lastUpdate).format('dddd H:mm')
            } else {
                return project.label
            }
        }
        $scope.start = function(project) {
            $scope.startedProject = project
            $http.post('/projects?start=true',project).success(function(){
                // pour refresh de l'ordre TODO faire mieux que refaire une requête
                updateData()                
            })
        }
        $scope.stop = function(project) {
            if ($scope.startedProject) {
                $http.post('/projects?stop=true',project).success(function(){
                    $scope.startedProject=null
                    updateData()                
                })
            }
        }
        $scope.isStarted = function(project) {
            return $scope.startedProject && $scope.startedProject.id == project.id
        }
        $scope.create = function(query) {
            $http.post('/create', query).success(function() {
                getProjects()
                $scope.searched = ''
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
        $scope.isEndOfDay = function(session) {
            return searchIfIsEndOfDay($scope.sessions,session)
        }
        
        $scope.sumOfDay = function(session) {
          var sum = 0
          for (var i=0; i < $scope.sessions.length; i++) {
            sum += calcDuration(session)
            if (session.id === $scope.sessions[i].id) {            
              if (i == 0) {
                return sum
              }
              if (!moment($scope.sessions[i].start).isSame($scope.sessions[i-1].start,'day')) {
                return sum
              }          
            }
          }
        }
    }])
   .controller('ProjectCtrl', ['$scope','$routeParams','$location','$http', function($scope,$routeParams,$location,$http) {
       var currentProject 
       var updateData = function() {
            $scope.loadingProject = true           
            $http.get('/projects/' + $routeParams.projectId).success(function(project){
                $scope.loadingProject = false           
                $scope.project = currentProject = project
            })            
            $scope.loadingSessions = true           
            $http.get('/sessions?projectId='+ $routeParams.projectId).success(function(sessions){
                $scope.loadingSessions = false
                $scope.sessions = sessions
            })
            $scope.loadingStartedProject = true
            $http.get('/projects?started=true').success(function(startedProject){
                $scope.loadingStartedProject = false
                $scope.startedProject = startedProject
            })            
        }
        updateData()
        $scope.labelModifying = false
        
        $scope.isStarted = function() {
            return $scope.startedProject && $scope.startedProject.id && $scope.project.id == $scope.startedProject.id
        }       
        $scope.start = function(){
            $http.post('/projects?start=true',currentProject).success(function(){
                $scope.startedProject = $scope.project
                // pour refresh de l'ordre TODO faire mieux que refaire une requête
                updateData()                
            })
        }
        $scope.stop = function(){
            $http.post('/projects?stop=true',currentProject).success(function(){
                $scope.startedProject=null
                updateData()                
            })
        }
        
        $scope.updateProject = function() {
            // TODO vérifier unicité label
            $http.post('/projects',currentProject).success(function(){
                $scope.labelModifying = false
            })
        }
        
        $scope.deleteProject =function() {
            if (confirm("Remove this project?")) {
                $http.delete('/projects/' + $scope.project.id).success(function(){                    
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
            if ($scope.sessions) {
                return $scope.sessions.reduce(function(sum, session){
                    return calcDuration(session) + sum;
                },0)
            } else {
                return 0
            }
        }
        $scope.sumPeriod = function() {
            var endSession =  $scope.getEndOfPeriodSession()
            if (endSession) {
                return $scope.sessions.reduce(function(sum, session){
                    if (session.stop > endSession.stop) {
                        return calcDuration(session) + sum;
                    } else {
                        return sum               
                    }
                },0)
            } else {
                return 0
            }
        }        
        
        $scope.since = function() {
            return $scope.project ? moment($scope.project.lastUpdate).format('dddd H:mm') : '?'
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
                session.editDate = new Date(session.start)
                session.editStartHours = session.editDate.getHours()
                session.editStartMinutes= session.editDate.getMinutes()
                var stopDate = new Date(session.stop)
                session.editStopHours = stopDate.getHours()
                session.editStopMinutes= stopDate.getMinutes()
                
                // pour pouvoir restaurer en cas de cancel  
                session.originalStart = session.start
                session.originalStop = session.stop
                session.originalEndOfPeriod = session.endOfPeriod
                
            }
            session.modifying = !session.modifying
        }
        $scope.closeSessionModifying = function(session) {
            if (session.originalStart && session.originalStop) {
                session.start = session.originalStart
                session.stop = session.originalStop
                session.endOfPeriod = session.originalEndOfPeriod
            }
            session.modifying = false
        }    
        
        $scope.updateSession = function(session) {
            session.editDate.setHours(session.editStartHours)
            session.editDate.setMinutes(session.editStartMinutes)
            session.start = session.editDate.getTime()

            var stopDate = session.editDate
            stopDate.setHours(session.editStopHours)
            stopDate.setMinutes(session.editStopMinutes)
            session.stop = stopDate.getTime()            
            
            if (session.stop < session.start) {
                alert("'To' can't be before 'From', please fix it.")
                return
            }
            
            $http.post('/sessions',session).success(function(){
                session.modifying = false                
            })
        }
        $scope.deleteSession = function(session) {
            if (confirm("Remove this working session?")) {
                $http.delete('/sessions/' + session.id).success(function(){                    
                    var index = $scope.sessions.indexOf(session)
                    if (index >=0){
                        $scope.sessions.splice(index,1)
                    }
                })
            }            
        }
        
        $scope.getColor = function(session) {
            var endSession =  $scope.getEndOfPeriodSession()
            if (endSession && session.stop <= endSession.stop) {
                return "lightgray"
            }
            return $scope.project ? $scope.project.color : "black"
        }
        
        /* Session correspondant à  la date de fin de période la + récente (ou plus vielle session sinon) */
        $scope.getEndOfPeriodSession = function() {
            var endSession = false
            if ($scope.sessions) {
                $scope.sessions.forEach(function(session){
                    if (session.endOfPeriod) {
                        if (!endSession || session.stop > endSession.stop) {
                            endSession = session 
                        }
                    }
                })
            }
            return endSession
        }
        
        $scope.isEndOfDay = function(session) {
            return searchIfIsEndOfDay($scope.sessions,session)
        }
        
    }])
    .controller('InfosCtrl', [function() { }]);
