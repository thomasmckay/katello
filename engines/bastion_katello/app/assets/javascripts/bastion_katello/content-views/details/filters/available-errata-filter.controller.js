/**
 * @ngdoc object
 * @name  Bastion.content-views.controller:AvailableErrataFilterController
 *
 * @requires $scope
 * @requires translate
 * @requires Nutupane
 * @requires Filter
 * @requires Rule
 *
 * @description
 *   Handles loading of errata that is available to be added to a filter and provides
 *   functionality to create filter rules based off selected errata.
 */
angular.module('Bastion.content-views').controller('AvailableErrataFilterController',
    ['$scope', 'translate', 'Nutupane', 'Erratum', 'Rule',
    function ($scope, translate, Nutupane, Erratum, Rule) {

        var nutupane, filterByDate;

        function success(data) {
            $scope.filter.rules = _.union($scope.filter.rules, data.results);
            $scope.$parent.successMessages = [translate('Errata successfully added.')];
            nutupane.table.selectAllResults(false);
            nutupane.refresh();
        }

        function failure(response) {
            $scope.$parent.errorMessages = [response.data.displayMessage];
        }

        function saveRules(rules, filter) {
            var params = {filterId: filter.id};

            return rules.$save(params, success, failure);
        }

        $scope.nutupane = nutupane = new Nutupane(Erratum, {
                filterId: $scope.$stateParams.filterId,
                'sort_order': 'DESC',
                'sort_by': 'issued',
                'available_for': 'content_view_filter'
            },
            'queryUnpaged'
        );
        nutupane.masterOnly = true;
        nutupane.enableSelectAllResults();

        filterByDate = function (date, type) {
            date = date.toISOString().split('T')[0];
            nutupane.addParam(type, date);
            nutupane.refresh();
        };

        $scope.detailsTable = nutupane.table;

        $scope.addErrata = function (filter) {
            var errataIds,
                rules,
                results = nutupane.getAllSelectedResults('errata_id');

            if (nutupane.table.allResultsSelected) {
                rules = new Rule({'errata_ids': results});
            } else {
                errataIds = results.included.ids;
                rules = new Rule({'errata_ids': errataIds});
            }

            nutupane.table.working = true;
            saveRules(rules, filter);
        };

        $scope.updateTypes = function (errataTypes) {
            var types = [];

            angular.forEach(errataTypes, function (value, key) {
                if (value) {
                    types.push(key);
                }
            });

            nutupane.addParam('types[]', types);
            nutupane.refresh();
        };

        $scope.$watch('rule.start_date', function (start) {
            if (start) {
                filterByDate(start, 'start_date');
            }
        });

        $scope.$watch('rule.end_date', function (end) {
            if (end) {
                filterByDate(end, 'end_date');
            }
        });

    }]
);
