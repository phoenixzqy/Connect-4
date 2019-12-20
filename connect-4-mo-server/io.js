var users = {};
var rooms = ['Lobby'];

function conn_init(socket) {
	socket.room = 'Lobby';
	//socket.username = name;
	//users[name]     = name;
	socket.join('Lobby');

	socket.emit('chat-update',
		{ip:'SERVER', message:'Connected to lobby.'});
	socket.broadcast.emit('chat-update',
		{ip:'SERVER', message:socket.handshake.address + ' has connected.'});
}

module.exports = function (http, app) {
	var io = require('socket.io')(http);

	io.on('connection', function(socket) {

		conn_init(socket);

		socket.on('disconnect', function() {
			socket.broadcast.emit('chat-update',
				{ip:'SERVER', message:socket.handshake.address + ' has disconnected.'});
		});

		socket.on('room-create', function(room) {
			room.push(room);
			socket.emit('room-update', socket.room);
		});

		socket.on('room-join', function(user, room) {
			var prev = socket.room;
			socket.leave(prev);
			socket.join(room);
			socket.emit('chat-update',
				{ip:'SERVER', message:'Joined ' + room});
			socket.broadcast.to(room).emit('chat-update',
				{ip:'SERVER', user + ' has joined.'});
			socket.broadcast.to(prev).emit('chat-update',
				{ip:'SERVER', user + ' has left.'});
			socket.emit('room-update', room);
		});

		socket.on('chat-submit', function(msg) {
			let body = {...msg, ip: socket.handshake.address};
			io.emit('chat-update', body);
		});
	});

	return io;
}
