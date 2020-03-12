const DEFINE   = require('./config.json').define;

const GameRoom = require('../room').GameRoom;

const RPSGame  = require('../game.js').RockPaperScissorsGame;
const C4Game   = require('../game.js').C4Game;

const LOGLEVEL = require('../logger').LOGLEVEL;
const Logger   = require('../logger').ConsoleLogger;

const GAMETYPE = require(`${DEFINE}/game`).TYPE;

class GameRoomFactory
{
	build(name, info)
	{
		switch (info.gameType)
		{
			case GAMETYPE.ROCKPAPERSCISSORS:
				return new GameRoom(name, new RPSGame(info));
			case GAMETYPE.CONNECT4:
				return new GameRoom(name, new C4Game(info));
			default:
				Logger.log(
					`Invalid room type ${info.roomType}.`,
					LOGLEVEL.ERR);
				return null;
		}
	}
}

module.exports = GameRoomFactory;
