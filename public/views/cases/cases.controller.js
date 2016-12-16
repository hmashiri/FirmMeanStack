(function()
{
    angular
        .module("PassportApp")
        .controller("CasesCtrl", CasesCtrl);


    CasesCtrl.$inject = ['CaseFactory', '$location'];


    function CasesCtrl(CaseFactory, $location)
    {
        var vm = this;
        vm.caseName;
        vm.caseNumber;
        vm.attorney;
        vm.practiceArea;

        vm.practiceAreaList = ["Debt Collection", "Personal Injury", "Identity Theft"];
        var caseData = caseData;
        var postCases = postCases;
        vm.addCases = addCases;
        activate();

        function activate() {


            CaseFactory.caseData().then(

                function(response) {

                    vm.cases = response;


                },

                function(error){


                });

        }

        function addCases(){

            CaseFactory.postCases(vm.caseName, vm.caseNumber, vm.attorney, vm.practiceArea).then (

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