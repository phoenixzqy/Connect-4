//const Connect4Game = require('./game')

const LOGLEVEL     = require('./logger').LOGLEVEL;
const Logger       = require('./logger').ConsoleLogger;

const ROOMTYPE     = require('./constants').ROOM_TYPE;

class Room
{
	constructor(name, type)
	{
		this.type  = type;
		this.name  = name;
		this.users = new Map();
	}

	type() { return this.type; }

	add(name, data)
	{
		this.users.set(name, data);
		Logger.log(`Added user ${name} to room ${this.name}.`,
			LOGLEVEL.DEBUG);
	}

	erase(name)
	{
		this.users.delete(name);
		Logger.log(`Deleted user ${name} from room ${this.name}.`,
			LOGLEVEL.DEBUG);
	}

	contains(name)
	{
		return this.users.has(name);
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
		this.game = new Game(width, height);
	}

	changeBoard(width, height)
	{
		this.game.changeBoard(width, height);
	}
}

module.exports =
{
	ChatRoom,
	GameRoom
};
