const DEFINE              = require('./config.json').define;

const AbstractRoomFactory = require('./factory/abstractRoomFactory');

const ChatRoom            = require('./room').ChatRoom;
const GameRoom            = require('./room').GameRoom;

const Users               = require('./users')

/* Log stuff */
const LOGLEVEL            = require('./logger').LOGLEVEL;
const Logger              = require('./logger').ConsoleLogger;

/* Declares */
const GAMETYPE            = require(`${DEFINE}/game`).TYPE;
const ROOMTYPE = require(`${DEFINE}/room`).TYPE;

class Warden
{
	constructor(io)
	{
		this.rooms   = new Map();
		this.users   = new Users();
		this.factory = new AbstractRoomFactory();

		//TODO move this outside
		this.factory.addGame(GAMETYPE.ROCKPAPERSCISSORS);
	}

	addGameType(game)   { this.factory.addGameFactory(game); }

	userSize()          { return this.users.size(); }
	roomSize()          { return this.rooms.size(); }
	hasUser(name)       { return this.users.contains(name); }
	hasRoom(name)       { return this.rooms.has(name); }

	userRoom(name)      { return this.users.room(name); }
	userData(name)      { return this.users.data(name); }

	roomType(name)      { return this.rooms.get(name).type(); }
	roomUsers(name)     { return this.rooms.get(name).users(); }

	addUser(name, data) { this.users.insert(name, data); }
	delUser(name)       { this.users.erase(name); }

	addRoom(name, info)
	{
		Logger.log(`Added room ${info.roomType}:${name}.`, LOGLEVEL.INFO);
		this.rooms.set(name, this.factory.build(name, info));
	}

	delRoom(name)
	{
		Logger.log(`Removed room ${name}.`, LOGLEVEL.INFO);
		this.rooms.delete(name);
	}

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

	//neither of these need room_type
	roomJoin(room_type, room_name, user_name, user_data)
	{
		Logger.log(
			`User ${user_name} joining room ${room_name}.`,
			LOGLEVEL.DEBUG);

		this.rooms.get(room_name).insert(user_name, user_data);
		this.users.user(user_name).exit(room_type, room_name);
	}

	roomLeave(room_type, room_name, user_name)
	{
		Logger.log(
			`Evicting user ${user_name} from room ${room_name}.`,
			LOGLEVEL.DEBUG);

		this.users.user(user_name).exit(room_type, room_name);
		this.rooms.get(room_name).erase(user_name);
	}
}

module.exports = Warden;
