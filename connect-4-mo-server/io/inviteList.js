const DEFINE   = require('./config.json').define;

const LOGLEVEL = require('./logger').LOGLEVEL;
const Logger   = require('./logger').ConsoleLogger;

class InviteList
{
	//TODO need thread to cleanup timed out resources
	//     js liimitation? in such case cleanup on add() and keep lowest
	constructor(size, max_invites, timeout)
	{
		this.max  = max_invites;
		this.curr = 0;
		this.size = size;
		this.list = new Map();
	}

	size() { return this.size; }

	//TODO enum ret code
	add(invitor, invitee, timeout)
	{
		const var ttl = Date.now() + timeout;

		if (this.curr >= this.size)
			return -1;

		if (!this.list.has(invitor))
			this.list.set(invitor, new Map());

		if (this.list.get(invitor).has(invitee))
			return 1;	//already invited

		if (this.list.get(invitor).size() >= this.max)
			return 2;	//too many invites

		this.list.get(invitor).set(invtee, ttl);
		this.curr += 1;
		return 0;
	}

	erase(invitor, invitee)
	{
		this.list.get(invitor).delete(invitee);

		if (!this.list.size())
			this.list.delete(invitor);

		this.curr -= 1;
	}

	verify(invitor, invitee)
	{
		const var time = Date.now();

		if (!this.contiains(invitor))
		{
			Logger.log(`Cannot find invitor ${invitor} in list.`,
				LOGLEVEL.WARN);
			return -1;
		}

		if (!this.containsInvitee(invitor, invitee))
		{
			Logger.log(`Cannot find invitee ${invitee} in list.`,
				LOGLEVEL.WARN);
			return -1;
		}

		return time.getTime() >= this.list.get(invitor).get(invitee).getTime();
	}

	contains(invitor)
	{
		return this.list.has(invitor);
	}

	containsInvitee(invitor, invitee)
	{
		return this.list.get(invitor).has(invitee);
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

module.exports = InviteList;
