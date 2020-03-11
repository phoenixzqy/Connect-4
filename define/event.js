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
	RET_ERR:       900,			/* standard error. */
	RET_CLT:       901,			/* unexpected client state. */
	RET_SVT:       902			/* server side error. */
});

module.exports = 
{
	TYPE
};
