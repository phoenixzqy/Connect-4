const CONSTANTS = require('./constants')
const Logger    = require('./logger')

const Direction = CONSTANTS.DIRECTION;

const CONNECT4_MIN_PLAYERS = 2;
const CONNECT4_MAX_PLAYERS = 2;

class Game
{
	winner(player);

	startingPlayer()
	{
		/* Consider different strategies - mini games? */
		current = Math.floor(Math.random() * player_size);
	}

	nextPlayer(direction)
	{
		current += direction;

		if (current >= player_size)
			current = 0;
		else if (current <= 0)
			current = player_size - 1;
	}

	findWinner()
	{
		forEach((value, key) => { if (winner(key)) return value; });
		return -1;
	}

	constructor(size)
	{
		this.players     = new Map();
		this.player_size = size;
		this.current     = -1;
	}

	addPlayer(name, position)
	{
		if (this.players.size() >= this.player_size)
		{
			Logger.log("Failed to add player ${name} - room full.", ERR);
			return -1;
		}

		this.players.add(name, position);
		return 0;
	}

	restart()
	{
		startingPlayer();
	}

	//also check for winner before each turn
	nextTurn()
	{
		nextPlayer();
	}

	//check for winner after each move
	makeMove();
}

class Connect4Game extends Game
{
	constructor(width, height)
	{
		super(CONNECT4_MIN_PLAYERS, CONNECT4_MAX_PLAYERS);
		this.board  = new Array();
		this.width  = width;
		this.height = height;
	}

	changeBoard(width, height)
	{
		this.width  = width;
		this.height = height;
	}
}

module.exports = Connect4Game;
