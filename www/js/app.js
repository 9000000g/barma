angular.module('app', ['ngNaiFramework', 'app.services', 'app.controllers'])
.config(function($routeProvider, localStorageServiceProvider) {
	$routeProvider
	.when('/main', {
		templateUrl: 'templates/main.html',
		controller: 'MainCtrl'
	})
	.when('/sales', {
		templateUrl: 'templates/sales.html',
		controller: 'SalesCtrl'
	})
	.when('/sales/:id', {
		templateUrl: 'templates/sale.html',
		controller: 'SaleCtrl'
	})
	.when('/products', {
		templateUrl: 'templates/products.html',
		controller: 'ProductsCtrl'
	})
	.when('/products/:id', {
		templateUrl: 'templates/product.html',
		controller: 'ProductCtrl'
	})
	.when('/customers', {
		templateUrl: 'templates/customers.html',
		controller: 'CustomersCtrl'
	})
	.when('/customers/:id', {
		templateUrl: 'templates/customer.html',
		controller: 'CustomerCtrl'
	})
	.when('/select', {
		templateUrl: 'templates/select.html',
		controller: 'SelectCtrl'
	})
	.otherwise({
		redirectTo: '/select'
	});
	
	localStorageServiceProvider.setPrefix('Barma');
})

