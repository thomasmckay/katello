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
 * @name  Bastion.roles.controller:RolesController
 *
 * @requires $scope
 * @requires $location
 * @requires Nutupane
 * @requires Role
 * @requires CurrentOrganization
 *
 * @description
 *   Provides the functionality specific to Roles for use with the Nutupane UI pattern.
 *   Defines the columns to display and the transform function for how to generate each row
 *   within the table.
 */
angular.module('Bastion.roles').controller('RolesController',
    ['$scope', '$location', 'Nutupane', 'Role', 'CurrentOrganization',
    function ($scope, $location, Nutupane, Role, CurrentOrganization) {

        var watch, params = {
            'organization_id':  CurrentOrganization,
            'search':           $location.search().search || "",
            'sort_by':          'name',
            'sort_order':       'ASC',
            'enabled' :         true,
            'paged':            true
        };

        var nutupane = new Nutupane(Role, params);
        $scope.roleTable = nutupane.table;
        $scope.roleTable.refresh = nutupane.refresh;
        $scope.removeRow = nutupane.removeRow;

        $scope.roleTable.closeItem = function () {
            $scope.transitionTo('roles.index');
        };

        $scope.table = $scope.roleTable;

    }]
);
