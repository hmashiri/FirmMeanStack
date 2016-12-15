(function()
{
    angular
        .module("PassportApp")
        .controller("LoginCtrl", LoginCtrl);
    
    function LoginCtrl($scope, $location, $rootScope, UserService, $log )
    {
        function readyToLogin()
        {
            return ( $scope.user.username && $scope.user.username.length > 4  &&
                $scope.user.password && $scope.user.password.length >= 4 );
        }


        $scope.login = function()
        {
            if(readyToLogin())
            {
                UserService.login($scope.user).then(function (response)
                {
                    $rootScope.currentUser = response.data;
                    $location.url("/home");
                },
                function(err)
                {
                    $scope.error = err;
                });
            }

        };

        $scope.keypress = function( event )
        {
            $log.info('key pressed : ' + event.key);

            if( event.key === "Enter" && readyToLogin() )
            {
                $scope.login();
            }

        };
    }
  
})();
