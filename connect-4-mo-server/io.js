var srvmsg = {ip:'SERVER'}
var users  = new Map();
var rooms  = new Map();

rooms.set('Lobby', new Set());

function conn_init(socket) {
	socket.room = 'Lobby';
	socket.join('Lobby');

	add_user(socket.client.id, socket.room);

	socket.emit('chat-update',
		{...srvmsg, message:'Connected to lobby.'});
	socket.broadcast.emit('chat-update',
		{...srvmsg, message:socket.handshake.address + ' has connected.'});
}

function conn_fini(socket) {
	var user = socket.client.id;
	if (!users.has(user)) {
		console.log("Invalid client ID: " + user + ".");
		return -1;
	}

	if(del_user(user, socket.room) < 0)
		console.log("Failed to delete user %s from room %s.",
			user, socket.room);

	users.delete(user);
}

function add_user(user, room) {
	if (!rooms.has(room))
		return -1;

	rooms.get(room).add(user);
	users.set(user, room);
}

function del_user(user, room) {
	if (!rooms.has(room))
		return -1;

	rooms.get(room).delete(user);
}

function add_room(room) {
	rooms.set(room, new Set());
}

function room_join(socket, user, room) {
	if (add_user(socket.client.id, room) < 0
		|| room_leave(socket, user) < 0)
		return -1;

	socket.room = room;
	socket.join(room);

	socket.emit('chat-update',
		{...srvmsg, message:'Joined ' + room});
}

function room_leave(socket, user) {
	var room = socket.room;
	if(del_user(socket.client.id, room) < 0)
		return -1;

	socket.leave(room);
	socket.broadcast.to(room).emit('chat-update',
		{...srvmsg, message:user + ' has left.'});
}

function emit_err(socket, cmd, err) {
	socket.emit(cmd, 'Error: ' + err);
}

function dump_all_rooms()
{
	rooms.forEach(function (users, room, rooms) {
		console.log("room: %s.", room);
		users.forEach(function (user) {
			console.log("user: %s.", user);
		})
	})
}

module.exports = function (http, app) {
	var io = require('socket.io')(http);

	io.on('connection', function(socket) {
		conn_init(socket);

		socket.on('disconnect', function() {
			socket.broadcast.emit('chat-update',
				{...srvmsg, message:socket.handshake.address + ' has disconnected.'});
			conn_fini(socket);
		});

		socket.on('room-create', function(data) {
			//TODO need fine tune - separate logic here
			if (!users.has(socket.client.id)
				|| users.get(socket.client.id) !== 'Lobby'
				|| !rooms.get('Lobby').has(socket.client.id)) {
				emit_err(socket, 'ret-err', 'Cannot create room ' + data.room + '.');
				return -1;
			}

			//XXX change to handle by exception?
			if (add_room(data.room) < 0) {
				emit_err(socket, 'ret-err', 'Room ' + data.room + ' already exists.');
				return -1;
			}

			if (room_join(socket, socket.client.id, data.room) < 0) {
				emit_err(socket, 'ret-crit', 'Cannot create room ' + data.room + '.');
				return -1;
			}

			socket.emit('room-update', socket.room);
		});

		socket.on('room-join', function(data) {
			if (!users.has(socket.client.id)
				|| users.get(socket.client.id) !== 'Lobby'
				|| !rooms.get('Lobby').has(socket.client.id)) {
				emit_err(socket, 'ret-err', 'Cannot join room ' + data.room + '.');
				return -1;
			}

			if (room_join(socket, socket.client.id, data.room) < 0) {
				emit_err(socket, 'ret-err', 'Cannot join room ' + data.room + '.');
				return -1;
			}

			socket.broadcast.to(data.room).emit('chat-update',
				{...srvmsg, message:socket.client.id + ' has joined.'});
			socket.emit('room-update', socket.room);
		});

		socket.on('chat-submit', function(msg) {
			let body = {...msg, ip: socket.handshake.address};
			io.sockets.in(socket.room).emit('chat-update', body);
		});
	});

	return io;
}
