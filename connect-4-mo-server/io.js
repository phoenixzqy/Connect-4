module.exports = function (http, app) {
	var io = require('socket.io')(http);

	io.on('connection', function(socket){
		// console.log('a user connected');
		socket.on('disconnect', function(){
			// console.log('user disconnected');
		});
		socket.on('chat-message-submit', function(msg){
			let body = {...msg, ip: socket.handshake.address};
			io.emit('chat-message-update', body);
		});
	});
	return io;
}

