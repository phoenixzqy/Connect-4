const BrokerAgent = require('./broker/brokerAgent')
const RoomFactory = require('./roomFactory');

const ChatRoom    = require('./room').ChatRoom;
const GameRoom    = require('./room').GameRoom;

const Users       = require('./users')

/* Log stuff */
const LOGLEVEL    = require('./logger').LOGLEVEL;
const Logger      = require('./logger').ConsoleLogger;

/* Declares */
const ROOMTYPE    = require('./constants').ROOM_TYPE;

class Warden
{
	constructor()
	{
		this.rooms   = new Map();
		this.users   = new Users();
		this.factory = new RoomFactory();
		this.broker  = new BrokerAgent();

		this.factory.addChatFactory();
	}

	room(user_name) { return this.users.room(user_name); }
	rooms()         { return JSON.parse(JSON.stringify(this.rooms)); }

	createUser()
	{
		this.users.add(user_name, user_data);
	}

	addGameType(game)
	{
		this.factory.addGameFactory(game);
	}

	addRoom(name, type)
	{
		this.rooms.add(this.factory.build(name, type));
	}

	delRoom(name)
	{
		this.rooms.delete(name);
	}

	roomJoin(room_name, user_name, user_data)
	{
		if (!this.rooms.has(room_name))
		{
			Logger.log(`Failed to find room ${room_name}.`, LOGLEVEL.WARN);
			return -1;
		}

		if (!this.users.contains(user_name)
			|| !this.rooms.get(room_name).contains(user_name))
		{
			Logger.log(`Failed to find user ${user_name}.`, LOGLEVEL.WARN);
			return -1;
		}

		this.rooms.get(room_name).add(user_name, user_data);
		this.users.add(user_name, user_data);

		this.broker.roomJoined(room_type, room_name, user_name, rooms());
		return 0;
	}

	roomLeave(user_name)
	{
		let user_room = this.users.room(user_name);

		if (!this.rooms.has(user_room))
		{
			Logger.log(`Failed to find room ${user_room}.`, LOGLEVEL.WARN);
			return -1;
		}

		this.rooms.get(user_room).users.erase(user_name);

		this.broker.roomJoined(room_type, room_name, user_name, rooms());
		return 0;
	}

	roomMove(dst_room_name, user_name, user_data)
	{
		if (roomLeave(user_name) < 0
			|| roomJoin(dst_room_name, user_name, user_data < 0))
			{
				Logger.log(
					`Failed to move user ${user_name} `
					`to room ${dst_room_name}.`,
					LOGLEVEL.WARN);
				return -1;
			}

		return 0;
	}
}
