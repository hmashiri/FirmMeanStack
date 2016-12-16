(function()
{
    angular
        .module("PassportApp")
        .controller("MessageCtrl", MessageCtrl);

    MessageCtrl.$inject = ['MessageFactory', 'CaseFactory','$location', '$log'];


    function MessageCtrl(MessageFactory, CaseFactory, $location, $log)
    {
        var vm = this;
        // vm.title;
        // vm.bodyDescription;
        // vm.createdBy;

        var getMessage = getMessage;
        var postMessage = postMessage;
        vm.addMessage = addMessage;
        vm.practiceAreaList = [];
        vm.attorneyAreaList = [];
        activate();

        vm.clear = function()
        {
            vm.practiceArea = (vm.practiceAreaList.length > 0 )? vm.practiceAreaList[0]: '';
            vm.createdBy = '';
            vm.title = '';
            vm.bodyDescription = '';
            vm.attorney = (vm.attorneyList.length > 0 )? vm.attorneyList[0]: '';
        };

        function activate() {

            CaseFactory.practiceAreaList().then(function( data )
            {
                $log.info("Practice Area List returned with values : " + JSON.stringify( data ) );
                vm.practiceAreaList = data.practiceAreaList;
                vm.practiceAreaList.sort( function( p1, p2 ) { return p1.toLowerCase().localeCompare( p2.toLowerCase())});
                vm.practiceArea = vm.practiceAreaList[0];
            });

            CaseFactory.attorneyList().then(function( data )
            {
                $log.info("Attorney List returned with values : " + JSON.stringify( data ) );
                vm.attorneyList = data.attorneyList;
                vm.attorneyList.sort( function( p1, p2 ) { return p1.toLowerCase().localeCompare( p2.toLowerCase())});
                vm.attorney = vm.attorneyList[0];
            });

            MessageFactory.getMessage().then(

                function(response) {

                    vm.messages = response;


                },

                function(error){


                });

        }

        function addMessage(){

            MessageFactory.postMessage(vm.title, vm.bodyDescription, vm.createdBy).then (

                function(response)
                {
                    console.log(response);
                    vm.clear();
                    $log.info("After saving new case, received a fresh list of all cases : " + response.messageList.length );
                    vm.messages = response.messageList;
                    // $location.path('/cases');
                },

                function (error)
                {
                    console.log(error);
                });
        }
    }

})();