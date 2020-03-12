const DEFINE   = require('./config.json').define;

const LOGLEVEL = require('./logger').LOGLEVEL;
const Logger   = require('./logger').ConsoleLogger;

const GAME     = require(`${DEFINE}/game`);
const PLAYER   = GAME.PLAYER;

class TurnBasedGame extends Game
{
	constructor(min, max)
	{
		super(min, max);
		this.current = -1;
	}

	restart()
	{
		if (super.restart() < 0)
			return -1;

		this.current = Math.floor(Math.random() * this.size);
		return 0;
	}

	nextTurn()
	{
		this.current = this.size % (this.current + PLAYER.NEXT.FORWARD);
	}
}

class Game
{
	constructor(min, max)
	{
		this.players   = new Map();
		this.positions = new Map();
		this.min       = min;
		this.max       = max;
		this.size      = 0;
		this.state     = GAME.STATE.WAITING;
	}

	_reset() {}
	_won(name) {}

	getWinners()
	{
		winners = new Array();

		forEach((value, key) => { if (_won(key)) winners.push(value); });
		return winners;
	}

	addPlayer(name, position)
	{
		if (this.players.size() >= this.max)
		{
			Logger.log(
				`Failed to add player ${name} - room full.`,
				LOGLEVEL.ERR);
			return -1;
		}

		if (this.positions.has(position))
		{
			Logger.log(
				`Failed to add player ${name} - position taken.`,
				LOGLEVEL.ERR);
			return -1;
		}

		this.players.set(
			name,
			{
				playerPosition: position,
				playerState:    PLAYER.STATE.NOTREADY
			});

		this.positions.set(position, name);
		return 0;
	}

	delPlayer(name)
	{
		if (!this.players.has(name))
		{
			Logger.log(`Player ${name} not found.`, LOGLEVEL.WARN);
			return 0;
		}

		this.positions.delete(this.players.get(name));
		this.players.delete(name);
		return 0;
	}

	getPlayers()
	{
		return this.players;
	}

	setReady(name)
	{
		if (!this.players.has(name))
		{
			Logger.log(`Player ${name} not found.`, LOGLEVEL.ERR);
			return -1;
		}

		this.players.get(name).playerState = PLAYER.STATE.READY;
		return 0;
	}

	restart()
	{
		if (this.state != GAME.STATE.WAITING)
		{
			Logger.log(
				`Failed to start game - incorrect state ${this.state}.`,
				LOGLEVEL.ERR)
			return -1;
		}

		forEach((value, key) =>
		{
			if (value.playerState != PLAYER.STATE.READY)
				Logger.log(`Player ${key}` is not ready.`, LOGLEVEL.ERR);
			return -1;
		});

		_reset();

		this.size = this.players.size();
		this.state = GAME.STATE.STARTING;
		return 0;
	}
}

class RockPaperScissorsGame extends Game
{
	constructor(info)
	{
		super(GAME.RPS.MIN_PLAYERS, GAME.RPS.MAN_PLAYERS);

		if (info.gameType != GAME.TYPE.ROCKPAPERSCISSORS)
		{
			Logger.log(
				`Invalid game type ${info.gameType} for rps.`,
				LOGLEVEL.CRIT);
		}
	}
}

class Connect4Game extends TurnBasedGame
{
	constructor(info)
	{
		super(GAME.C4.MIN_PLAYERS, GAME.C4.MAN_PLAYERS);
		this.board  = new Array();
		this.width  = info.columnCount;
		this.height = info.rowCount;

		if (info.gameType != GAME.TYPE.CONNECT4)
		{
			Logger.log(
				`Invalid game type ${info.gameType} for c4.`,
				LOGLEVEL.CRIT);
		}
	}

	changeBoard(width, height)
	{
		this.width  = width;
		this.height = height;
	}
}

module.exports = 
{
	RockPaperScissorsGame,
	Connect4Game
};
