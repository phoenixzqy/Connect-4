var srvmsg = {ip:'SERVER'}
var users  = new Map();
var rooms  = new Map();

room_add('Lobby');

function conn_init(io, socket) {
	room_join(io, socket, socket.client.id, 'Lobby');
}

function conn_fini(socket) {
	var user = socket.client.id;
	if (!users.has(user)) {
		console.log("Invalid client ID: " + user + ".");
		return -1;
	}

	room_leave(socket, user);
	users.delete(user);
}

function add_user(user, room) {
	rooms.get(room).users.add(user);
	users.set(user, room);
}

function del_user(user, room) {
	rooms.get(room).users.delete(user);
}

function room_add(room) {
	rooms.set(room, {users: new Set(), board: new Array()});
}

function room_del(room) {
	rooms.delete(room);
}

//XXX let it throw instead?
function room_join(io, socket, user, room) {
	if (!rooms.has(room))
		return -1;

	add_user(socket.client.id, room);

	socket.room = room;
	socket.join(room);

	io.in(room).emit('user-update',
		Array.from(rooms.get(room).users));
	socket.emit('chat-update', {...srvmsg, message:'Joined ' + room});
	socket.broadcast.to(room).emit('chat-update',
		{...srvmsg, message:user + ' has joined.'});
}

function room_leave(socket, user) {
	var room = socket.room;
	if (!rooms.has(room))
		return -1;

	del_user(socket.client.id, room);

	socket.leave(room);
	socket.broadcast.to(room).emit('user-update',
		Array.from(rooms.get(room).users));
	socket.broadcast.to(room).emit('chat-update',
		{...srvmsg, message:user + ' has left.'});
}

function room_move(io, socket, user, room) {
	if (room_leave(socket, user) < 0
		|| room_join(io, socket, user, room) < 0)
		return -1;
	
	return 0;
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
			conn_init(io, socket);
		});

		socket.on('disconnect', function() {
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
			if (room_add(data.room) < 0) {
				emit_err(socket, 'ret-err', 'Room ' + data.room + ' already exists.');
				return -1;
			}

			if (room_move(io, socket, socket.client.id, data.room) < 0) {
				emit_err(socket, 'ret-svr',
					'Cannot move to created room ' + data.room + '.');
				if (room_del(data.room) < 0)
					emit_err(socket, 'ret-svr',
						'Failed to remove room ' + data.room + '.');
				return -1;
			}

			socket.emit('room-update', socket.room);
		});

		socket.on('room-join', function(data) {
			//XXX DRY
			if (!users.has(socket.client.id)
				|| users.get(socket.client.id) !== 'Lobby'
				|| !rooms.get('Lobby').users.has(socket.client.id)) {
				emit_err(socket, 'ret-clt', 'Cannot join room ' + data.room + '.');
				return -1;
			}

			if (room_move(io, socket, socket.client.id, data.room) < 0) {
				emit_err(socket, 'ret-err', 'Cannot join room ' + data.room + '.');
				return -1;
			}

			socket.emit('room-update', socket.room);
		});

		socket.on('chat-submit', function(msg) {
			let body = {...msg, ip: socket.handshake.address};
			io.sockets.in(socket.room).emit('chat-update', body);
		});
	});

	return io;
}
