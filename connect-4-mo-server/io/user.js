const DEFINE   = require('./config.json').define;

const LOGGER   = require('./logger')

const LOGLEVEL = LOGGER.LOGLEVEL;
const Logger   = LOGGER.ConsoleLogger;

const ROOMTYPE = require(`${DEFINE}/room`).TYPE;

class User
{
	constructor(name, avatar, id, ip)
	{
		this.name      = name;
		this.avatar    = avatar;
		this.ip        = ip;
		this.id        = id;
		this.rooms     = new Set();
		//define interval and threshold in define/chat.js
		//XXX TODO circular array for this
		this.chatCount = 0;
		this.chats     = new Array();
	}

	chatCount()
	{
		return this.chatCount;
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
			`rooms:  ${JSON.stringify(this.rooms)}, `
			`chats:  ${this.chatCount}`,
			LOGLEVEL.DEBUG
		);
	}
}

module.exports = User;
