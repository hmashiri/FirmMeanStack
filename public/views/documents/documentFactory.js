(function() {
    'use strict';

    angular
        .module('PassportApp')
        .factory('documentsFactory', documentsFactory);

    documentsFactory.$inject = ['$http', '$q'];

    /* @ngInject */
    function documentsFactory($http, $q) {

        var service = {
            getAllDocuments: getAllDocuments,
            downloadDocument: downloadDocument
        };
        return service;

        ////////////////

        function getAllDocuments() {
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: 'http://localhost:3001/api/files/everything/'
            })
                .then(function(response) {
                        if (typeof response.data === "object") {
                            defer.resolve(response.data);
                        } else {
                            defer.reject(response);
                        }
                    },

                    function(error) {
                        defer.reject(error);
                    });
            return defer.promise;
        }


        function downloadDocument(fileId, filename) {

            var defer = $q.defer();

            $http({
                method: 'GET',
                url: 'http://localhost:3001/api/files/' + fileId,
                responseType: 'arraybuffer'

            })

                .then(function(response) {
                        // Grab the file data and create a blob
                        var file = new Blob([response.data]);
                        // Save the file to the client's machine
                        saveAs(file, filename);
                        defer.resolve(response.data);

                    },

                    function(error) {

                        defer.reject(error);

                    });

            return defer.promise;
        }
    }

})();