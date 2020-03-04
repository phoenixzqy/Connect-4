const Broker   = require('./broker');

const LOGLEVEL = require('../logger').LOGLEVEL;
const Logger   = require('../logger').ConsoleLogger;

var SRVMSG =
{
	ip:   'SERVER',
	type: 'system'
};

class ChatBroker extends Broker
{
	constructor(io)
	{
		super(io);
	}

	roomJoined(room_name, user_name, rooms_data)
	{
		if (super.roomJoined(room_name, user_name, rooms_data) < 0)
			return -1;

		super.send(user_name, 'chat-updated',
			{...SRVMSG, message: `Joined ${room_name}.`});

		super.broadcast(user_name, room_name, 'chat-updated',
			{...SRVMSG, message: `${user_name} has joined.`});

		return 0;
	}

	roomLeft(room_name, user_name, rooms_data)
	{
		if (super.roomLeft(room_name, user_name, rooms_data) < 0)
			return -1;

		super.broadcast(user_name, room_name, 'chat-updated',
			{...SRVMSG, message: `${user_name} has left.`});

		return 0;
	}
}

module.exports = ChatBroker;
