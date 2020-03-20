const BrokerAgent  = require('./io/broker/brokerAgent');
const EventHandler = require('./io/handler/eventHandler');
const Warden       = require('./io/rooms');
const InviteList   = require('./io/inviteList');

const LOGLEVEL     = require('./io/logger').LOGLEVEL;
const Logger       = require('./io/logger').ConsoleLogger;

const ROOMTYPE     = require('../define/room').TYPE;
const EVENT        = require('../define/event').TYPE;

const MAX_CONN     = 2000;

//XXX FIXME currently chat and game invites shared
const MAX_INVITES  = 10;
const MAX_INVITORS = 20000;

module.exports = function (http, app)
{
	var io      = require('socket.io')(http);
	var invlist = new InviteList(MAX_INVITORS, MAX_INVITES);
	var warden  = new Warden(io);
	var broker  = new BrokerAgent();
	var handler = new EventHandler(io, warden, invlist);

	broker.addBroker(ROOMTYPE.CHAT, io);
	broker.addBroker(ROOMTYPE.GAME, io);

	warden.addRoom(ROOMTYPE.LOBBY, 'Lobby');

	io.on('connect', function(socket)
	{
		if (io.engine.clientsCount > MAX_CONN)
		{
			broker.sendError(
					socket.client.id,
					EVENT.ERR_GENERIC,
					`Failed to connect - Server is at full capacity.`);

			socket.disconnect();
			return;
		}

		Object.values(EVENT).forEach(event =>
				socket.on(event, handler.handle(socket.client.id, event)));
	});

	return io;
}
