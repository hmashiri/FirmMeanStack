(function()
{
    angular
        .module("PassportApp")
        .controller("CasesCtrl", CasesCtrl);


    CasesCtrl.$inject = ['CaseFactory', '$location', '$log'];


    function CasesCtrl(CaseFactory, $location, $log)
    {
        var vm = this;
        vm.caseName;
        vm.caseNumber;
        vm.attorney;
        vm.practiceArea;

        vm.practiceAreaList = [];
        vm.attorneyList = [];
        var caseData = caseData;
        var postCases = postCases;
        vm.addCases = addCases;


        vm.clear = function()
        {
            vm.practiceArea = (vm.practiceAreaList.length > 0 )? vm.practiceAreaList[0]: '';
            vm.caseName = '';
            vm.caseNumber = '';
            vm.attorney = (vm.attorneyList.length > 0 )? vm.attorneyList[0]: '';
        };

        activate();

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

            CaseFactory.caseData().then(

                function(response) {

                    vm.cases = response;


                },

                function(error){


                });

        }

        function addCases(){

            CaseFactory.postCases(vm.caseName, vm.caseNumber, vm.attorney, vm.practiceArea).then (

                function(response)
                {
                    console.log(response);
                    vm.clear();
                    $log.info("After saving new case, received a fresh list of all cases : " + response.caseList.length );
                    vm.cases = response.caseList;
                    // $location.path('/cases');
                },

                function (error)
                {
                    console.log(error);
                });
        }
    }

})();