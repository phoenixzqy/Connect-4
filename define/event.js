const TYPE = Object.freeze(
{
	CONNECT:       0,
	DISCONNECT:    1,
	USER_INIT:     100,
	USER_UPDATED:  150,
	ROOM_CREATE:   200,
	ROOM_INVITE:   201,
	ROOM_RESPONSE: 202,
	ROOM_JOIN:     203,
	ROOM_LEAVE:    204,
	ROOM_INVITED:  250,
	ROOM_UPDATED:  251,
	CHAT_SUMIBT:   300,
	CHAT_UPDATED:  350,
	GAME_SUMIBT:   400,
	GAME_UPDATED:  450,
	ERR_GENERIC:   900,			/* standard error. */
	ERR_CLIENT:    901,			/* unexpected client state. */
	ERR_SERVER:    902			/* server side error. */
});

module.exports = 
{
	TYPE
};
