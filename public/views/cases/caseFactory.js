(function(){
    'use strict';

    angular
        .module('PassportApp')
        .factory('CaseFactory', CaseFactory);

    CaseFactory.$inject = ['$http', '$q'];

    function CaseFactory($http, $q ){
        var service = {

            caseData: caseData,
            postCases: postCases,
            practiceAreaList: practiceAreaList,
            attorneyList: attorneyList
        };
        return service;


        function practiceAreaList()
        {
            var defer = $q.defer();
            $http.get('http://localhost:3002/api/caseInfo/practiceArea').then( function( response )
            {
                defer.resolve( response.data );
            });

            return defer.promise;
        }

        function attorneyList()
        {
            var defer = $q.defer();
            $http.get('http://localhost:3002/api/caseInfo/attorney').then( function( response )
            {
                defer.resolve( response.data );
            });

            return defer.promise;
        }

        function caseData(){
            var defer = $q.defer();

            $http({
                method:'GET',
                url:'http://localhost:3002/api/caseInfo/'

            })

                .then(function(response){

                        if (typeof response.data === "object") {

                            defer.resolve(response.data);

                        } else {

                            defer.reject(response);
                        }

                    },

                    function(error){

                        defer.reject(error);

                    });

            return defer.promise;
        }

        function postCases(caseName, caseNumber, attorney, practiceArea){

            var defer = $q.defer();

            // creates the body portion of the POST URL
            var info = 'caseName=' + caseName + '&caseNumber=' + caseNumber + '&attorney=' + attorney + '&practiceArea=' + practiceArea;

            $http({
                method:'POST',
                url:'http://localhost:3002/api/caseInfo',
                data: info,
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }

            })

                .then(function(response){

                        if (typeof response.data === "object") {

                            defer.resolve(response.data);

                        } else {

                            defer.reject(response);
                        }

                    },

                    function(error){

                        defer.reject(error);

                    });

            return defer.promise;
        }


    }


})();
