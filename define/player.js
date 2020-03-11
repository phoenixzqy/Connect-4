const STATE = Object.freeze(
{
	NOTREADY: 0,
	READY:    1,
	INGAME:   2,
	WON:      3,
	LOST:     4,
	TIED:     5
});

const ACTION = Object.freeze(
{
	STATE:    0,
	GAMEPLAY: 1,
	EMOTE:    2
});

const STATE_ACTION = Object.freeze(
{
	READY:     0,
	UNREADY:   1,
	LEAVE:     2,
	SURRENDER: 3,
	REMATCH:   4,
});

const NEXT = Object.freeze(
{
	FORWARD : 0,
	BACKWARD: 1
});

module.exports =
{
	EMOTE: require('./emote'),
	STATE,
	ACTION,
	STATE_ACTION,
	NEXT
};
