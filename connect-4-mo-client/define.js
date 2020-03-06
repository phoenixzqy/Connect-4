const EVENTS =
{
	CONNECT:       0,
	DISCONNECT:    1,
	USER_INIT:     100,
	USER_UPDATED:  150,
	ROOM_CREATE:   200
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
};

const MessageType =
{
	SERVER: 0,
	USER:   1
};

const RoomType =
{
	LOBBY: 0,
	GAME:  1,
	CHAT:  2
};

const RoomInvitationResponse =
{
	ACCEPT: 0,
	REJECT: 1,
	BLOCK:  2
};

const GameType =
{
	ROCKPAPERSCISSORS: 0,
	CONNECT4:          1
};

const GameState =
{
	WAITING:  0,
	STARTING: 1,
	STARTED:  2
};

const PlayerState =
{
	NOTREADY: 0,
	READY:    1,
	INGAME:   2,
	WON:      3,
	LOST:     4,
	TIED:     5
};

const PlayerAction =
{
	READY:     0,
	UNREADY:   1,
	LEAVE:     2,
	SURRENDER: 3,
	REMATCH:   4,
};

const RockPaperScissorsAction =
{
	ROCK:     0,
	PAPER:    1,
	SCISSORS: 2,
	RANDOM:   3
};

const Connect4Action =
{
	PLACETOKEN: 0,
	PLAYCARD:   1
};

const EmoteAction =
{
	APPROVAL:   100,
	WAVE:       101,
	HAPPY:      102,
	SAD:        103,
	ANGER:      104,
	WEEP:       105,
	TAUNT:      106,
	RIDICULE:   107,
	THUMBSUP:   108,
	THUMBSDOWN: 109,
	CONFUSED:   110
};

const LOBBY = 'Lobby';

module.exports =
{
	EVENTS,
	LOBBY
};
