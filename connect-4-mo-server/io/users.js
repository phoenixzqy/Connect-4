const DEFINE   = require('./config.json').define;

const User     = require('./user');

const LOGGER   = require('./logger');

const LOGLEVEL = LOGGER.LOGLEVEL;
const Logger   = LOGGER.ConsoleLogger;

class Users
{
	constructor()
	{
		this.users = new Map();
	}

	size()         { return this.users.size(); }
	contains(name) { return this.users.has(name); }

	user(name) { return this.users.get(name); }
	data(name) { return this.users.get(name).data(); }
	room(name) { return this.users.get(name).room(); }

	insert(name, data) { this.users.set(name, new User(name, data)); }
	erase(name)        { this.users.delete(name); }

	toJSON()
	{
		const obj = {};
		this.users.forEach(function (value, key)
		{ obj[key] = value; });

		return obj;
	}

	dump()
	{
		this.users.forEach(function (value, key)
		{
			Logger.log(
				`name: ${key}, data: ${JSON.stringify(value)}.`,
				LOGLEVEL.DEBUG);
		});
	}
}

module.exports = Users;
