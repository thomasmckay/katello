/**
 * @ngdoc object
 * @name Bastion.container-images.config
 *
 * @requires $stateProvider
 *
 * @description
 *   State routes defined for the container images module.
 */
angular.module('Bastion.container-images').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('container-images', {
        url: '/container_images',
        permission: ['view_products', 'view_content_views'],
        template: '<div ui-view></div>',
        views: {
            '@': {
                controller: 'ContainerImagesController',
                templateUrl: 'container-images/views/container-images.html'
            }
        },
        ncyBreadcrumb: {
            label: "{{ 'Container Images' | translate }}"
        }
    })
    .state('container-image', {
        abstract: true,
        url: '/container_images/:tagId',
        permission: 'view_products',
        controller: 'ContainerImageDetailsController',
        templateUrl: 'container-images/details/views/container-image-details.html',
        ncyBreadcrumb: {
            label: "{{ 'Container Images' | translate }}",
            parent: 'container-images'
        }
    })
    .state('container-image.info', {
        url: '',
        permission: 'view_products',
        templateUrl: 'container-images/details/views/container-image-info.html',
        ncyBreadcrumb: {
            label: "{{ tag.name }}",
            parent: 'container-image'
        }
    })
    .state('container-image.environments', {
        url: '/environments',
        permission: 'view_environments',
        templateUrl: 'container-images/details/views/container-image-environments.html',
        controller: 'ContainerImageEnvironmentsController',
        ncyBreadcrumb: {
            label: "{{ 'Lifecycle Environments' | translate }}",
            parent: 'container-image.info'
        }
    });
}]);
