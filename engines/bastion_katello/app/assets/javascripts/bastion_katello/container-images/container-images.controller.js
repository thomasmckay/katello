/**
 * @ngdoc object
 * @name  Bastion.container-images.controller:ContainerImagesController
 *
 * @requires $scope
 * @requires $location
 * @requires Nutupane
 * @requires ContainerImage
 * @requires CurrentOrganization
 *
 * @description
 *   Provides the functionality specific to container images for use with the Nutupane UI pattern.
 *   Defines the columns to display and the transform function for how to generate each row
 *   within the table.
 */
angular.module('Bastion.container-images').controller('ContainerImagesController',
    ['$scope', '$location', 'Nutupane', 'ContainerImage', 'CurrentOrganization',
    function ($scope, $location, Nutupane, ContainerImage, CurrentOrganization) {

        var params = {
            'organization_id': CurrentOrganization,
            'sort_by': 'name',
            'sort_order': 'ASC',
            'grouped': true
        };

        var nutupane = new Nutupane(ContainerImage, params);
        $scope.controllerName = 'katello_container_images';
        $scope.table = nutupane.table;

        $scope.table.closeItem = function () {
            $scope.transitionTo('container-images');
        };

        $scope.availableSchemaVersions = function (tag) {
            var versions = [];
            if (tag.manifest_schema1) {
                versions.push(1);
            }

            if (tag.manifest_schema2) {
                versions.push(2);
            }
            return versions.join(", ");
        };
    }]
);
