const DEFINE   = require('./config.json').define;

const ChatRoom = require('../room').ChatRoom;

const LOGLEVEL = require('../logger').LOGLEVEL;
const Logger   = require('../logger').ConsoleLogger;

const ROOMTYPE = require(`${DEFINE}/room`).TYPE;

class ChatRoomFactory
{
	build(name)
	{
		return new ChatRoom(name);
	}
}

module.exports = ChatRoomFactory;
