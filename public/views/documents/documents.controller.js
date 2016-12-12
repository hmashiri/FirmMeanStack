(function()
{
    angular
        .module("PassportApp")
        .controller("DocumentsCtrl", DocumentsCtrl)
        .factory("AttorneyImageService", AttorneyImageService);

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

    function DocumentsCtrl($scope, $http, AttorneyImageService)
    {
        var vm = this;
        vm.title = 'Controller';
        vm.test = 'TESTING WORKS';

        vm.imageValues = [];

        AttorneyImageService.retrieveImageInfo();

        $scope.$on('jpgsReceived', function (msg, data)
        {
            vm.imageValues = data;
        });

        activate();

        function activate() {}
    }

})();