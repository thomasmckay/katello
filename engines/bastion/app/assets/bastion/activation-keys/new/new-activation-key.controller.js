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
 * @name  Bastion.activation-keys.controller:NewActivationKeyController
 *
 * @requires $scope
 * @requires ActivationKey
 *
 * @description
 *   Controls the creation of an empty ActivationKey object for use by sub-controllers.
 */
angular.module('Bastion.activation-keys').controller('NewActivationKeyController',
    ['$scope', 'ActivationKey',
    function ($scope, ActivationKey) {

        $scope.activationKey = new ActivationKey();
        $scope.panel = {loading: false};

    }]
);
