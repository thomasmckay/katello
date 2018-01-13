/**
 * @ngdoc service
 * @name  Bastion.container-images.factory:ContainerImage
 *
 * @requires BastionResource
 *
 * @description
 *   Provides a BastionResource for Container Images
 */
angular.module('Bastion.container-images').factory('ContainerImage',
    ['BastionResource', function (BastionResource) {

        return BastionResource('katello/api/v2/container_images/:id/',
            {id: '@id'},
            {
                autocomplete: {method: 'GET', isArray: true, params: {id: 'auto_complete_search'}},
                'autocompleteName': {method: 'GET', isArray: false, params: {id: 'auto_complete_name'},
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return {results: data};
                    }
                }
            }
        );

    }]
);
