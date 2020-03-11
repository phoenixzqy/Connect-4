const TYPE = Object.freeze(
{
	LOBBY: 0,
	CHAT:  100,
	GAME:  200
});

const INVITATION_RESPONSE = Object.freeze(
{
	ACCEPT: 0,
	REJECT: 1,
	BLOCK:  2
});

module.exports =
{
	CHAT: require('./chat'),
	GAME: require('./game'),
	TYPE,
	INVITATION_RESPONSE
};
