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
    .when('/backImage', {
    	templateUrl: 'views/backImage.html',
    	controller: 'BackImageCtrl'
    })
    .when('/help', {
    	templateUrl: 'views/help.html',
    	controller: 'HelpCtrl'
    })
    .otherwise({
    	redirectTo: '/welcome'
    })
}])
