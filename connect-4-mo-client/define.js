const EVENTS =
{
	CONNECT:      "connect",
	DISCONNECT:   "disconnect",
	USER_UPDATED: "user-updated",
	GAME_CREATE:  "game-create",
	GAME_JOIN:    "game-join",
	CHAT_CREATE:  "chat-create",
	CHAT_JOIN:    "chat-join",
	GAME_SUMIBT:  "game-submit",
	GAME_UPDATED: "game-updated",
	CHAT_SUBMIT:  "chat-submit",
	CHAT_UPDATED: "chat-updated",
	RET_ERR:      "ret-err",			/* standard error. */
	RET_CLT:      "ret-clt",			/* unexpected client state. */
	RET_SVT:      "ret-svr"				/* server side error. */
};

const GameType =
{
	ROCKPAPERSCISSORS: 0,
	CONNECT4:          1
};

const GameState =
{
	WAITING:  0,
	STARTING: 1
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

const RockPaperScissorsAction
{
	ROCK:     0,
	PAPER:    1,
	SCISSORS: 2,
	RANDOM:   3
};

const Connect4Action
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
