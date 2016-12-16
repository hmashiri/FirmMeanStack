(function()
{
    angular
        .module("PassportApp")
        .controller("HomeController", HomeController);

    HomeController.$inject = ['CaseFactory'];


    function HomeController(CaseFactory)
    {
        var vm = this;
        var caseData = caseData;
        activate();

        function activate() {


            CaseFactory.caseData().then(

                function(response) {

                    vm.cases = response


                },

                function(error){


                });


        }
    }

})();