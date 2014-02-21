/**
 * Copyright 2014 Red Hat, Inc.
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
 * @name  Bastion.roles.controller:RoleDetailsController
 *
 * @requires $scope
 * @requires $state
 * @requires Role
 *
 * @description
 *   Provides the functionality for the role details action pane.
 */
angular.module('Bastion.roles').controller('RoleDetailsController',
    ['$scope', '$state', 'Role', function ($scope, $state, Role) {

        $scope.successMessages = [];
        $scope.errorMessages = [];

        if ($scope.role) {
            $scope.panel = {loading: false};
        } else {
            $scope.panel = {loading: true};
        }

        $scope.role = Role.get({id: $scope.$stateParams.roleId}, function () {
            $scope.panel.loading = false;
        });

        $scope.removeRole = function (role) {
            var id = role.id;

            role.$delete(function () {
                $scope.removeRow(id);
                $scope.transitionTo('roles.index');
            });
        };
    }]
);
