const Users       = require('./users')

const RoomFactory = require('./roomFactory'); 

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
		this.rooms   = new Map();
		this.users   = new Users();
		this.factory = new RoomFactory();
	}

	room(user_name) { return this.users.room(user_name); }

	addRoomType()
	{
		this.factory.addChatFactory(game);
	}

	addRoomType(game)
	{
		this.factory.addGameFactory(game);
	}

	createUser()
	{
		users.add(user_name, user_data);
	}

	roomCreate(room_name, room_type, room_data, user_name, user_data)
	{
		if (_addRoom(room_name, room_type))
			return -1;

		return roomJoin(room_name, user_name, user_data);

		let broker = new SocketBroker(room.type());
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

		let room = this.rooms.get(room_name);

		rooms.add(user_name);
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

	_addRoom(name, type)
	{
		let new_room = this.factory.build(name);

		if (new_room == null)
			return -1;

		this.rooms.set(name, new_room);
		return 0;
	}

	_delRoom(name)
	{
		this.rooms.delete(name);
	}
}
