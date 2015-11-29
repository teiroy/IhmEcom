'use strict';

angular.module("myApp", [
	'ngRoute', 'appControllers'
])

.config(
['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/welcome', {
		templateUrl: 'views/welcome.html',
		controller: 'WelcomeCtrl'
    })
    .when('/drawing', {
    	templateUrl: 'views/drawing.html',
    	controller: 'DrawingCtrl'
    })
    .otherwise({
    	redirectTo: '/welcome'
    })
}])
