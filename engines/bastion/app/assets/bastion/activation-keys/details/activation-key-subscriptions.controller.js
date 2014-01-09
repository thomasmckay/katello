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
 * @name  Bastion.systems.controller:ActivationKeySystemsController
 *
 * @requires $scope
 * @requires $location
 * @requires gettext
 * @requires Nutupane
 * @requires ActivationKey
 *
 * @description
 *   Provides the functionality for the system group details action pane.
 */
angular.module('Bastion.activation-keys').controller('ActivationKeySubscriptionsController',
    ['$scope', '$location', 'gettext', 'Nutupane', 'ActivationKey',
    function ($scope, $location, gettext, Nutupane, ActivationKey) {
        var subscriptionsPane, params;

        params = {
            'id':          $scope.$stateParams.activationKeyId,
            'search':      $location.search().search || "",
            'sort_by':     'name',
            'sort_order':  'ASC',
            'paged':       true
        };

        subscriptionsPane = new Nutupane(ActivationKey, params, 'subscriptions');
        $scope.subscriptionsTable = subscriptionsPane.table;
        $scope.subscriptionsTable.closeItem = function () {};
        $scope.isRemoving = false;

        $scope.removeSelected = function () {
            var selected = _.pluck($scope.subscriptionsTable.getSelected(), 'uuid');

            $scope.isRemoving = true;
            ActivationKey.removeSubscriptions({id: $scope.activationKey.id, 'subscription_ids': selected}, function () {
                subscriptionsPane.table.selectAll(false);
                subscriptionsPane.refresh();
                $scope.successMessages.push(gettext("Successfully removed %s subscriptions.").replace('%s', selected.length));
                $scope.isRemoving = false;
            }, function (response) {
                $scope.isRemoving = false;
                $scope.errorMessages.push(gettext("An error occurred removing the subscriptions.") + response.data.displayMessage);
            });
        };

        // TODO: move to a directive? talk to @walden
        $scope.formatAmountDisplay = function (subscription) {
            var amount = subscription.amount;
            subscription.amountDisplay = (_.isEmpty(amount) || amount < 1) ? gettext("Automatic") : amount;
            return subscription;
        }
        $scope.showAmountSelector = function (subscription) {
            return true; //subscription['multi_entitlement'];
        }
        $scope.amountSelectorValues = function (subscription) {
            return [gettext("Automatic"), 1, 2, 3];  //subscription['instance_multiplier']
        }
    }]
);
