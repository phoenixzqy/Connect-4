const DEFINE   = require('./config.json').define;

const LOGLEVEL = require('./logger').LOGLEVEL;
const Logger   = require('./logger').ConsoleLogger;

class InviteList
{
	constructor(size, max_invites)
	{
		this.max  = max_invites;
		this.size = size;
		this.list = new Map();
	}

	size()
	{
		return this.list.size();
	}

	//TODO enum ret code
	add(invitor, invitee)
	{
		if (this.list.size() >= this.size)
			return -1;

		if (!this.list.has(invitor))
			this.list.set(invitor, new Set());

		if (this.list.get(invitor).has(invitee))
			return 1;	//already invited

		if (this.list.get(invitor).size() >= this.max)
			return 2;	//too many invites

		this.list.get(invitor).add(invtee);
		return 0;
	}

	erase(invitor)
	{
		if (!this.list.has(invitor))
		{
			Logger.log(`Cannot find invitor ${invitor} in list.`,
				LOGLEVEL.WARN);

			return 0;
		}

		this.list.erase(invitor);
		return 0;
	}

	contains(invitor)
	{
		return this.list.has(invitor);
	}

	dump()
	{
		this.list.forEach(function (invitees, invitor)
		{
			invitees.forEach(function (invitee))
			{
				Logger.log(
					`invitor: ${invitor}, invitee: ${invitee}.`,
					LOGLEVEL.DEBUG);
			}
		});
	}
}
