(function(){
    'use strict';

    angular
        .module('PassportApp')
        .factory('MessageFactory', MessageFactory);

    MessageFactory.$inject = ['$http', '$q'];

    function MessageFactory($http, $q){
        var service = {

            getMessage: getMessage,
            postMessage: postMessage
        };
        return service;

        function getMessage(){
            var defer = $q.defer();

            $http({
                method:'GET',
                url:'http://localhost:3002/api/message/'

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

        function postMessage(title, bodyDescription, createdBy){

            var defer = $q.defer();

            // creates the body portion of the POST URL
            var info = 'title=' + title + '&bodyDescription=' + bodyDescription + '&createdBy=' + createdBy;

            $http({
                method:'POST',
                url:'http://localhost:3002/api/message',
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
