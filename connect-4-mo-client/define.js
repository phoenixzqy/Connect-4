const EVENTS = {
	CONNECT: "connect",
	DISCONNECT: "disconnect",
	USER_UPDATED: "user-updated",
	ROOM_CREATE: "room-create",
	ROOM_JOIN: "room-join",
	ROOM_UPDATED: "room-updated",
	CHAT_SUBMIT: "chat-submit",
	CHAT_UPDATED: "chat-updated",
	RET_ERR: "ret-err",			/* standard error. */
	RET_CLT: "ret-clt",			/* unexpected client state. */
	RET_SVT: "ret-svr"			/* server side error. */
};

const LOBBY = 'Lobby';

module.exports = {
	EVENTS,
	LOBBY
};
