const DEFINE   = require('./config.json').define;

const LOGGER   = require('./logger')

const LOGLEVEL = LOGGER.LOGLEVEL;
const Logger   = LOGGER.ConsoleLogger;

const ROOMTYPE = require(`${DEFINE}/room`).TYPE;

class Users
{
	constructor()
	{
		this.users = new Map();
	}

	size()
	{
		return this.users.size;
	}

	add(name, data)
	{
		this.users.set(name, {...data, room: null});
		//Logger.log(`Added user ${name}.`, LOGLEVEL.DEBUG);
	}

	erase(name)
	{
		this.users.delete(name);
		//Logger.log(`Deleted user ${name}.`, LOGLEVEL.DEBUG);
	}

	join(user_name, room_name)
	{
		this.value(user_name).room = room_name;
	}

	exit(name)
	{
		this.value(name).room = null;
	}

	value(name)
	{
		return this.users.get(name);
	}

	room(name)
	{
		if (!this.contains(name))
			return -1;

		return this.value(name).room;
	}

	contains(name)
	{
		return this.users.has(name);
	}

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
			Logger.log(`name: ${key}, data: ${JSON.stringify(value)}.`, LOGLEVEL.DEBUG);
		});
	}
}

module.exports = Users;
