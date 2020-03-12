const ACTION = Object.freeze(
{
	ROCK:     0,
	PAPER:    1,
	SCISSORS: 2,
	RANDOM:   3
});

const MIN_PLAYER = 2;
const MAX_PLAYER = 10;

module.exports =
{
	ACTION,
	MIN_PLAYER,
	MAX_PLAYER
};
