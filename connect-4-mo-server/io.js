var srvmsg = {ip:'SERVER'}
var users  = new Map();
var rooms  = new Map();

add_room('Lobby');

function conn_init(io, socket) {
	socket.room = 'Lobby';
	socket.join('Lobby');

	add_user(socket.client.id, 'Lobby');
	io.in('Lobby').emit('user-update', Array.from(users.keys()));

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
	socket.broadcast.to(socket.room).emit(
		'user-update', Array.from(users.keys()));
}

function add_user(user, room) {
	if (!rooms.has(room))
		return -1;

	rooms.get(room).users.add(user);
	users.set(user, room);
}

function del_user(user, room) {
	if (!rooms.has(room))
		return -1;

	rooms.get(room).users.delete(user);
}

function add_room(room) {
	rooms.set(room, {users: new Set(), board: new Array()});
}

function room_join(io, socket, user, room) {
	if (add_user(socket.client.id, room) < 0
		|| room_leave(socket, user) < 0)
		return -1;

	socket.room = room;
	socket.join(room);

	io.in(room).emit('user-update', Array.from(users.keys()));
	socket.emit('chat-update', {...srvmsg, message:'Joined ' + room});
}

function room_leave(socket, user) {
	var room = socket.room;
	if(del_user(socket.client.id, room) < 0)
		return -1;

	socket.leave(room);
	socket.broadcast.to(room).emit('user-update',
		Array.from(users.keys()));
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
		users.forEach(function (val) {
			console.log("users: %s.", val.users);
			console.log("board: %s.", val.board);
		})
	})
}

module.exports = function (http, app) {
	var io = require('socket.io')(http);

	io.on('connection', function(socket) {
		conn_init(io, socket);

		socket.on('conn-init', function(socket) {
			conn_init(socket);
		});

		socket.on('disconnect', function() {
			socket.broadcast.emit('chat-update',
				{...srvmsg, message:socket.handshake.address + ' has disconnected.'});
			conn_fini(socket);
		});

		socket.on('room-create', function(data) {
			//TODO need fine tune - separate logic here
			//if doesnt even have user, exception, otherwise error
			if (!users.has(socket.client.id)
				|| users.get(socket.client.id) !== 'Lobby'
				|| !rooms.get('Lobby').users.has(socket.client.id)) {
				emit_err(socket, 'ret-clt', 'Cannot create room ' + data.room + '.');
				return -1;
			}

			//XXX change to handle by exception?
			if (add_room(data.room) < 0) {
				emit_err(socket, 'ret-err', 'Room ' + data.room + ' already exists.');
				return -1;
			}

			//FIXME need do cleanup
			if (room_join(io, socket, socket.client.id, data.room) < 0) {
				emit_err(socket, 'ret-svr', 'Cannot create room ' + data.room + '.');
				return -1;
			}

			socket.emit('room-update', socket.room);
		});

		socket.on('room-join', function(data) {
			if (!users.has(socket.client.id)
				|| users.get(socket.client.id) !== 'Lobby'
				|| !rooms.get('Lobby').users.has(socket.client.id)) {
				emit_err(socket, 'ret-clt', 'Cannot join room ' + data.room + '.');
				return -1;
			}

			if (room_join(io, socket, socket.client.id, data.room) < 0) {
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
