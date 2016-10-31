angular.module('app.controllers', [])
.run(function($rootScope, $location, $window,$timeout){
	$rootScope.go = function(url){
		//$window.scrollTo(0, 0);
		$timeout( function(){
			if( url == 'back' )
				$window.history.back();
			else
				$location.url( url );
		});
	}
	$rootScope.datepickerConfig = {dateFormat: 'jYYYY-jMM-jDD', allowFuture: true};
	$rootScope.loading = false;
	$rootScope.today = moment().format('jYYYY-jM-jD');
	$rootScope.displayPrice = function(val){
		val = typeof val == 'undefined'? 0: val;
		var price = val.toString().split('').reverse().join('');
		var output = '';
		for( var i = 0; i < price.length; i+=3 ){
			output+= price.substr(i, 3) + ( price.substr(i, 3).length == 3 ? ',': '');
		}
		output = output.split('').reverse().join('');
		if( output.substr(0,1) == ',' ){
			output = output.substr(1);
		}
		return output;
	}

	
	$rootScope.tempVar = new (function(){
		var self = this;
		self.data = {};
		self.set = function(name, val){
			self.data[name] = val;
		}
		self.get = function(name, or){
			or = or || null;
			var a = angular.copy( self.data[name] || or  );
			delete self.data[name];
			return a;
		}
	})();
})
.controller('SalesCtrl', function($scope, $rootScope, $timeout){
	$scope.filters = {
		date: $rootScope.today,
		sortBy: 'id',
		text: ''
	};
	
	$scope.sortBys = [
		{ text: 'زمان ایجاد', value: 'id' },
		{ text: 'مبلغ فاکتور', value: 'price' }
	];
	
	$scope.search = function(){
		$rootScope.loading = true;
		$scope.items = [];
		$timeout( function(){
			$scope.items.push( {
				id: 1,
				customer: 1,
				customer_name: 'علی عبدالباقری',
				products: [
					{id: 1, name: 'خیار چنبل', cnt: 5}
				],
				date: new Date().getTime(),
				totalPrice: 80000,
				delivered: false,
				payed: true
			} );
			$scope.items.push( {
				id: 1,
				customer: 2,
				customer_name: 'حسن ابن‌الخطا',
				products: [
					{id: 3, name: 'اسپرسو دابل', cnt: 2},
					{id: 4, name: 'کیک وانیلی', cnt: 1},
				],
				date: new Date().getTime(),
				totalPrice: 78000,
				delivered: false,
				payed: false
			} );
			$rootScope.loading = false;
		}, 2000 );
	}
	
	$scope.$watch( 'filters', function(newVal, oldVal) {
		$scope.search();
	}, true);
    
})
.controller('SaleCtrl', function($scope, $rootScope, $timeout){
	$scope.item = {};
	$scope.item.id = 'new';
})
.controller('ProductsCtrl', function($scope, $rootScope, $timeout){
	$scope.filters = {
		date: $rootScope.today,
		sortBy: 'id',
		text: ''
	};
	
	$scope.sortBys = [
		{ text: 'زمان ایجاد', value: 'id' },
		{ text: 'قیمت', value: 'price' },
		{ text: 'میزان فروش', value: 'totalSales' }
	];
	
	$scope.search = function(){
		$rootScope.loading = true;
		$scope.items = [];
		$timeout( function(){
			$scope.items.push( {
				id: 1,
				name: 'خیار چنبل',
				totalSales: 8,
				lastSales: 2,
				price: 9800
			} );
			$scope.items.push( {
				id: 3,
				name: 'کدو حلوایی',
				totalSales: 3,
				lastSales: 2,
				price: 15000
			} );
			$scope.items.push( {
				id: 3,
				name: 'اسپرسو دابل',
				totalSales: 6,
				lastSales: 3,
				price: 6800
			} );
			$scope.items.push( {
				id: 4,
				name: 'کیک وانیلی',
				totalSales: 2,
				lastSales: 1,
				price: 12000
			} );
			$rootScope.loading = false;
		}, 500 );
	}
	
	$scope.highchartConfig = {
		options: {
			legend: { enabled: false },
			tooltip: { enabled: false },
			chart: {
				height : 70,
				spacingBottom: 5,
				spacingTop: 5,
				spacingLeft: 5,
				spacingRight: 1,
				type : "areaspline"
			},
			plotOptions: {
				series: {
					states: {
						hover: {
							enabled: true
						}
					}
				}
			}
		},
		series: [{
			name: "",
			id: ""
		}],
		title: {
			text: false
		},
		xAxis: {
			title: {
				text: false
			},
			minorGridLineWidth: 0,
			gridLineWidth: 0,
			labels: {
				enabled: true
			}
		},
		yAxis: {
			title: {
				text: false
			},
			minorGridLineWidth: 0,
			gridLineWidth: 0,
			labels: {
				enabled: true
			}
		},
		loading: false
	}
	
	$scope.highchartConfig.series = [{
		data: [5,3,3,8,10,5,3,1,5,8,9,8,1,13,4,5,7,8,9,0,5,3,3,8,10,5,3,1,5,8]
	}];
	
	$scope.$watch( 'filters', function(newVal, oldVal) {
		$scope.search();
	}, true);

})
.controller('ProductCtrl', function($scope, $rootScope, $timeout){
	$scope.item = {};
	$scope.item.id = 'new';
})
.controller('CustomersCtrl', function($scope, $rootScope, $timeout){
	$scope.filters = {
		date: $rootScope.today,
		sortBy: 'id',
		text: ''
	};
	
	$scope.sortBys = [
		{ text: 'زمان ایجاد', value: 'id' },
		{ text: 'مجموع خرید', value: 'totalBuy' },
		{ text: 'مجموع خرید یک ماه گذشته', value: 'lastBuy' }
	];
	
	$scope.search = function(){
		$rootScope.loading = true;
		$scope.items = [];
		$timeout( function(){
			$scope.items.push( {
				id: 1,
				name: 'علی عبدالباقری',
				totalBuys: 340000,
				lastBuys: 20000,
				number: '09365586015'
			} );
			$scope.items.push( {
				id: 2,
				name: 'حسن ابن‌الخطا',
				number: '09124126644',
				mail: '09124126644',
				totalBuys: 520000,
				lastBuys: 57000
			} );
			$rootScope.loading = false;
		}, 500 );
	}
	
	$scope.highchartConfig = {
		options: {
			legend: { enabled: false },
			tooltip: { enabled: false },
			chart: {
				height : 70,
				spacingBottom: 5,
				spacingTop: 5,
				spacingLeft: 5,
				spacingRight: 1,
				type : "column"
			},
			plotOptions: {
				series: {
					states: {
						hover: {
							enabled: true
						}
					}
				}
			}
		},
		series: [{
			name: "",
			id: ""
		}],
		title: {
			text: false
		},
		xAxis: {
			title: {
				text: false
			},
			minorGridLineWidth: 0,
			gridLineWidth: 0,
			labels: {
				enabled: true
			}
		},
		yAxis: {
			title: {
				text: false
			},
			minorGridLineWidth: 0,
			gridLineWidth: 0,
			labels: {
				enabled: true
			}
		},
		loading: false
	}
	
	$scope.highchartConfig.series = [{
		data: [5,3,3,8,10,5,3,1,5,8,9,8,1,13,4,5,7,8,9,0,5,3,3,8,10,5,3,1,5,8]
	}];
	
	$scope.$watch( 'filters', function(newVal, oldVal) {
		$scope.search();
	}, true);

	$scope.goToCustomer = function(index){
		$rootScope.tempVar.set( 'customer', $scope.items[index] );
		$rootScope.go('customers/'+ $scope.items[index].id);
	}
})
.controller('CustomerCtrl', function($scope, $rootScope, $timeout, $routeParams){
	var passedVar = $rootScope.tempVar.get( 'customer', {} );
	if( $routeParams.id == 'new' ){
		$scope.item = Object.assign( passedVar, {id: 'new'} );
	}
	else{
		// server request and put befroe passedVar
		$scope.item = Object.assign( passedVar, {id: $routeParams.id} );
	}

	//$scope.item.id = 'new';
	console.log( $scope.item );
})
.controller('SelectCtrl', function($scope, $rootScope, localStorageService, $server){
	$rootScope.loading = true;
	$scope.recentFiles = localStorageService.get('recentFiles');
	$scope.recentFiles = $scope.recentFiles? $scope.recentFiles: [];
	$scope.selectedFile = '';

	$scope.selectFile = function(file){
		file = file || null;
		$server.emit('selectFile', {
			file: file
		}, function(err, result){
			if( !err ){
				$scope.selectedFile = result;
				var index = $scope.recentFiles.indexOf( $scope.selectedFile );
				if( index !== -1 )
					$scope.recentFiles.splice( index, 1 );
				$scope.recentFiles.unshift( $scope.selectedFile );
				localStorageService.set('recentFiles', $scope.recentFiles);
				$rootScope.go('/main');
			}
		});
	}
	$scope.newFile = function(){
		file = typeof file == 'undefined'? null: file;
		$server.emit('newFile', {}, function(err, result){
			if( !err ){
				$scope.selectedFile = result;
				var index = $scope.recentFiles.indexOf( $scope.selectedFile )
				if( index !== -1 )
					$scope.recentFiles.splice( index, 1 );
				$scope.recentFiles.unshift( $scope.selectedFile );
				localStorageService.set('recentFiles', $scope.recentFiles);
				$rootScope.go('/main');
			}
		});
	}
	$scope.clearRecents = function(){
		$scope.recentFiles = [];
		localStorageService.set('recentFiles', []);
	}
	$scope.clearFileFromRecent = function(index){
		$scope.recentFiles.splice( index, 1 );
		localStorageService.set('recentFiles', $scope.recentFiles);
	}
	$rootScope.loading = false;
})
.controller('MainCtrl', function($scope, $server){
	$scope.exit = function(){
		$server.emit('exit');
	}
});
