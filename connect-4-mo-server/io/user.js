const DEFINE   = require('./config.json').define;

const LOGGER   = require('./logger');

const LOGLEVEL = LOGGER.LOGLEVEL;
const Logger   = LOGGER.ConsoleLogger;

const ROOMTYPE = require(`${DEFINE}/room`).TYPE;

//user can be in multiple chat rooms but can only be in one game or lobby room
class User
{
	constructor(name, data)
	{
		this.name      = name;
		this.data      = data;
		this.room      = null;	//current game/lobby room
		this.rooms     = new Set();

		//define interval and threshold in define/chat.js
		//XXX TODO circular array for this
		this.chatCount = 0;
		this.chats     = new Array();
	}

	name()      { return this.name; }
	room()      { return this.room; }
	rooms()     { return this.rooms; }
	chatCount() { return this.chatCount; }

	data()
	{
		return 
		{
			...this.data,
			room: this.room
		};
	}

	join(type, name)
	{
		switch (type)
		{
			case ROOMTYPE.CHAT: break;
			default: this.room = name; break;
		}

		this.rooms.add(name);
	}

	exit(type, name)
	{
		switch (type)
		{
			case ROOMTYPE.CHAT: break;
			default: this.room = null; break;
		}

		this.rooms.delete(name);
	}

	updateChat()
	{
		const var time = Date.now();

		//XXX update circular array
	}

	toJSON()
	{
		return 
		{
			userName:   this.name,
			userAvatar: this.avatar,
			userIP:     this.ip,
			userID:     this.id
		};
	}

	dump()
	{
		Logger.log(
			`name:   ${this.name}, `
			`avatar: ${this.name}, `
			`ip:     ${this.name}, `
			`id:     ${this.name}, `
			`room:   ${this.room}, `
			`rooms:  ${JSON.stringify(this.rooms)}, `
			`chats:  ${this.chatCount}`,
			LOGLEVEL.DEBUG
		);
	}
}

module.exports = User;
