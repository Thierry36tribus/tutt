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
    .controller('NavCtrl', ['$scope','onLineStatus',function($scope,onLineStatus) {
        $scope.onLineStatus = onLineStatus;
        var getColor = function(onLine) {
            return onLine ? "green" : "red"
        }
        $scope.onLineColor = getColor(onLineStatus.isOnLine())
        $scope.$watch('onLineStatus.isOnLine()', function(onLine) {
            $scope.onLineColor = getColor(onLine)
        })
    }])
    .controller('ProjectsCtrl', ['$scope','$http','projectsManager','Project','Sessions','onLineStatus',function($scope,$http,projectsManager,Project,Sessions,onLineStatus) {
        // online
        var getSearchOrCreateText = function(onLine) {
            return onLine ? "Search or create" : "Search"
        }
        $scope.onLineStatus = onLineStatus;
        $scope.searchOrCreateText = getSearchOrCreateText(onLineStatus.isOnLine())
        $scope.$watch('onLineStatus.isOnLine()', function(onLine) {
            $scope.searchOrCreateText = getSearchOrCreateText(onLine)
        })        
        
        // projects
        /*
        $scope.projectsManager = projectsManager
        $scope.projects = projectsManager.findAll()
        $scope.$watch('projectsManager.findAll()',function(all) {
            $scope.projects = all
        })*/
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
        //$scope.startedProject = projectsManager.started()        
        $scope.start = function(project) {
            $scope.startedProject = project
            $scope.startedProject.$start()
            // pour refresh de l'ordre TODO faire mieux que refaire une requête
            $scope.projects = Project.query()
            //$scope.projects = projectsManager.findAll()
            $scope.sessions = Sessions.query()
            //$scope.startedProject = projectsManager.started()
            $scope.startedProject = Project.started()

        }
        $scope.stop = function(project) {
            if ($scope.startedProject) {
                $scope.startedProject.$stop()
                $scope.startedProject=null
            }
            // pour refresh de l'ordre TODO faire mieux que refaire une requête
            $scope.projects = Project.query()
            //$scope.projects = projectsManager.findAll()
            $scope.sessions = Sessions.query()
        }
        $scope.isStarted = function(project) {
            return $scope.startedProject && $scope.startedProject.id == project.id
        }
        $scope.create = function(query) {
            $http.post('/create', query).success(function() {
                $scope.projects = Project.query()    
                //$scope.projects = projectsManager.findAll()
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
    }])
   .controller('ProjectCtrl', ['$scope','$routeParams','$location','Project','Sessions','onLineStatus', function($scope,$routeParams,$location,Project,Sessions,onLineStatus) {
        $scope.onLineStatus = onLineStatus;
        $scope.isActive = onLineStatus.isOnLine()
        $scope.isDisabled = !onLineStatus.isOnLine()
        $scope.$watch('onLineStatus.isOnLine()', function(onLine) {
            $scope.isActive = onLine
            $scope.isDisabled = !onLine
        })

        
        $scope.project = Project.get({projectId: $routeParams.projectId}, null)
        $scope.sessions = Sessions.query({projectId: $routeParams.projectId})
        $scope.labelModifying = false
        
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
        
        $scope.getColor = function(session) {
            var endSession =  $scope.getEndOfPeriodSession()
            if (endSession && session.stop <= endSession.stop) {
                return "lightgray"
            }
            return $scope.project.color
        }
        
        /* Session correspondant à  la date de fin de période la + récente (ou plus vielle session sinon) */
        $scope.getEndOfPeriodSession = function() {
            var endSession = false
            $scope.sessions.forEach(function(session){
                if (session.endOfPeriod) {
                    if (!endSession || session.stop > endSession.stop) {
                        endSession = session 
                    }
                }
            })
            return endSession
        }
        
        $scope.isEndOfDay = function(session) {
            return searchIfIsEndOfDay($scope.sessions,session)
        }
        
    }])
    .controller('InfosCtrl', [function() { }]);
