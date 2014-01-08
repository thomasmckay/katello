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
 * @name  Bastion.activation-keys.controller:ActivationKeyAddSubscriptionsController
 *
 * @requires $scope
 * @requires $location
 * @requires gettext
 * @requires Nutupane
 * @requires CurrentOrganization
 * @requires Subscription
 * @requires ActivationKey
 *
 * @description
 *   Provides the functionality for the activation key add subscriptions pane.
 */
angular.module('Bastion.activation-keys').controller('ActivationKeyAddSubscriptionsController',
    ['$scope', '$state', '$location', 'gettext', 'Nutupane', 'CurrentOrganization', 'Subscription', 'ActivationKey',
    function ($scope, $state, $location, gettext, Nutupane, CurrentOrganization, Subscription, ActivationKey) {

        var addSubscriptionsPane, params;

        params = {
            'organization_id':          CurrentOrganization,
            'search':                   $location.search().search || "",
            'sort_by':                  'name',
            'sort_order':               'ASC'
        };

        addSubscriptionsPane = new Nutupane(Subscription, params);
        $scope.addSubscriptionsTable = addSubscriptionsPane.table;
        $scope.isAdding  = false;
        $scope.addSubscriptionsTable.closeItem = function () {};

        $scope.showAddButton = function () {
            return $scope.addSubscriptionsTable.numSelected === 0 || $scope.isAdding || !$scope.activationKey.permissions.editable;
        };

        $scope.addSelected = function () {
            var selected;
            selected = _.pluck($scope.addSubscriptionsTable.getSelected(), 'cp_id');

            $scope.isAdding = true;
            ActivationKey.addSubscriptions({id: $scope.activationKey.id, 'subscription_ids': selected}, function () {
                $scope.successMessages.push(gettext("Successfully added %s subscriptions.").replace('%s', selected.length));
                $scope.isAdding = false;
                addSubscriptionsPane.refresh();
            }, function (response) {
                $scope.$parent.errorMessages = response.data.displayMessage;
                $scope.isAdding  = false;
            });
        };

        // TODO: move to a directive? talk to @walden
        $scope.formatAmountDisplay = function (subscription) {
            var amount = subscription.amount;
            subscription.amountDisplay = (amount === undefined || amount < 1) ? gettext("Automatic") : amount;
            return subscription;
        }
        $scope.showAmountSelector = function (subscription) {
            return subscription.selected && subscription['multi_entitlement'] === true;
        }
        $scope.amountSelectorValues = function (subscription) {
            return [gettext("Automatic"), 1, 2, 3];  //subscription['instance_multiplier']
        }
    }]
);
