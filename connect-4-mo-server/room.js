const CONSTANTS    = require('./constants')
const Connect4Game = require('./game')

const RoomType     = CONSTANTS.ROOM_TYPE;
const Direction    = CONSTANTS.DIRECTION.

class Room
{
	constructor(type)
	{
		this.type = type;
		this.users = new Users();
	}

	addUser(name)
	{
		users.add(name);
	}
}

class ChatRoom extends Room
{
	constructor()
	{
		super(CHAT);
	}
}

class Connect4Room extends Room
{
	constructor(width, height)
	{
		super(CONNECT4);
		this.game = new Connect4Game(width, height);
	}

	changeBoard(width, height)
	{
		this.game.changeBoard(width, height);
	}
}

module.exports = Room;
