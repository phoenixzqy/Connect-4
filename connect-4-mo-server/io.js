const BrokerAgent  = require('./io/broker/brokerAgent');
const EventHandler = require('./io/handler/eventHandler');
const Warden       = require('./io/rooms');
//const InviteList   = require('./io/inviteList');
const InviteList   = new Map();

const LOGLEVEL     = require('./io/logger').LOGLEVEL;
const Logger       = require('./io/logger').ConsoleLogger;

const ROOMTYPE     = require('../define/room').TYPE;
const EVENT        = require('../define/event').TYPE;

const MAX_CONN     = 2000;

module.exports = function (http, app)
{
	var io      = require('socket.io')(http);
	var invites = new InviteList();
	var warden  = new Warden(io, MAX_USERS);
	var broker  = new BrokerAgent();
	var handler = new EventHandler(io, warden, invites);

	warden.addBroker(ROOMTYPE.CHAT, io);
	warden.addRoom(ROOMTYPE.LOBBY, 'Lobby');

	io.on('connect', function(socket)
	{
		if (io.engine.clientsCount > MAX_CONN)
		{
			broker.sendError(
					socket.client.id,
					EVENT.ERR_GENERIC,
					`Server is at full capacity.`);

			socket.disconnect();
			return;
		}

		Object.values(EVENT).forEach(event =>
				socket.on(event, handler.handle(socket.client.id, event)));
	});

	return io;
}
