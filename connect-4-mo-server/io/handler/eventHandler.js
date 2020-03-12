const DEFINE   = require('./config.json').define;

const LOGLEVEL = require('../logger').LOGLEVEL;
const Logger   = require('../logger').ConsoleLogger;

const EVENT    = require(`${DEFINE}/event`).TYPE;
const ROOMTYPE = require(`${DEFINE}/room`).TYPE;

Object.prototype.pbind = function(func, ...args)
{
	return this[func](...args, ...arguments);
}

class EventHandler
{
	constructor(io, warden, invites)
	{
		this.io      = io;
		this.warden  = warden;
		this.invites = invlist;
	}

	_handle_disconnect(user_name, broker, message)
	{
		Logger.log(
			`Disconnecting ${user_name} from server - ${message}.`,
			LOGLEVEL.INFO);

		if (!this.warden.containsUser(user_name))
		{
			Logger.log(`Failed to find user ${user_name}.`, LOGLEVEL.ERR);
			return -1;
		}

		if (this.warden.roomLeave(ROOMTYPE.CHAT, user_name))
			Logger.log(`Failed to evict user ${user_name}.`, LOGLEVEL.ERR);

		this.warden.delUser(user_name);
		return 0;
	}

	_handle_user_init(user_name, broker, user_info)
	{
		let user_data =
		{
			...user_info,
			id: socket.client.id,
			ip: socket.request.connection.remoteAddress
		};

		Logger.log(
			`Connecting ${user_name} to server.`,
			LOGLEVEL.INFO);

		Logger.log(
			`Total connections: ${Object.keys(io.sockets.connected).length}.`,
			LOGLEVEL.DEBUG);

		this.warden.addUser(user_name, user_data);
		this.warden.lobbyJoin(ROOMTYPE.CHAT, 'Lobby', user_name);
		return 0;
	}

	_handle_room_create(user_name, broker, room_name, room_info)
	{
		if (this.warden.addRoom(room_name, room_info) < 0)
		{
			broker.sendError(
				user_name,
				EVENT.ERR_CLIENT,
				`Room ${room_name} already exists.`
			);
			return -1;
		}

		//TODO add return code for error handling
		if (this.warden.roomMove(ROOMTYPE.CHAT, room_name, user_name) < 0)
		{
			if (!warden.containsRoom(room_name))
				Logger.log(
					`Failed to find room ${room_name} for cleanup.`,
					LOGLEVEL.CRIT);
			else
				warden.delRoom(room_name);

			broker.sendError(
				user_name,
				EVENT.ERR_SERVER,
				`Failed to move to created room ${room_name}.`
			);

			return -1;
		}

		return 0;
	}

	_handle_room_invite(user_name, broker, room_name, invitee_name)
	{
		broker.send(
			invitee_name,
			EVENT.ROOM_INVITED,
			room_name,
			30
		);
	}

	_handle_room_response(user_name, broker, room_name, invite_token)
	{
	}

	_handle_room_join(user_name, broker, room_name)
	{
		if (warden.roomMove(ROOMTYPE.CHAT, data.room, socket.client.id) < 0)
		{
			broker.sendError(
				user_name,
				EVENT.ERR_GENERIC,
				`Failed to move to ${room_name}.`
			);
			return -1;
		}

		return 0;
	}

	_handle_room_leave(user_name, broker, room_name)
	{
	}

	_handle_chat_submit(user_name, broker, room_name, message)
	{
		let user_data = warden.userValue(user_name);

		if (user_data === undefined)
		{
			broker.sendError(
				user_name,
				EVENT.ERR_SERVER,
				`Failed to find data for user ${user_name}.`
			);

			return -1;
		}

		//XXX this logic should be handled by broker instead?
		broker.announce(
			room_name,
			EVENT.CHAT_UPDATED,
			room_name,
			CHATTYPE.USER,
			message,
			user_data
		);

		return 0;
	}

	_handle_exception()
	{
		Logger.log(`Unknown event ${event}.`, LOGLEVEL.ERR);
		return -1;
	}

	handle(user_name, broker, event)
	{
		var f = this._handle_exception;

		switch (event)
		{
			case EVENT.DISCONNECT:    f = this._handle_disconnect;    break;
			case EVENT.USER_INIT:     f = this._handle_user_init;     break;
			case EVENT.ROOM_CREATE:   f = this._handle_room_create;   break;
			case EVENT.ROOM_INVITE:   f = this._handle_room_invite;   break;
			case EVENT.ROOM_RESPONSE: f = this._handle_room_response; break;
			case EVENT.ROOM_JOIN:     f = this._handle_room_join;     break;
			case EVENT.ROOM_LEAVE:    f = this._handle_room_leave;    break;
			case EVENT.CHAT_SUBMIT:   f = this._handle_chat_submit;   break;
			case EVENT.GAME_SUBMIT:   f = this._handle_game_submit;   break;
			default: return f;
		}

		return pbind(user_name, broker, f);
	}
}

module.exports = EventHandler;
