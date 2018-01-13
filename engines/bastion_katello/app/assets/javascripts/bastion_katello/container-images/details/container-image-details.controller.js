/**
 * @ngdoc object
 * @name  Bastion.container-images.controller:ContainerImageDetailsController
 *
 * @requires $scope
 * @requires $location
 * @requires ContainerImage
 * @requires CurrentOrganization
 * @requires ApiErrorHandler
 * @requires translate
 *
 * @description
 *   Provides the functionality for the container images details action pane.
 */
angular.module('Bastion.container-images').controller('ContainerImageDetailsController',
    ['$scope', '$location', 'ContainerImage', 'CurrentOrganization', 'ApiErrorHandler', 'translate',
    function ($scope, $location, ContainerImage, CurrentOrganization, ApiErrorHandler, translate) {
        $scope.panel = {
            error: false,
            loading: true
        };

        if ($scope.tag) {
            $scope.panel.loading = false;
        }

        $scope.tag = ContainerImage.get({id: $scope.$stateParams.tagId}, function (data) {
            if (data.manifest_schema1) {
                data.manifest_schema1["manifest_type_display"] = $scope.getManifestDisplayType(data.manifest_schema1);
            }
            if (data.manifest_schema2) {
                data.manifest_schema2["manifest_type_display"] = $scope.getManifestDisplayType(data.manifest_schema2);
            }
            $scope.panel.loading = false;
        }, function (response) {
            $scope.panel.loading = false;
            ApiErrorHandler.handleGETRequestErrors(response, $scope);
        });

        $scope.getManifestDisplayType = function (schema) {
            if (schema['manifest_type'] === 'image') {
                return translate("Image");
            }
            return translate("List");
        };
    }
]);
