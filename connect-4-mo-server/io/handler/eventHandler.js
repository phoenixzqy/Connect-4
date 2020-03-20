const DEFINE   = require('./config.json').define;

const LOGLEVEL = require('../logger').LOGLEVEL;
const Logger   = require('../logger').ConsoleLogger;

const EVENT    = require(`${DEFINE}/event`).TYPE;
const ROOMTYPE = require(`${DEFINE}/room`).TYPE;
const RESPONSE = require(`${DEFINE}/room`).INVITATION_RESPONSE;

Object.prototype.pbind = function(func, ...args)
{
	return this[func](...args, ...arguments);
}

class EventHandler
{
	//XXX define this in some config somewhere
	const var DEFAULT_TIMEOUT = 30;

	constructor(io, warden, invlist)
	{
		this.io      = io;
		this.warden  = warden;
		this.invlist = invlist;
	}

	_room_leave(room_type, room_name, user_name)
	{
		this.warden.roomLeave(
			room_type,
			room_name,
			user_name);

		if (room_type === ROOMTYPE.LOBBY
			|| this.warden.roomUsers(room_name).size())
			this.broker.roomLeft(
				room_name,
				user_name,
				this.warden.toRoomJSON(room_name));
		else
			this.warden.delRoom(room_name);
	}

	_room_join(room_type, room_name, user_name)
	{
		this.warden.roomJoin(
			room_type,
			dst_room_name,
			user_name,
			this.warden.userData(user_name));

		this.broker.roomJoined(
			room_type,
			room_name,
			user_name,
			this.warden.toRoomJSON(room_name));
	}

	_room_move(room_type, src_room_name, dst_room_name, user_name)
	{
		_room_leave(room_type, src_room_name, user_name);
		_room_join(room_type, dst_room_name, user_name);
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

		Logger.log(`Connecting ${user_name} to server.`,LOGLEVEL.INFO);

		this.warden.addUser(user_name, user_data);
		this.warden.roomJOin(ROOMTYPE.LOBBY, 'Lobby', user_name);

		this.broker.roomJoined(room_type, room_name, user_name, this.toJSON());

		Logger.log(
			`Total connections: `
			`${Object.keys(this.io.sockets.connected).length}.`,
			LOGLEVEL.DEBUG);

		return 0;
	}

	_handle_room_create(user_name, curr_room, broker, room_name, room_info)
	{
		if (this.warden.roomType(curr_room) !== ROOMTYPE.LOBBY)
		{
			this.broker.sendError(
				user_name,
				EVENT.ERR_CLIENT,
				`Failed to create room ${room_name} - Invalid user state.`
			);
			return -1;
		}

		if (this.warden.roomType(room_name) === ROOMTYPE.LOBBY)
		{
			this.broker.sendError(
				user_name,
				EVENT.ERR_CLIENT,
				`Failed to create room ${room_name} - Invalid room type.`
			);
			return -1;
		}

		if (this.warden.hasRoom(room_name))
		{
			this.broker.sendError(
				user_name,
				EVENT.ERR_CLIENT,
				`Room ${room_name} already exists.`);

			return -1;
		}

		this.warden.addRoom(room_name, room_info);

		if (this.warden.roomType(room_name) === ROOMTYPE.GAME)
		{
			this._room_move(
				room_info.roomType,
				curr_room,
				room_name,
				user_name);
		}

		return 0;
	}

	_handle_room_invite(user_name, curr_room, broker, room_name, invitees)
	{
		if (this.warden.roomType(curr_room) === ROOMTYPE.LOBBY
			&& this.warden.roomType(room_name) !== ROOMTYPE.CHAT)
		{
			this.broker.sendError(
				user_name,
				EVENT.ERR_CLIENT,
				`Failed to invite user(s) - Invalid user state.`
			);
			return -1;
		}

		if ((this.warden.roomType(room_name) === ROOMTYPE.GAME
				&& invitees.length > 1)
			|| this.warden.roomType(room_name) === ROOMTYPE.LOBBY)
		{
			this.broker.sendError(
				user_name,
				EVENT.ERR_CLIENT,
				`Failed to create user(s) - Invalid room type.`
			);
			return -1;
		}

		invitees.forEach(invitee =>
			let rc = this.invlist.add(user_name, invitee, DEFAULT_TIMEOUT);

			//XXX enum retcodes wouldn't hurt
			switch (rc)
			{
				case  0:
					break;
				case  1:
				case  2:
					broker.sendError(
						user_name,
						EVENT.ERR_CLIENT,
						`Failed to invite user ${invitee} - `
						`Too many invites.`);
					return -1;
				default:
					broker.sendError(
						user_name,
						EVENT.ERR_SERVER,
						`Failed to invite user ${invitee } - `
						`Insufficient server resource.`);
					return -1;
			}

			this.broker.roomInvite(
				room_type,
				room_name,
				user_name,
				invitee_name,
				DEFAULT_TIMEOUT);
		);

		return 0;
	}

