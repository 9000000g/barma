angular.module('app.services', ['btford.socket-io'])
.factory('$server', function(socketFactory) {
	return socketFactory({
		ioSocket: io.connect('http://127.0.0.1:5623')
	});
})
