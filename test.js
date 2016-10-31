			/*
			db.query().create('customers',{
				'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
				'name': 'TEXT',
				'phone': 'TEXT'
			}).run(); OK
			db.query().create('products',{
				'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
				'name': 'TEXT',
				'price': 'INTEGER'
			}).run();
			db.query().create('sales',{
				'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
				'customer': 'INTEGER',
				'date': 'TEXT'
			}).run();
			db.query().create('salesDetail',{
				'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
				'sale': 'INTEGER',
				'product': 'INTEGER',
				'cnt': 'INTEGER'
			});
			*/
var db = require('nai-sql').init('/home/nainemom/Desktop/barmaDb.brm');
var async = require('async');
var moment = require('moment-jalaali');

db.db.create_function('DATE', function(str, sec){
	return typeof sec == 'undefined'? str.split(' ')[0]: str.split(' ')[0].split('-')[ ['YEAR','MONTH','DAY'].indexOf(sec) ];
});
db.db.create_function('TIME', function(str, sec){
	return typeof sec == 'undefined'? str.split(' ')[1]: str.split(' ')[1].split(':')[ ['HOUR','MINUTE','SECOND'].indexOf(sec) ];
});
db.db.create_function('DATE2NUMBER', function(str){
	return parseInt( str.split('-').join('').split(' ').join('') );
});


//var Promise = require('promise');

db.query()
.select('*', 'sales')
.run( function(result){
	console.log( '\n=============> Sales' );
	console.log( result );
});



db.query()
.select('*', 'customers')
.run( function(result){
	console.log( '\n=============> Customers' );
	console.log( result );
});

db.query()
.select('*', 'products')
.run( function(result){
	console.log( '\n=============> Products' );
	console.log( result );
});

db.query()
.select('*', 'sales')
.run( function(result){
	console.log( '\n=============> Sales' );
	console.log( result );
});

db.query()
.select('*', 'salesDetail')
.run( function(result){
	console.log( '\n=============> Sales Detail' );
	console.log( result );
});


// get customers
function getCustomers(callback){
	db.query()
	.select([
		'*'
	], 'customers')
	.run( function(customers){
		async.each(customers, function(customer, next){
			getSales( customer.id, function(sales){
				customer.seensCount = sales.length;
				customer.lastSeen = sales[ sales.length-1 ]? sales[ sales.length-1 ].date: null;
				customer.totalBuys = 0;
				var i, j;
				for( i = 0; i < sales.length; i++ ){
					for( j = 0; j < sales[i].products.length; j++ ){
						customer.totalBuys+= sales[i].products[j].productPrice * sales[i].products[j].cnt;
					}
				}
				next();
			});

		}, function(err){
			callback( customers );
		});
	});
}
function getProducts( callback ){
	var oneMonthAgo = moment();
	oneMonthAgo.subtract( 1, 'jMonth');
	oneMonthAgo = parseInt( oneMonthAgo.format('jYYYYjMMjDD') );

	db.query()
	.select([
		't1.*',
		'SUM(t2.cnt) AS salesCount'
	], 'products t1')
	.leftJoin('salesDetail t2', 't1.id = t2.product' )
	.groupBy('t1.id')
	.run( function(result){
		async.each(result, function(product, next){
			//console.log( [product.id, oneMonthAgo]  );
			product.last30DaysSales = [];
			db.query()
			.select([
				'DATE(t1.date) AS date',
				'SUM(t2.cnt) AS totalSales'
			], 'sales t1')
			.leftJoin('salesDetail t2', 't1.id = t2.sale')
			.where('t2.product = ? AND DATE2NUMBER(DATE(t1.date)) > ?', [product.id, oneMonthAgo] )
			.groupBy( 'DATE(t1.date)' )
			.run( function( last30 ){
				var dtt = moment();
				var dt = moment();
				var i;
				dt.subtract( 1, 'jMonth');
				product.last30DaysSales = {};
				while( parseInt( dt.format('jYYYYjMMjDD') ) <= parseInt( dtt.format('jYYYYjMMjDD') ) ){
					product.last30DaysSales[ dt.format('jYYYY-jMM-jDD') ] = 0;
					for( i = 0; i < last30.length; i++ ){
						if( last30[i].date == dt.format('jYYYY-jMM-jDD') ){
							product.last30DaysSales[ dt.format('jYYYY-jMM-jDD') ] = last30[i].totalSales;
						}
					}
					dt.add( 1, 'day');
				}
				next();
			});
			//product.last30DaysSales = [];




		}, function(err){
			callback( result );
		});
	});
}
function getSales(customer, callback){
	db.query()
	.select([
		't1.*',
		't2.name AS customerName',
		't2.phone AS customerPhone'
	], 'sales t1')
	.leftJoin('customers t2', 't1.customer = t2.id')
	.where( 't1.customer LIKE ?', [customer] )
	.run( function(result){
		async.each(result, function(sale, next){
			db.query()
			.select([
				't1.*',
				't2.name AS productName',
				't2.price AS productPrice'
			], 'salesDetail t1')
			.leftJoin('products t2', 't1.product = t2.id')
			.where('sale = ?', [sale.id])
			.run( function( products ){
				sale.products = products;
				next();
			});
		}, function (err) {
			callback( result );
		});
	});
}
getCustomers( function(result){
	console.log( '\n=============> Query #1' );
	console.log(result);
});

getProducts( function(result){
	console.log( '\n=============> Query #2' );
	console.log( result );
});

getSales( '%', function(result){
	console.log( '\n=============> Query #3' );
	console.log(result);
});
