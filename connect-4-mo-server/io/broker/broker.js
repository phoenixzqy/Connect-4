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
		io.sockets.socket[user].emit(event, data);
	}

	broadcast(user, room, event, data)
	{
		io.sockets.socket[user].broadcast.to(room).emit(event, data);
	}

	announce(room, event, data)
	{
		this.io.in(room).emit(event, data);
	}

	roomJoined(room_name, user_name, rooms_data)
	{
		io.sockets.socket[user_name].room = room_name;
		io.sockets.socket[user_name].join(room);

		announce(room_name, 'user-updated', rooms_data);
	}

	roomLeft(room_name, user_name, rooms_data)
	{
		io.sockets.socket[user_name].leave(room);

		broadcast(room_name, user_name, 'user-updated', rooms_data);
	}
}

module.exports = Broker;
