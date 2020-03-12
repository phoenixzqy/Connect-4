const DEFINE          = require('./config.json').define;

const ChatRoomFactory = require('./room').ChatRoom;
const GameRoomFactory = require('./room').GameRoom;

const LOGLEVEL        = require('../logger').LOGLEVEL;
const Logger          = require('../logger').ConsoleLogger;

const ROOMTYPE        = require(`${DEFINE}/room`).TYPE;

class AbstractRoomFactory
{
	constructor()
	{
		this.factories = new Map();
		this.factories.set(ROOMTYPE.CHAT, new ChatRoomFactory());
		this.factories.set(ROOMTYPE.GAME, new GameRoomFactory());
	}

	addGame(type)
	{
		if (!this.factories.has(ROOMTYPE.GAME))
		{
			Logger.log(`Game factory not initialized.`, LOGLEVEL.CRIT);
			return -1;
		}

		this.factories.get(ROOMTYPE.GAME).addFactory(type);
		return 0;
	}

	build(name, info)
	{
		if (!this.factories.has(info.roomType))
		{
			Logger.log(`Invalid room type ${info.roomType}.`, LOGLEVEL.ERR);
			return null;
		}

		switch (info.roomType)
		{
			case ROOMTYPE.CHAT:
				return this.factories.get(info.roomType).build(
					name);
			case ROOMTYPE.GAME:
				return this.factories.get(info.roomType).build(
					name,
					info.gameInfo);
			default:
				Logger.log(
					`Invalid room type ${info.roomType}.`,
					LOGLEVEL.ERR);
				return null;
		}
	}
}

module.exports = AbstractRoomFactory;
