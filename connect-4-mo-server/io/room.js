const DEFINE   = require('./config.json').define;

//const Connect4Game = require('./game')
const Users    = require('./users')

const LOGLEVEL = require('./logger').LOGLEVEL;
const Logger   = require('./logger').ConsoleLogger;

const ROOMTYPE = require(`${DEFINE}/room`).TYPE;

class Room
{
	constructor(name, type)
	{
		this.type  = type;
		this.name  = name;
		this.users = new Users();
	}

	size()         { return this.users.size(); }
	contains(name) { return this.users.contains(name); }

	name()  { return this.name; }
	type()  { return this.type; }
	users() { return this.users; }

	insert(name, data)
	{
		this.users.add(name, data);
		Logger.log(`Added user ${name} to room ${this.name}.`,
			LOGLEVEL.DEBUG);
	}

	erase(name)
	{
		this.users.erase(name);
		Logger.log(`Deleted user ${name} from room ${this.name}.`,
			LOGLEVEL.DEBUG);
	}

	toJSON()
	{
		return {users: this.users.toJSON()};
	}

	dump()
	{
		JSON.stringify(this.users.dump());
	}
}

class ChatRoom extends Room
{
	constructor(name)
	{
		super(name, ROOMTYPE.CHAT);
	}
}

class GameRoom extends Room
{
	constructor(name, game)
	{
		super(name, ROOMTYPE.GAME);
		this.game = game;
	}
}

module.exports =
{
	ChatRoom,
	GameRoom
};
