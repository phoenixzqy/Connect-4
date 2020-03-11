const BrokerAgent = require('./io/broker/brokerAgent');
const Warden      = require('./io/rooms');

const LOGLEVEL    = require('./io/logger').LOGLEVEL;
const Logger      = require('./io/logger').ConsoleLogger;

const ROOMTYPE    = require('../define/room').TYPE;
const EVENT       = require('../define/event').TYPE;
const DEFINE      = require('../define/define');

function emit_err(socket, cmd, err)
{
	socket.emit(cmd, 'Error: ' + err);
}

module.exports = function (http, app)
{
	var io     = require('socket.io')(http);
	var warden = new Warden(io);
	var broker = new BrokerAgent(); //not used for now

	warden.addBroker(ROOMTYPE.CHAT, io);
	warden.addRoom(ROOMTYPE.CHAT, 'Lobby');

	io.on('connect', function(socket)
	{
		socket.on('join-lobby', function(data)
		{
			let user_name = socket.client.id;
			let user_data =
			{
				...data,
				id:   socket.client.id,
				ip:   socket.request.connection.remoteAddress
			};

			Logger.log(
					`Connecting ${user_name} to server.`,
					LOGLEVEL.INFO);

			Logger.log(
					`Total connections: ${Object.keys(io.sockets.connected).length}.`,
					LOGLEVEL.DEBUG);

			warden.addUser(user_name, user_data);
			warden.lobbyJoin(ROOMTYPE.CHAT, 'Lobby', user_name);
		});

		socket.on('disconnect', function(message)
		{
			let user_name = socket.client.id;

			Logger.log(
					`Disconnecting ${user_name} from server - ${message}.`,
					LOGLEVEL.INFO);

			if (!warden.containsUser(user_name))
			{
				Logger.log(`Failed to find user ${user_name}.`, LOGLEVEL.ERR);
				return -1;
			}

			if (warden.roomLeave(ROOMTYPE.CHAT, user_name))
				Logger.log(`Failed to evict user ${user_name}.`, LOGLEVEL.ERR);

			warden.delUser(user_name);
			return 0;
		});

		socket.on('room-create', function(data)
		{
			if (warden.addRoom(ROOMTYPE.CHAT, data.room) < 0)
			{
				emit_err(socket, 'ret-err', 'Room ' + data.room + ' already exists.');
				return -1;
			}

			//TODO add return code for error handling
			if (warden.roomMove(ROOMTYPE.CHAT, data.room, socket.client.id) < 0)
			{
				emit_err(socket, 'ret-svr',
					'Cannot move to created room ' + data.room + '.');
				if (warden.delRoom(data.room) < 0)	//XXX rollback
					emit_err(socket, 'ret-svr',
						'Failed to remove room ' + data.room + '.');
				return -1;
			}

			return 0;
		});

		socket.on('room-join', function(data)
		{
			if (warden.roomMove(ROOMTYPE.CHAT, data.room, socket.client.id) < 0)
			{
				emit_err(socket, 'ret-err', 'Cannot join room ' + data.room + '.');
				return -1;
			}

			return 0;
		});
 
		socket.on('chat-submit', function(msg, room)
		{
			let name = socket.client.id;
			let data = warden.userValue(name);

			if (data === undefined)
			{
				emit_err(socket, 'ret-svr', `Cannot find user ${name}.`);
				return -1;
			}

			io.sockets.in(room).emit(
					'chat-updated',
					{
						message: msg,
						user:    data,
						type:    "message"
					});
		});
	});

	return io;
}
