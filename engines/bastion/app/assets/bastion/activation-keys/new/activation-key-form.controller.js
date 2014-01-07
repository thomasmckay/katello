/**
 * Copyright 2013 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
*/

/**
 * @ngdoc object
 * @name  Bastion.activation-keys.controller:ActivationKeyFormController
 *
 * @requires $scope
 * @requires $q
 * @requires ActivationKey
 * @requires CurrentOrganization
 *
 * @description
 *   Provides the functionality specific to ActivationKeys for creating a new activation key
 */
angular.module('Bastion.activation-keys').controller('ActivationKeyFormController',
    ['$scope', '$q', 'ActivationKey', 'CurrentOrganization',
    function ($scope, $q, ActivationKey, CurrentOrganization) {

        $scope.activationKey = $scope.activationKey || new ActivationKey();

        $scope.save = function (activationKey) {
            activationKey['organization_id'] = CurrentOrganization;
            activationKey.$save(success, error);
        };

        $scope.unlimited = true;
        $scope.activationKey['max_systems'] = -1;

        $scope.isUnlimited = function (activationKey) {
            return activationKey['max_systems'] === -1;
        };

        $scope.inputChanged = function (activationKey) {
            if ($scope.isUnlimited(activationKey)) {
                $scope.unlimited = true;
            }
        };

        $scope.unlimitedChanged = function (activationKey) {
            if ($scope.isUnlimited(activationKey)) {
                $scope.unlimited = false;
                activationKey['max_systems'] = 1;
            }
            else {
                $scope.unlimited = true;
                activationKey['max_systems'] = -1;
            }
        };

        function success(response) {
            $scope.table.addRow(response);
            $scope.transitionTo('activation-keys.details.info', {activationKeyId: $scope.activationKey.id});
        }

        function error(response) {
            $scope.working = false;
            angular.forEach(response.data.errors, function (errors, field) {
                $scope.activationKeyForm[field].$setValidity('', false);
                $scope.activationKeyForm[field].$error.messages = errors;
            });
        }

    }]
);
