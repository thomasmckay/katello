/**
 * @ngdoc object
 * @name  Bastion.container-images.controller:ContainerImageDetailsController
 *
 * @requires $scope
 * @requires $location
 * @requires ContainerImage
 * @requires CurrentOrganization
 *
 * @description
 *   Provides the functionality for the container images details environments list.
 */
angular.module('Bastion.container-images').controller('ContainerImageEnvironmentsController',
    ['$scope', '$location', 'Nutupane', 'ContainerImage', 'CurrentOrganization',
    function ($scope, $location, Nutupane, ContainerImage, CurrentOrganization) {
        var params = {
            'organization_id': CurrentOrganization,
            'search': $location.search().search || "",
            'sort_by': 'name',
            'sort_order': 'ASC',
            'paged': false
        };
        var nutupane = new Nutupane(ContainerImage, params, null, {disableAutoLoad: true});

        var renderTable = function () {
            var ids = _.map($scope.tag.related_tags, 'id');
            var newParams = {
                'organization_id': CurrentOrganization,
                'search': $location.search().search || "",
                'sort_by': 'name',
                'sort_order': 'ASC',
                'paged': false,
                'ids[]': ids
            };
            $scope.table = nutupane.table;
            nutupane.setParams(newParams);
            $scope.panel.loading = false;
            if (!_.isEmpty(ids)) {
                nutupane.refresh();
            }
        };

        $scope.controllerName = 'katello_container_images';

        if ($scope.tag) {
            $scope.panel.loading = false;
        }

        if ($scope.tag && $scope.tag.related_tags) {
            renderTable();
        } else {
            $scope.tag.$promise.then(renderTable);
        }
    }
]);
