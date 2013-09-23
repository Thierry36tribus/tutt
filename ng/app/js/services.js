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

/* Voir http://ngmodules.org/modules/ngStorage pour localStorage */