const LOGLEVEL =
{
	EMERG:  0,
	ALERT:  1,
	CRIT:   2,
	ERR:    3,
	WARN:   4,
	NOTICE: 5,
	INFO:   6,
	DEBUG:  7
};

class Logger
{
	log(message, level) {}
}

class ConsoleLogger extends Logger
{
	severity(level)
	{
		switch(level)
		{
			case LOGLEVEL.EMERG:  return "EMERG";
			case LOGLEVEL.ALERT:  return "ALERT";
			case LOGLEVEL.CRIT:   return "CRIT";
			case LOGLEVEL.ERR:    return "ERR";
			case LOGLEVEL.WARN:   return "WARN";
			case LOGLEVEL.NOTICE: return "NOTICE";
			case LOGLEVEL.INFO:   return "INFO";
			case LOGLEVEL.DEBUG:  return "DEBUG";
			default:              return "?"
		}
	}

	log(message, level)
	{
		let severity = this.severity(level);
		console.log(`[${severity}]` + message);
	}
}

var logger = new ConsoleLogger();

module.exports = 
{
	LOGLEVEL,
	ConsoleLogger: logger
}
