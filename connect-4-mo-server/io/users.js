const LOGGER   = require('./logger')

const LOGLEVEL = LOGGER.LOGLEVEL;
const Logger   = LOGGER.ConsoleLogger;

const CONSTANTS = require('./constants')

class Users
{
	constructor()
	{
		this.users = new Map();
	}

	size()
	{
		return this.users.size();
	}

	add(name, data)
	{
		this.users.set(name, data);
		Logger.log(`Added user ${name}.`, LOGLEVEL.DEBUG);
	}

	erase(name)
	{
		this.users.delete(name);
		Logger.log(`Deleted user ${name}.`, LOGLEVEL.DEBUG);
	}

	value(key)
	{
		return this.users.get(key);
	}

	room(key)
	{
		if (!this.users.has(key))
			return -1;

		return this.users.get(key).room;
	}

	contains(name)
	{
		return this.users.has(name);
	}

	dump()
	{
		this.users.forEach(function (value, key)
		{
			Logger.log(`name: ${key}, data: ${value}.`, LOGLEVEL.INFO);
		})
	}
}

module.exports = Users;
