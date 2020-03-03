const Connect4Game = require('./game')

const LOGGER   = require('./logger')

const LOGLEVEL = LOGGER.LOGLEVEL;
const Logger   = LOGGER.ConsoleLogger;

const CONSTANTS    = require('./constants')
const ROOMTYPE     = CONSTANTS.ROOM_TYPE;

class ChatRoomFactory
{
	build(name)
	{
		return new ChatRoom(name);
	}
}

class GameRoomFactory
{
	constructor(game)
	{
		this.game = game;
	}

	build(name)
	{
		return new GameRoom(name, game);
	}
}

class RoomFactory
{
	constructor()
	{
		this.factory = new Map();
	}

	addChatFactory()
	{
		this.factory.set(ROOMTYPE.CHAT, new ChatRoomFactory());
		Logger.log(
			`Added factory for chat room.`,
			LOGLEVEL.INFO);
	}

	addGameFactory(game)
	{
		this.factory.set(ROOMTYPE.GAME, new GameRoomFactory(game));
		Logger.log(
			`Added factory for game room of type ${game.type}.`,
			LOGLEVEL.INFO);
	}

	build(room_name, room_type)
	{
		if (!this.factory.has(room_type))
		{
			Logger.log(`Invalid room type ${room_type}.`, LOGLEVEL.ERR);
			return null;
		}

		return this.factory.get(room_type).build(room_name);
	}
}

module.exports = RoomFactory;
