(function()
{
    angular
        .module("PassportApp")
        .controller("MessageCtrl", MessageCtrl);

    MessageCtrl.$inject = ['MessageFactory', '$location'];


    function MessageCtrl(MessageFactory, $location)
    {
        var vm = this;
        // vm.title;
        // vm.bodyDescription;
        // vm.createdBy;

        var getMessage = getMessage;
        var postMessage = postMessage;
        vm.addMessage = addMessage;
        activate();

        function activate() {


            MessageFactory.getMessage().then(

                function(response) {

                    vm.messages = response;


                },

                function(error){


                });

        }

        function addMessage(){

            MessageFactory.postMessage(vm.title, vm.bodyDescription, vm.createdBy).then (

                function(response) {

                    console.log(response);
                    $location.path('/home');


                },

                function (error){

                    console.log(error);


                });
        }
    }

})();