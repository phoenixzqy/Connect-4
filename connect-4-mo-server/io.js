var srvmsg = {
	ip: 'SERVER',
	type: 'system'
}
var users  = new Map();
var rooms  = new Map();

room_add('Lobby');

function conn_fini(socket) {
	var uid = socket.client.id;
	if (!users.has(uid)) {
		console.log("Invalid client ID: " + uid + ".");
		return -1;
	}

	room_leave(socket, users.get(uid));
	users.delete(uid);
}

function add_user(user) {
	rooms.get(user.room).users.add(user.id);
	users.set(user.id, user);
}

function del_user(user) {
	rooms.get(user.room).users.delete(user.id);
}

function room_add(room) {
	rooms.set(room, {users: new Set(), board: new Array()});
}

function room_del(room) {
	rooms.delete(room);
}
function parseRoomData(room) {
	let result = {};
	rooms.forEach((data, name) => {
		if (room !== 'Lobby' && room !== name) return;
		let rUsers = {};
		result[name] = JSON.parse(JSON.stringify(data));
		data.users.forEach((uid) => {
			rUsers[uid] = users.get(uid);
		});
		result[name].users = rUsers;
	});
	return result;
}
//XXX let it throw instead?
function room_join(io, socket, user, room) {
	user.room = room;
	if (!rooms.has(room))
		return -1;

	// init user
	if (!users.has(user.id)) {
		socket.emit('user-initiated', user);
	}
	
	add_user(user);

	socket.room = room;
	socket.join(room);
	// Lobby users need to know all user & room changes
	io.in('Lobby').emit(
		'user-updated', 
		parseRoomData('Lobby'), 
	);
	// Room users only focus on changes in the room
	if (room !== 'Lobby') {
		io.in(room).emit(
			'user-updated', 
			parseRoomData(room), 
		);
	}

	socket.emit('chat-updated', {...srvmsg, message: `Joined ${ room}`});
	socket.broadcast.to(room).emit('chat-updated',
		{...srvmsg, message: `${user.name} has joined.`});
}

function room_leave(socket, user) {
	var room = socket.room;
	if (!rooms.has(room))
		return -1;

	del_user(user);

	socket.leave(room);
	socket.broadcast.to(room).emit(
		'user-updated',
		parseRoomData(room), 
	);
	socket.broadcast.to(room).emit('chat-updated',
		{...srvmsg, message: `${user.name} has left.`});
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
		socket.on('join-lobby', function(userData) {
			room_join(io, socket, 
				{
					...userData,
					id: socket.client.id,
					ip: socket.request.connection.remoteAddress
				},
				'Lobby'
			);
		});

		socket.on('disconnect', function() {
			conn_fini(socket);
		});

		socket.on('room-create', function(data) {
			//TODO need fine tune - separate logic here
			//if doesnt even have user, exception, otherwise error
			if (!users.has(socket.client.id)
				|| users.get(socket.client.id).room !== 'Lobby'
				|| !rooms.get('Lobby').users.has(socket.client.id)) {
				emit_err(socket, 'ret-clt', 'Cannot create room ' + data.room + '.');
				return -1;
			}

			//XXX change to handle by exception?
			if (room_add(data.room) < 0) {
				emit_err(socket, 'ret-err', 'Room ' + data.room + ' already exists.');
				return -1;
			}

			if (room_move(io, socket, users.get(socket.client.id), data.room) < 0) {
				emit_err(socket, 'ret-svr',
					'Cannot move to created room ' + data.room + '.');
				if (room_del(data.room) < 0)
					emit_err(socket, 'ret-svr',
						'Failed to remove room ' + data.room + '.');
				return -1;
			}

			socket.emit('room-updated', socket.room);
		});

		socket.on('room-join', function(data) {
			//XXX DRY
			if (!users.has(socket.client.id)
				|| users.get(socket.client.id).room !== 'Lobby'
				|| !rooms.get('Lobby').users.has(socket.client.id)) {
				emit_err(socket, 'ret-clt', 'Cannot join room ' + data.room + '.');
				return -1;
			}

			if (room_move(io, socket, users.get(socket.client.id), data.room) < 0) {
				emit_err(socket, 'ret-err', 'Cannot join room ' + data.room + '.');
				return -1;
			}

			socket.emit('room-updated', socket.room);
		});

		socket.on('chat-submit', function(msg) {
			let body = {
				message: msg, 
				user: users.get(socket.client.id),
				type: "message"
			};
			io.sockets.in(socket.room).emit('chat-updated', body);
		});
	});

	return io;
}
