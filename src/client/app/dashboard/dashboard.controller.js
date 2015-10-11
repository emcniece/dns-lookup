(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$q', 'dataservice', 'logger'];
    /* @ngInject */
    function DashboardController($scope, $q, dataservice, logger) {
        var vm = this;
        vm.news = {
            title: 'dnsLookup',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';

        vm.recordTypes = ['A', 'AAAA', 'AFSDB', 'APL', 'CAA', 'CDNSKEY', 'CDS', 'CERT',
            'CNAME', 'DHCID', 'DLV', 'DNAME', 'DNSKEY', 'DS', 'HIP', 'IPSECKEY', 'KEY',
            'KX', 'LOC', 'MX', 'NAPTR', 'NS', 'NSEC', 'NSEC3', 'NSEC3PARAM', 'PTR', 'RRSIG',
            'RP', 'SIG', 'SOA', 'SRV', 'SSHFP', 'TA', 'TKEY', 'TLSA', 'TSIG', 'TXT'];
        vm.selection = ['A', 'AAAA', 'CNAME', 'TXT'];
        vm.DomainNames = ['google.com'];

        activate();

        function activate() {
            var promises = [getMessageCount(), getPeople(), getRecords()];
            return $q.all(promises).then(function() {
                logger.info('Activated Dashboard View');
            });
        }

        function getMessageCount() {
            return dataservice.getMessageCount().then(function (data) {
                vm.messageCount = data;
                return vm.messageCount;
            });
        }

        function getPeople() {
            return dataservice.getPeople().then(function (data) {
                vm.people = data;
                return vm.people;
            });
        }

        function getRecords() {
            var pkg = {records: vm.selection, domains: vm.DomainNames};

            return dataservice.getRecords(pkg).then(function (data) {
                vm.ProcessedDomains = data;
                return vm.ProcessedDomains;
            });
        }

        $scope.toggleSelection = function(recordName) {

            var idx = vm.selection.indexOf(recordName);

            // is currently selected
            if (idx > -1) {
                vm.selection.splice(idx, 1);
            }

            // is newly selected
            else {
                vm.selection.push(recordName);
            }

        };

        $scope.updateTable = function() {
            console.log('updating table');
        };
    }
})();
