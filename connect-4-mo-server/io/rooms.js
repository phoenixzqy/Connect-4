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
	constructor(io)
	{
		this.rooms   = new Map();
		this.users   = new Users();
		this.factory = new RoomFactory();
		this.broker  = new BrokerAgent();

		this.factory.addChatFactory();
	}

	userRoom(user_name) { return this.users.room(user_name); }

	toJSON()
	{ 
		const obj = {};
		this.rooms.forEach(function (value, key)
		{ obj[key] = value; });

		return obj;
	}

	toRoomJSON(room_name)
	{
		const obj = {};
		obj[room_name] = this.rooms.get(room_name);
		return obj;
	}

	dumpUsers()
	{
		this.users.dump();
	}

	dumpRooms()
	{
		Logger.log(`Rooms size: ${this.rooms.size}.`, LOGLEVEL.DEBUG);

		this.rooms.forEach(function (value, key)
		{
			Logger.log(
				`room: ${key}, users size: ${value.size()}`,
				LOGLEVEL.DEBUG);
			JSON.stringify(value.dump());
		});
	}

	addBroker(type, io)
	{
		this.broker.addBroker(type, io);
	}

	containsUser(name)
	{
		return this.users.contains(name);
	}

	userValue(name)
	{
		return this.users.value(name);
	}

	addUser(name, data)
	{
		this.users.add(name, data);
	}

	delUser(name)
	{
		this.users.erase(name);
	}

	addGameType(game)
	{
		this.factory.addGameFactory(game);
	}

	addRoom(type, name)
	{
		if (this.rooms.has(name))
		{
			Logger.log(
				`Failed to add room ${name} - room already exists.`,
				LOGLEVEL.WARN);
			return -1;
		}

		Logger.log(`added room ${name} of type ${type}`, LOGLEVEL.INFO);
		this.rooms.set(name, this.factory.build(name, type));
		return 0;
	}

	delRoom(name)
	{
		this.rooms.delete(name);
	}

	lobbyJoin(room_type, room_name, user_name)
	{
		//FIXME check room_type first against broker and factory
		let user_data = this.users.value(user_name);

		if (!this.rooms.has(room_name))
		{
			Logger.log(`Failed to find room ${room_name}.`, LOGLEVEL.WARN);
			return -1;
		}

		if (user_data === undefined
			|| !this.users.contains(user_name))
		{
			Logger.log(`Failed to find user ${user_name}.`, LOGLEVEL.WARN);
			return -1;
		}

		this.rooms.get(room_name).add(user_name, user_data);
		this.users.join(user_name, room_name);

		this.broker.roomJoined(room_type, room_name, user_name, this.toJSON());
		return 0;
	}

	roomJoin(room_type, room_name, user_name, user_data)
	{
		Logger.log(
			`User ${user_name} joining room ${room_name}.`,
			LOGLEVEL.DEBUG);

		this.rooms.get(room_name).add(user_name, user_data);
		this.users.join(user_name, room_name);

		this.broker.roomJoined(
			room_type, room_name, user_name, this.toRoomJSON(room_name));
		return 0;
	}

	roomLeave(room_type, user_name)
	{
		let user_room = this.userRoom(user_name);

		Logger.log(
			`Evicting user ${user_name} from room ${user_room}.`,
			LOGLEVEL.DEBUG);

		if (user_room === undefined
		|| !this.rooms.get(user_room).contains(user_name))
			return -1;

		this.users.exit(user_name);
		this.rooms.get(user_room).erase(user_name);

		if (user_room === 'Lobby' || this.rooms.get(user_room).size() !== 0)
			this.broker.roomLeft(room_type, user_room, user_name, this.toRoomJSON(user_room));
		else
			this.rooms.delete(user_room);

		return 0;
	}

	roomMove(room_type, dst_room_name, user_name)
	{
		//FIXME check room_type first against broker and factory
		let user_data = this.users.value(user_name);

		if (!this.rooms.has(dst_room_name))
		{
			Logger.log(`Failed to find room ${dst_room_name}.`, LOGLEVEL.WARN);
			return -1;
		}

		if (!this.users.contains(user_name))
		{
			Logger.log(`Failed to find user ${user_name}.`, LOGLEVEL.WARN);
			return -1;
		}

		//FIXME rollback if roomJoin fails?
		if (this.roomLeave(room_type, user_name) < 0
			|| this.roomJoin(room_type, dst_room_name, user_name, user_data) < 0)
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

module.exports = Warden;
