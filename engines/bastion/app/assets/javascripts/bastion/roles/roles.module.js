/**
 Copyright 2014 Red Hat, Inc.

 This software is licensed to you under the GNU General Public
 License as published by the Free Software Foundation; either version
 2 of the License (GPLv2) or (at your option) any later version.
 There is NO WARRANTY for this software, express or implied,
 including the implied warranties of MERCHANTABILITY,
 NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 have received a copy of GPLv2 along with this software; if not, see
 http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 **/

/**
 * @ngdoc module
 * @name  Bastion.roles
 *
 * @description
 *   Module for roles
 */
angular.module('Bastion.roles', [
    'ngResource',
    'alchemy',
    'alch-templates',
    'ui.router',
    'Bastion.widgets'
]);

/**
 * @ngdoc object
 * @name Bastion.roles.config
 *
 * @requires $stateProvider
 *
 * @description
 *   Used for roles level configuration such as setting up the ui state machine.
 */
angular.module('Bastion.roles').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('roles', {
        abstract: true,
        controller: 'RolesController',
        templateUrl: 'roles/views/roles.html'
    });

    $stateProvider.state('roles.index', {
        url: '/roles',
        views: {
            'table': {
                templateUrl: 'roles/views/roles-table-full.html'
            }
        }
    })

/*
    .state('roles.details', {
        abstract: true,
        url: '/roles/:roleId',
        collapsed: true,
        views: {
            'table': {
                templateUrl: 'roles/views/roles-table-collapsed.html'
            },
            'action-panel': {
                controller: 'RoleDetailsController',
                templateUrl: 'roles/details/views/role-details.html'
            }
        }
    })
    .state('roles.details.info', {
        url: '/info',
        collapsed: true,
        templateUrl: 'roles/details/views/role-info.html'
    });
*/

}]);
