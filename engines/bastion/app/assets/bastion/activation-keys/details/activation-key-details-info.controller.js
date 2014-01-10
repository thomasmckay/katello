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
 * @name  Bastion.systems.controller:ActivationKeyDetailsInfoController
 *
 * @requires $scope
 * @requires ContentView
 *
 * @description
 *   Provides the functionality for the system group details action pane.
 */
angular.module('Bastion.activation-keys').controller('ActivationKeyDetailsInfoController',
    ['$scope', '$q', 'ContentView',
        function ($scope, $q, ContentView) {

        $scope.editContentView = false;

        $scope.$on('activationKey.loaded', function () {
            $scope.setupSelector();
        });

        $scope.setEnvironment = function (environmentId) {
            environmentId = parseInt(environmentId, 10);

            if ($scope.previousEnvironment !== environmentId) {
                $scope.previousEnvironment = $scope.activationKey.environment.id;
                $scope.activationKey.environment.id = environmentId;
                $scope.editContentView = true;

                /*jshint camelcase:false*/
                $scope.pathSelector.disable_all();
            }
        };

        $scope.cancelContentViewUpdate = function () {
            if ($scope.editContentView) {
                $scope.editContentView = false;
                $scope.activationKey.environment.id = $scope.previousEnvironment;

                /*jshint camelcase:false*/
                $scope.pathSelector.enable_all();
                $scope.pathSelector.select($scope.previousEnvironment);
            }
        };

        $scope.saveContentView = function (activationKey) {
            $scope.previousEnvironment = undefined;
            $scope.save(activationKey);

            /*jshint camelcase:false*/
            $scope.pathSelector.enable_all();
        };

        $scope.contentViews = function () {
            var deferred = $q.defer();

            ContentView.query({ 'environment_id': $scope.activationKey.environment.id }, function (response) {
                deferred.resolve(response.results);
            });

            return deferred.promise;
        };


        $scope.limitTranslations = {"-1": "Unlimited"};

        $scope.isUnlimited = function (group) {
            return group['max_systems'] === -1;
        };

        $scope.unlimitedChanged = function () {
            if ($scope.isUnlimited($scope.group)) {
                $scope.group['max_systems'] = 1;
            } else {
                $scope.group['max_systems'] = -1;
            }
        };

    }]
);
