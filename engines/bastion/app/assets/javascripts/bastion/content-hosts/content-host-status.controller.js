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
 * @name  Bastion.content-hosts.controller:ContentHostStatusController
 *
 * @requires $scope
 * @requires translate
 * @requires ContentHost
 */
angular.module('Bastion.content-hosts').controller('ContentHostStatusController',
    ['$scope', 'translate', 'ContentHost',
    function ($scope, translate, ContentHost) {

        $scope.statusReason = translate("Loading...");
        $scope.statusRetrieved = false;

        $scope.getComplianceReason = function (uuid) {
            if (!$scope.statusRetrieved) {
                ContentHost.get({id: uuid}, function (contentHost) {
                    if (contentHost.compliance.reasons.length < 1) {
                        $scope.statusReason = translate('No reason provided');
                    } else {
                        $scope.statusReason = '';
                        angular.forEach(contentHost.compliance.reasons, function (reason) {
                            $scope.statusReason += reason.attributes.name + '(' + reason.message + ')  ';
                        });
                    }

                    $scope.statusRetrieved = true;
                });
            }
        };

    }]
);