	_handle_room_response(
		user_name,
		curr_room,
		broker,
		room_name,
		response,
		invitor_name)
	{
		let rc = null;

		if (this.warden.roomType(curr_room) !== ROOMTYPE.LOBBY)
		{
			broker.sendError(
				user_name,
				EVENT.ERR_CLIENT,
				`Failed to respond to invite - Invalid user state.`
			);
			return -1;
		}

		if (this.warden.roomType(room_name) === ROOMTYPE.LOBBY)
		{
			broker.sendError(
				user_name,
				EVENT.ERR_GENERIC,
				`Failed to respond to invite - Invalid room.`
			);
			return -1;
		}

		rc = this.invlist.verify(invitor, invitee);

		switch (rc)
		{
			case 0:
				break;
			case 1:
				broker.sendError(
					user_name,
					EVENT.ERR_CLIENT,
					`Failed to respond to invite - invitation timedout.`
				this.invlist.erase(invitee_name, user_name);
				return -1;
			default:
				Logger.log(`Cannot find invitee ${invitee} in list.`,
					LOGLEVEL.ERROR);

				broker.sendError(
					user_name,
					EVENT.ERR_GENERIC,
					`Failed to respond to invite - `
					`no invitation from ${invitor_name}.`
				);
				return -1;
		}

		switch (response)
		{
			case RESPONSE.ACCEPT:
				if (_handle_room_join(user_name, broker, room_name) < 0)
					return -1;
			case RESPONSE.REJECT: //TODO let invitor know if rejected?
			case RESPONSE.BLOCK: //TODO differentiate later
				this.invlist.erase(invitee_name, user_name);
				return 0;
		}
	}

	_handle_room_join(user_name, curr_room, broker, room_name)
	{
		if (this.warden.roomType(curr_room) !== ROOMTYPE.LOBBY)
		{
			broker.sendError(
				user_name,
				EVENT.ERR_CLIENT,
				`Failed to join room ${room_name} - Invalid user state.`
			);
			return -1;
		}

		if (this.warden.roomType(room_name) !== ROOMTYPE.GAME)
		{
			broker.sendError(
				user_name,
				EVENT.ERR_GENERIC,
				`Failed to join room ${room_name} - Invalid room.`
			);
			return -1;
		}

		this._room_move(
			ROOMTYPE.GAME,
			curr_room,
			room_name,
			user_name);

		return 0;
	}

	_handle_room_leave(user_name, curr_room, broker, room_name)
	{
		if (this.warden.roomType(curr_room) !== this.warden.roomType(room_name))
		{
			broker.sendError(
				user_name,
				EVENT.ERR_CLIENT,
				`Failed to leave room ${room_name} - Invalid user state.`
			);
			return -1;
		}

		switch (this.warden.roomType(room_name))
		{
			case ROOMTYPE.LOBBY:
				broker.sendError(
					user_name,
					EVENT.ERR_CLIENT,
					`Failed to leave room ${room_name} - Invalid room type.`
				);
				return -1;
			case ROOMTYPE.GAME:
				this._room_move(
					ROOMTYPE.LOBBY,
					curr_room,
					room_name,
					user_name);

				return 0;
			case ROOMTYPE.CHAT:
				//XXX TODO USER_UPDATE?
				return 0;
		}
	}

	_handle_chat_submit(user_name, broker, room_name, message)
	{
		let user_data = null;

		if (verifyUser(user_name) < 0
			|| verifyRoom(room_name) < 0)
		{
			broker.sendError(
				user_name,
				EVENT.ERR_GENERIC,
				`Cannot verify user or room state.`
			);
			return -1;
		}

		broker.announce(
			room_name,
			EVENT.CHAT_UPDATED,
			room_name,
			CHATTYPE.USER,
			message,
			this.warden.userData(user_name)
		);

		return 0;
	}

	_handle_exception()
	{
		Logger.log(`Error has occurred.`, LOGLEVEL.ERR);
		return -1;
	}

	handle(user_name, broker, event)
	{
		let f    = this._handle_exception;
		let room = null;

		switch (event)
		{
			case EVENT.DISCONNECT:
				return pbind(this._handle_disconnect, user_name, broker);
			case EVENT.USER_INIT:
				return pbind(this._handle_user_init, user_name, broker);
			case EVENT.ROOM_CREATE:   f = this._handle_room_create;   break;
			case EVENT.ROOM_INVITE:   f = this._handle_room_invite;   break;
			case EVENT.ROOM_RESPONSE: f = this._handle_room_response; break;
			case EVENT.ROOM_JOIN:     f = this._handle_room_join;     break;
			case EVENT.ROOM_LEAVE:    f = this._handle_room_leave;    break;
			case EVENT.CHAT_SUBMIT:   f = this._handle_chat_submit;   break;
			case EVENT.GAME_SUBMIT:   f = this._handle_game_submit;   break;
			default: 
				Logger.log(`Unkown event ${event}.`, LOGLEVEL.ERROR);
				return f;
		}

		if (!this.warden.hasUser(user_name))
		{
			Logger.log(`Failed to find user ${user_name}.`, LOGLEVEL.ERROR);

			broker.sendError(
				user_name,
				EVENT.ERR_SERVER,
				`Cannot verify user state.`
			);
			return this._handle_exception;
		}

		curr_room = this.warden.userRoom(user_name);
		if (!this.warden.hasRoom(curr_room)
		{
			Logger.log(`Failed to find room ${room_name}.`, LOGLEVEL.ERROR);

			broker.sendError(
				user_name,
				EVENT.ERR_SERVER,
				`Cannot verify user room state.`
			);
			return this._handle_exception;
		}

		if (this.warden.roomUsers(room_name).contains(user_name))
		{
			Logger.log(
				`Failed to find user ${user_name} in room ${room_name}.`,
				LOGLEVEL.ERROR);

			broker.sendError(
				user_name,
				EVENT.ERR_SERVER,
				`Cannot verify room user state.`
			);
			return this._handle_exception;
		}

		return pbind(f, user_name, curr_room, broker);
	}
}

module.exports = EventHandler;
