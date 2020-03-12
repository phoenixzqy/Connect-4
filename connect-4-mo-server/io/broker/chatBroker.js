const DEFINE   = require('./config.json').define;

const Broker   = require('./broker');

const LOGLEVEL = require('../logger').LOGLEVEL;
const Logger   = require('../logger').ConsoleLogger;

const EVENT    = require(`${DEFINE}/event`).TYPE;
const ROOMTYPE = require(`${DEFINE}/room`).TYPE;
const CHATTYPE = require(`${DEFINE}/chat`).TYPE;

class ChatBroker extends Broker
{
	constructor(io)
	{
		super(io);
	}

	_socket_room_join_callback(room_name, user_name, rooms_data)
	{
		if (super._socket_room_join_callback(
			room_name,
			user_name,
			rooms_data) < 0)
			return -1;

		super.send(
			user_name,
			EVENT.CHAT_UPDATED,
			room_name,
			CHATTYPE.SERVER,
			`Joined ${room_name}.`
		);

		super.broadcast(
			user_name,
			room_name,
			EVENT.CHAT_UPDATED,
			room_name,
			CHATTYPE.SERVER,
			`${user_name} has joined.`
		);

		return 0;
	}

	_socket_room_leave_callback(room_name, user_name, rooms_data)
	{
		if (super._socket_room_leave_callback(
			room_name,
			user_name,
			rooms_data) < 0)
			return -1;

		super.broadcast(
			user_name,
			room_name,
			EVENT.CHAT_UPDATED,
			room_name,
			CHATTYPE.SERVER,
			`${user_name} has left.`
		);

		return 0;
	}
}

module.exports = ChatBroker;
