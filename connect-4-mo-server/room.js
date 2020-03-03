const Connect4Game = require('./game')

const LOGGER   = require('./logger')

const LOGLEVEL = LOGGER.LOGLEVEL;
const Logger   = LOGGER.ConsoleLogger;

const CONSTANTS    = require('./constants')
const ROOMTYPE     = CONSTANTS.ROOM_TYPE;

class Room
{
	constructor(name, type)
	{
		this.type = type;
		this.name = name;
		this.users = new Set();
	}

	type() { return this.type; }

	add(name)
	{
		users.add(name);
		Logger.log(
			`Added user ${name} to room ${this.name}.`,
			LOGLEVEL.DEBUG);
	}

	erase(name)
	{
		users.delete(name);
		Logger.log(
			`Deleted user ${name} from room ${this.name}.`,
			LOGLEVEL.DEBUG);
	}

	contains(name)
	{
		return users.has(name);
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

class Connect4Room extends GameRoom
{
	constructor(name, game)
	{
		super(name, game);
	}

	updateBoard(width, height)
	{
		this.game.changeBoard(width, height);
	}
}

module.exports =
{
	ChatRoom,
	Connect4Room
};
