'use strict';

/* Services */

angular.module('tutt.services', ['ngResource'])
    .value('version', '0.1')
    .factory('Project',function($resource){
        return $resource('/projects/:projectId', {}, {
            query: {method:'GET', params:{projectId:''}, isArray:true},
            start: {method:'POST',params:{start:true}},
            stop: {method:'POST',params:{stop:true}},
            started: {method:'GET',params:{started:true}}
        })
    })
    .factory('Sessions',function($resource){
        return $resource('/sessions', {}, {
                query: {method:'GET', params:{projectId:''}, isArray:true}
        })
    })

/* Voir http://ngmodules.org/modules/ngStorage pour localStorage */