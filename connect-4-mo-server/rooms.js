const Users    = require('./users')
const
{ 
	ChatRoom,
	Connect4Room
} = require('./room')

/* Log stuff */
const LOGLEVEL = require('./logger').LOGLEVEL;
const Logger   = require('./logger').ConsoleLogger;

/* Declares */
const ROOMTYPE     = require('./constants').ROOM_TYPE;

class RoomsManager
{
	constructor()
	{
		this.rooms = new Map();
		this.users = new Users();
	}

	room(user_name) { return this.users.room(user_name); }

	createUser()
	{
		users.add(user_name, user_data);
	}

	roomJoin(room_name, user_name, user_data)
	{
		if (!this.rooms.has(room_name))
		{
			Logger.log(`Cannot find room ${room_name}.`, LOGLEVEL.WARN);
			return -1;
		}

		if (!users.contains(user_name))
		{
			Logger.log(`Cannot find user ${user_name}.`, LOGLEVEL.WARN);
			return -1;
		}

		this.rooms.get(room_name).add(user_name);
		users.add(user_name, user_data);
		return 0;
	}

	roomLeave(user_name)
	{
		let user_room = this.users.room(user_name);
		if (!this.rooms.has(user_room))
		{
			Logger.log(`Cannot find room ${user_room}.`, LOGLEVEL.WARN);
			return -1;
		}

		this.rooms.get(user_room).users.erase(user_name);
		return 0;
	}

	roomMove(dst_room_name, user_name, user_data)
	{
		if (roomLeave(user_name) < 0
			|| roomJoin(dst_room_name, user_name, user_data < 0)
			{
				Logger.log(`Cannot move to room ${dst_room_name}.`, LOGLEVEL.WARN);
				return -1;
			}

		return 0;
	}

	addChatRoom(name)
	{
		this.rooms.add(new ChatRoom(name));
	}

	addGameRoom(name, game)
	{
		this.rooms.add(new GameRoom(name, game));
	}

	delRoom(name)
	{
		this.rooms.delete(name);
	}
}
