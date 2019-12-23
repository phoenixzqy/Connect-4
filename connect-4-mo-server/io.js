var srvmsg = {ip:'SERVER'}
var users  = new Map();
var rooms  = new Map();

rooms.set('Lobby', new Set());

function conn_init(socket) {
	socket.room = 'Lobby';
	socket.join('Lobby');

	socket.emit('chat-update',
		{...srvmsg, message:'Connected to lobby.'});
	socket.broadcast.emit('chat-update',
		{...srvmsg, message:socket.handshake.address + ' has connected.'});
}

function add_user(user, room) {
	var roomusers = rooms.get(room);
	if (typeof roomusers === 'undefined') {
		console.log("Inavlid room: " + room + ".");
		return -1;
	}

	roomusers.add(user);
	users.set(user, room);
}

function del_user(user, room) {
	var roomusers = rooms.get(room);
	if (roomusers === 'undefined') {
		console.log("Inavlid room: " + room + ".");
		return -1;
	}

	roomusers.delete(user);
}

function add_room(room) {
	if (rooms.has(room))
		return -1;
	rooms.set(room, new Set());
}

function room_join(socket, user, room) {
	room_leave(socket, user);

	if (add_user(user, room) < 0)
		return -1;

	socket.room = room;
	socket.join(room);

	socket.emit('chat-update',
		{...srvmsg, message:'Joined ' + room});
}

function room_leave(socket, user) {
	var room = socket.room;
	del_user(user, room);

	socket.leave(room);
	socket.broadcast.to(room).emit('chat-update',
		{...srvmsg, message:user + ' has left.'});
}

module.exports = function (http, app) {
	var io = require('socket.io')(http);

	io.on('connection', function(socket) {
		conn_init(socket);

		socket.on('disconnect', function() {
			socket.broadcast.emit('chat-update',
				{...srvmsg, message:socket.handshake.address + ' has disconnected.'});
		});

		socket.on('room-create', function(data) {
			if (add_room(data.room) < 0) {
				socket.emit('ret-err', 'Room ' + data.room + ' already exists.');
				return -1;
			}
			if (room_join(socket, data.user, data.room) < 0) {
				socket.emit('ret-crit', 'Failed to create room ' + data.room + '.');
				return -1;
			}

			socket.emit('room-update', socket.room);
		});

		socket.on('room-join', function(data) {
			if (room_join(socket, data.user, data.room) < 0) {
				socket.emit('ret-err', 'Cannot find ' + data.room + '.');
				return -1;
			}

			socket.broadcast.to(data.room).emit('chat-update',
				{...srvmsg, message:data.user + ' has joined.'});
			socket.emit('room-update', socket.room);
		});

		socket.on('chat-submit', function(msg) {
			let body = {...msg, ip: socket.handshake.address};
			io.emit('chat-update', body);
		});
	});

	return io;
}
