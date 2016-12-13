(function()
{
    angular
        .module("PassportApp")
        .controller("DocumentsCtrl", DocumentsCtrl)
        .factory("AttorneyImageService", AttorneyImageService)
        .factory("DownloadFileService", DownloadFileService);

    function AttorneyImageService( $http, $rootScope)
    {

        this.retrieveImageInfo = function()
        {
            $http.get('http://localhost:3001/api/attorneyImages').success( function( data )
            {
                $rootScope.$broadcast('jpgsReceived', data);
                console.log("Received data : " + JSON.stringify( data ));
            })
            .error( function( data )
            {
                console.log('Error Received : ' + JSON.stringify( data ));
            });

            console.log('Still processing while getting image data');

            for( var i = 0; i < 10; i++)
            {
                console.log("Count: " + i);
            }

        };

        return this;
    }

    function DownloadFileService( $http, $rootScope, $q)
    {
        var service = {

            downloadFile: downloadFile,

        };
        return service;


        function  downloadFile(file_id, filename )
        {
            var defer = $q.defer();

            $http
            ({
                method: 'GET',
                url: 'http://localhost:3001/api/files/' + file_id,
                responseType: 'arraybuffer'
            })

                .then (function(response)
                {
                    var file = new Blob([response.data]);

                    saveAs(file, filename);
                    defer.resolve(response);
                },

                function(error)
                {
                    defer.reject(error)
                });

                return defer.promise;
        }
    }



    function DocumentsCtrl($scope, $http, DownloadFileService, AttorneyImageService)
    {
        var vm = this;
        vm.title = 'Controller';
        vm.test = 'TESTING WORKS';

        vm.imageValues = [];
        vm.downloadOnClick = downloadOnClick;
        AttorneyImageService.retrieveImageInfo();


        $scope.$on('jpgsReceived', function (msg, data)
        {
            vm.imageValues = data;
        });

        activate();

        function activate() {}

        function downloadOnClick(file_id, filename)
        {
            console.log(file_id);

            DownloadFileService.downloadFile(file_id, filename).then(function(response)

            {
                  console.log(response);
            })

        }

        $scope.add = function(){
            var f = document.getElementById('file').files[0],
                r = new FileReader();
            r.onloadend = function(e){
                var data = e.target.result;
                //send your binary data via $http or $resource or do anything else with it
            };
            r.readAsBinaryString(f);
        }

    }

})();