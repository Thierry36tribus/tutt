'use strict';

/* Services */

angular.module('tutt.services', ['ngResource'])
    .value('version', '0.2')
    .factory('Project',function($resource){
        return $resource('/projects/:projectId', {}, {
            query: {method:'GET', params:{projectId:''}, isArray:true},
            start: {method:'POST',params:{start:true}},
            stop: {method:'POST',params:{stop:true}},
            started: {method:'GET',params:{started:true}}
        })
    })
    .factory('Sessions',function($resource){
        return $resource('/sessions/:sessionId', {}, {
                query: {method:'GET', params:{projectId:''}, isArray:true}
        })
    })
    .factory('onLineStatus', ["$window", "$rootScope", function ($window, $rootScope) {
        var onLineStatus = {};    
        onLineStatus.onLine = $window.navigator.onLine;
        onLineStatus.isOnLine = function() {
            return onLineStatus.onLine;
        }
    
        $window.addEventListener("online", function () {
            onLineStatus.onLine = true;
            $rootScope.$digest();
        }, true);
    
        $window.addEventListener("offline", function () {
            onLineStatus.onLine = false;
            $rootScope.$digest();
        }, true);
    
        return onLineStatus;
    }])
    .factory('projectsManager', ['$window','$rootScope','$http', function ($window,$rootScope,$http) {
        // NON UTILISE POUR L'INSTANT, en cours...
        
        var KEY_PROJECTS = 'tutt.projects'
        var KEY_STARTED = 'tutt.started'
        var projectsManager = {}
        projectsManager.findAll = function() {
           if (!projectsManager.all) {
                projectsManager.all = JSON.parse($window.localStorage.getItem(KEY_PROJECTS))
                $http.get('/projects')
                    .success(function(data) {
                        $window.localStorage.setItem(KEY_PROJECTS,JSON.stringify(data))
                        projectsManager.all = data                 
                       // inutile ? mais comment les données sont-elles mises à jour ? $rootScope.$digest()
                    })
                    .error(function(data, status, headers, config) {
                    // TODO si online, avertir l'utilisateur ?                   
                    })
           }
           return projectsManager.all
        }
        projectsManager.started = function() {
            if (!projectsManager.startedProject) {
                projectsManager.startedProject = JSON.parse($window.localStorage.getItem(KEY_STARTED))
                $http.get('/projects?started=true')
                    .success(function(data) {
                        $window.localStorage.setItem(KEY_STARTED,JSON.stringify(data))
                        projectsManager.startedProject = data                 
                       // inutile ? mais comment les données sont-elles mises à jour ? $rootScope.$digest()
                    })
                    .error(function(data, status, headers, config) {
                    // TODO si online, avertir l'utilisateur ?                   
                    })                
            }
            return projectsManager.startedProject
        }
        
        projectsManager.start = function(project) {
            var index = indexOf(project)
            if (index >= 0) {
                projectsManager.all[i].lastUpdate = new Date()
                // TODO créer session, etc.
                
                
            }
        }
        projectsManager.stop = function(project) {
            
        }
        
        var indexOf = function(project) {
            for (var i=0; i < projectsManager.all.length; i++) {
                if (projectsManager.all[i].id === project.id) {
                    return i;
                }
            }
            return -1;
        }
        
        
        
       return projectsManager
    }])

