const DEFINE     = require('./config.json').define;

const Broker     = require('./broker');
const ChatBroker = require('./chatBroker');

const LOGLEVEL   = require('../logger').LOGLEVEL;
const Logger     = require('../logger').ConsoleLogger;

const ROOMTYPE   = require(`${DEFINE}/room`).TYPE;

class BrokerAgent
{
	constructor()
	{
		this.brokers = new Map();
	}

	addBroker(room_type, io)
	{
		switch (room_type)
		{
			case ROOMTYPE.CHAT:
				this.brokers.set(room_type, new ChatBroker(io));
				break;
			case ROOMTYPE.GAME:
				this.brokers.set(room_type, new Broker(io));
				break;
			default:
				Logger.log(`Invalid room type ${room_type}.`, LOGLEVEL.ERR);
				return -1;
		}

		Logger.log(
			`Added broker for room type ${room_type}.`,
			LOGLEVEL.INFO);
		return 0;
	}

	roomJoined(room_type, room_name, user_name, rooms_data)
	{
		if (!this.brokers.has(room_type))
		{
			Logger.log(`Invalid room type ${room_type}.`, LOGLEVEL.ERR);
			return -1;
		}

		return this.brokers.get(room_type).roomJoined(
			room_name, user_name, rooms_data);
	}

	roomLeft(room_type, room_name, user_name, rooms_data)
	{
		if (!this.brokers.has(room_type))
		{
			Logger.log(`Invalid room type ${room_type}.`, LOGLEVEL.ERR);
			return -1;
		}

		return this.brokers.get(room_type).roomLeft(
			room_name, user_name, rooms_data);
	}

	roomInvite(room_type, room_name, user_name, invitee, timeout)
	{
		if (!this.brokers.has(room_type))
		{
			Logger.log(`Invalid room type ${room_type}.`, LOGLEVEL.ERR);
			return -1;
		}

		return this.brokers.get(room_type).roomInvite(
			room_name, user_name, invitee, timeout);
	}
}

module.exports = BrokerAgent;
