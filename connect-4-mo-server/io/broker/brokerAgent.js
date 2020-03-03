const Broker     = require('./broker');
const ChatBroker = require('./chatBroker');

const LOGLEVEL   = require('../logger').LOGLEVEL;
const Logger     = require('../logger').ConsoleLogger;

const ROOMTYPE   = require('../constants').ROOM_TYPE;

class BrokerAgent
{
	constructor(io)
	{
		this.brokers = new Map();
	}

	addBroker(room_type, io)
	{
		switch (room_type)
		{
			case ROOMTYPE.CHAT:
				brokers.set(room_type, new chatBroker(io)); break;
			case ROOMTYPE.RPS:
			case ROOMTYPE.CONNECT4:
				brokers.set(room_type, new Broker(io)); break;
			default:
				return -1;
		}

		return 0;
	}

	roomJoined(room_type, room_name, user_name, rooms_data)
	{
		brokers.get(room_type).roomJoined(room_name, user_name, rooms_data);
	}

	roomLeft(room_type, room_name, user_name, rooms_data)
	{
		brokers.get(room_type).roomLeft(room_name, user_name, rooms_data);
	}
}

module.exports = BrokerAgent;
