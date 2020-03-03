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
		super.roomJoined(room_name, user_name, rooms_data);

		send(user_name, 'chat-updated',
			{...srvmsg, message: `Joined ${room_name}.`});

		broadcast(user_name, room_name, 'chat-updated',
			{...srvmsg, message: `${user_name} has joined.`});
	}

	roomLeft(room_name, user_name, rooms_data)
	{
		super.roomLeft(room_name, user_name, rooms_data);

		broadcast(user_name, room_name, 'chat-updated',
			{...srvmsg, message: `${user_name} has left.`});
	}
}

module.exports = ChatBroker;
