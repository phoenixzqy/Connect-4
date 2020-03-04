const LOGLEVEL = require('../logger').LOGLEVEL;
const Logger   = require('../logger').ConsoleLogger;

class Broker
{
	constructor(io)
	{
		this.io = io;
	}

	send(user, event, data)
	{
		this.io.sockets.connected[user].emit(event, data);
	}

	broadcast(user, room, event, data)
	{
		this.io.sockets.connected[user].broadcast.to(room).emit(event, data);
	}

	announce(room, event, data)
	{
		this.io.in(room).emit(event, data);
	}

	roomJoined(room_name, user_name, rooms_data)
	{
		Logger.log(
			`User ${user_name} joined room ${room_name}.`,
			LOGLEVEL.DEBUG);

		this.io.sockets.connected[user_name].room = room_name;
		this.io.sockets.connected[user_name].join(room_name);

		this.announce(
			room_name,
			'user-updated',
			{ rooms: rooms_data, currentRoom: room_name });
		return 0;
	}

	roomLeft(room_name, user_name, rooms_data)
	{
		Logger.log(
			`User ${user_name} left room ${room_name}.`,
			LOGLEVEL.DEBUG);

		if (this.io.sockets.connected[user_name] === undefined)
		{
			Logger.log(
				`Lost connection to user ${user_name}.`,
				LOGLEVEL.NOTICE);
			return -1;
		}

		this.io.sockets.connected[user_name].leave(room_name);

		this.broadcast(
			user_name,
			room_name,
			'user-updated',
			{ rooms: rooms_data, currentRoom: room_name });
		return 0;
	}
}

module.exports = Broker;
