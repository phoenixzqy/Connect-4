const EVENTS = {
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

const LOBBY = 'Lobby';

module.exports = {
	EVENTS,
	LOBBY
};
