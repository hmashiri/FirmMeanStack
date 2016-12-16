(function() {
    angular
        .module("PassportApp")
        .controller("DocumentsCtrl", DocumentsCtrl);


    DocumentsCtrl.$inject = ['$http', '$q', 'Upload', '$scope', '$rootScope', 'documentsFactory'];



    function DocumentsCtrl($http, $q, Upload, $scope, $rootScope, documentsFactory) {
        var vm = this;
        vm.upload = upload;
        vm.downloadFile = downloadFile;

        activate();

        function activate() {

            documentsFactory.getAllDocuments().then(
                function(response) {
                    console.log(response);
                    vm.files = response;
                });
        }




        function upload(file) {
            if (file === null)
                return;
            Upload.upload({
                url: 'http://localhost:3001/api/',
                data: { file: file }
            }).then(function(response) {
                    console.log(response);
                    alert('Upload Complete');
                    vm.files.push(response.data);
                },
                function(error) {
                    console.log(error)
                });


        }

        function downloadFile(fileid, filename) {
            documentsFactory.downloadDocument(fileid, filename).then(
                function(response) {
                    console.log(response);
                    vm.downloadfiles = response;
                },

                function(error) {

                    console.log(error);
                });
        }

    }








})();