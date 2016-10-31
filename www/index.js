var naiApp = new (function(){
	var self = this;	
	self._on = {};
	self.on = function(e, f){
		self._on[e] = f;
		return self;
	}
	self.run = function(port){
		var http = require('http').createServer().listen(port);
		var io = require('socket.io')(http);
		io.on('connection', function(socket){
			for( var i in self._on ){
				socket.on(i, self._on[i]);
			}
		});
		return self;
	}
	return self;
})();
var db = false;

naiApp
.on('exit', function(){
	try{
		if (process.platform != 'darwin'){
			app.quit();
		}
		else{
			mainWindow.minimize();
		}
	}
	catch(error){
		console.log(error);
	}
})
.on('selectFile', function(data, callback){
	try{
		var file;
		if( typeof data.file == 'undefined' || !data.file ){
			var selectedFiles = electron.dialog.showOpenDialog({
				properties: ['openFile'],
				filters: [
					{name: 'Barma Database', extensions: ['brm']}
				]
			});
			if( typeof selectedFiles != 'undefined' ){ //&& selectedFiles.constructor == Array ){
				data.file = selectedFiles[0];
			}
			else{
				data.file = false;
			}
		}
		if( data.file && fs.lstatSync(data.file).isFile() ){
			db = require('nai-sql').init(data.file);
			callback( false, data.file );
		}
		else{
			db = false;
			callback( true, false );
		}
	}
	catch(err){
		console.log(err);
		callback(true, err);
	}
})
.on('newFile', function(data, callback){
	try{
		var file;
		//console.log( electron.dialog.showSaveDialog() );
		
		var selectedFiles = electron.dialog.showSaveDialog({
			title: 'Open Database'
		});
		console.log(typeof selectedFiles);
		if( typeof selectedFiles != 'undefined' ){ // && selectedFiles.constructor == String ){
			file = selectedFiles + '.brm';
		}
		else{
			file = false;
		}
		
		if( file != false ){
			db = require('nai-sql').init();
			db.query().create('customers',{
				'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
				'name': 'TEXT',
				'phone': 'TEXT'
			}).run();
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
			}).run();
			db.save(file);
			db.dbFile = file;
			callback( false, file );
		}
		else{
			db = false;
			callback( true, false );
		}
	}
	catch(err){
		console.log(err);
		callback(true, err);
	}
})
.on('customers-get', function(data, callback){
	try{
		if( typeof data.id == 'undefined' )
			data.id = false;
		db.query()
		.select([
			't1.id',
			't1.name',
			't1.phone'
		], 'customers t1')
		.leftJoin('groups t2', 't1.grp = t2.id')
		.where( 't1.id' + (data.id!==false? ('= '+data.id): '> 0') )
		.run(function(result){
			callback(false, result);
		});
	}
	catch(err){
		console.log(err);
		callback(true, err);
	}
})
.on('customers-set', function(data, callback){
	try{
		if( typeof data.id == 'undefined' )
			data.id = false;
		db.query()
		.select([
			't1.id',
			't1.name',
			't1.code',
			't1.description',
			't2.id AS grp',
			't2.name AS grp_name'
		], 'customers t1')
		.leftJoin('groups t2', 't1.grp = t2.id')
		.where( 't1.id' + (data.id!==false? ('= '+data.id): '> 0') )
		.run(function(result){
			callback(false, result);
		});
	}
	catch(err){
		console.log(err);
		callback(true, err);
	}
})
.run( 5623 );


/*
io.on('connection', function(socket){
	socket.on('exit', function(){
		if (process.platform != 'darwin')
			app.quit();
		else
			mainWindow.minimize();
	})
	socket.on('selectFile', function(data, callback){
		try{
			var file;
			if( typeof data.file == 'undefined' || !data.file ){
				var dialog = require('dialog');
				var selectedFiles = dialog.showOpenDialog({
					properties: ['openFile'],
					filters: [
						{name: 'Rasool Database File', extensions: ['rdf']}
					]
				});
				if( typeof selectedFiles != 'undefined' && selectedFiles.constructor == Array ){
					data.file = selectedFiles[0];
				}
				else{
					data.file = false;
				}
			}
			if( data.file && require('fs').lstatSync(data.file).isFile() ){
				db = require('nai-sql').init(data.file);
				callback( false, data.file );
			}
			else{
				db = false;
				callback( true, false );
			}
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	socket.on('newFile', function(data, callback){
		try{
			var file;
			var dialog = require('dialog');
			var selectedFiles = dialog.showSaveDialog();
			if( typeof selectedFiles != 'undefined' && selectedFiles.constructor == String ){
				file = selectedFiles + '.rdf';
			}
			else{
				file = false;
			}
			
			if( file != false ){
				db = require('nai-sql').init();
				db.query().create('customers',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'name': 'TEXT',
					'grp': 'INTEGER',
					'code': 'TEXT',
					'description': 'TEXT'
				}).run();
				db.query().create('groups',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'name': 'TEXT',
					'description': 'TEXT'
				}).run();
				db.query().create('prices',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'code': 'TEXT',
					'value': 'INTEGER'
				}).run();
				db.query().create('prices_groups',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'price': 'INTEGER',
					'grp': 'INTEGER',
					'value': 'INTEGER'
				}).run();
				db.query().create('products',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'name': 'TEXT',
					'code': 'TEXT',
					'price': 'INTEGER',
					'cnt': 'INTEGER DEFAULT 0',
					'description': 'TEXT'
				}).run();
				db.query().create('sales',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'customer': 'INTEGER',
					'date': 'TEXT',
					'description': 'TEXT'
				}).run();
				db.query().create('sales_detail',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'sale': 'INTEGER',
					'product': 'INTEGER',
					'cnt': 'INTEGER'
				}).run();
				db.save(file);
				db.dbFile = file;
				callback( false, file );
			}
			else{
				db = false;
				callback( true, false );
			}
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('customers-get', function(data, callback){
		try{
			if( typeof data.id == 'undefined' )
				data.id = false;
			db.query()
			.select([
				't1.id',
				't1.name',
				't1.code',
				't1.description',
				't2.id AS grp',
				't2.name AS grp_name'
			], 'customers t1')
			.leftJoin('groups t2', 't1.grp = t2.id')
			.where( 't1.id' + (data.id!==false? ('= '+data.id): '> 0') )
			.run(function(result){
				callback(false, result);
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	});
});

*/
