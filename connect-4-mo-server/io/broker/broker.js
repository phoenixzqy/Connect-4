const DEFINE   = require('./config.json').define;

const LOGLEVEL = require('../logger').LOGLEVEL;
const Logger   = require('../logger').ConsoleLogger;

const EVENT    = require(`${DEFINE}/event`).TYPE;
const ROOMTYPE = require(`${DEFINE}/room`).TYPE;

class Broker
{
	constructor(io)
	{
		this.io = io;
	}

	send(user, event, ..args)
	{
		this.io.sockets.connected[user].emit(event, args);
	}

	sendError(user, event, errorMessage)
	{
		this.send(user, event, `Error: ${errorMessge}`);
	}

	broadcast(user, room, event, ...args)
	{
		this.io.sockets.connected[user].broadcast.to(room).emit(event, args);
	}

	announce(room, event, ...args)
	{
		this.io.in(room).emit(event, args);
	}

	_socket_room_join_callback(room_name, user_name, rooms_data)
	{
		if (!rooms_data.has(room_name))
		{
			Logger.log(
				`Invalid rooms object - does not contain room ${room_name}.`,
				LOGLEVEL.CRIT);
			return;
		}

		this.send(
			user_name,
			EVENT.ROOM_UPDATED,
			[ rooms_data ]);

		this.broadcast(
			user_name,
			room_name,
			EVENT.USER_UPDATED,
			{ [room_name]: rooms_data[room_name] });
	}

	_socket_room_leave_callback(room_name, user_name, rooms_data)
	{
		this.broadcast(
			user_name,
			room_name,
			EVENT.USER_UPDATED,
			{ [room_name]: rooms_data[room_name] });
	}

	_socket_room_join(room_name, user_name, rooms_data)
	{
		this.io.sockets.connected[user_name].join(room_name, (err) =>
		{
			if (err != null)
			{
				Logger.log(
					`User ${user_name} failed to join room ${room_name}`,
				LOGLEVEL.ERROR);
				return;
			}

			this._socket_room_join_callback(room_name, user_name, rooms_data);
		});
	}

	_socket_room_leave(room_name, user_name, rooms_data)
	{
		this.io.sockets.connected[user_name].leave(room_name, (err) =>
		{
			if (err != null)
			{
				Logger.log(
					`User ${user_name} failed to leave room ${room_name}`,
				LOGLEVEL.ERROR);
				return;
			}

			this._socket_room_leave_callback(room_name, user_name, rooms_data);
		});
	}

	roomJoined(room_name, user_name, rooms_data)
	{
		Logger.log(
			`User ${user_name} joined room ${room_name}.`,
			LOGLEVEL.DEBUG);

		this._socket_room_join(room_name, user_name, rooms_data);
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

		this._socket_room_leave(room_name, user_name, rooms_data)
		return 0;
	}
}

module.exports = Broker;
