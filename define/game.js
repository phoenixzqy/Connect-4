const TYPE = Object.freeze(
{
	ROCKPAPERSCISSORS: 0,
	CONNECT4:          1
});

const STATE = Object.freeze(
{
	WAITING:  0,
	STARTING: 1,
	STARTED:  2
});

module.exports =
{
	PLAYER: require('./player'),
	RPS:    require('./rockpapersicssors'),
	C4:     require('./connect4'),
	TYPE,
	STATE
};
