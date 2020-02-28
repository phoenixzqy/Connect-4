import React, {
	useState,
	useEffect,
	useCallback
} from 'react';
import {
  Switch,
  Route,
	useHistory,
	useRouteMatch
} from "react-router-dom";
import {
	makeStyles
} from '@material-ui/styles';

import Users from "../components/Users";
import Rooms from "../components/Rooms";
import Chat from "../components/Chat";
import Connect4 from "../components/Connect4";

import colors from "../components/configs/colors";

const VIEWPORT_CONFIG = {
	width: '100vw',
	height: '100vh',
	userBoxWidth: 250,
	roomBoxWidth: 250,
	gameBoxWidth: 'calc(100vw - 750px)',
	chatBoxWidth: 'calc(100vw - 500px)',
	chatBoxWidth1: 500,
}
const useStyles = makeStyles({
	root: {
		width: VIEWPORT_CONFIG.width,
		height: VIEWPORT_CONFIG.height,
		// border: `1px solid ${colors.primaryDark}`,
		// backgroundColor: '#fff',
		// borderRadius: 5,
		display: 'flex',
		flexDirection: 'row',
		overflow: 'hidden',
	},
	userBox: {
		width: VIEWPORT_CONFIG.userBoxWidth,
	},
	roomBox: {
		width: VIEWPORT_CONFIG.roomBoxWidth,
		border: `1px solid ${colors.primaryDark}`,
		borderTop: 'none',
		borderBottom: 'none',
	},
	chatBox: {
		position: 'relative'
	},
	gameBox: {
		width: VIEWPORT_CONFIG.gameBoxWidth,
		border: `1px solid ${colors.primaryDark}`,
		borderTop: 'none',
		borderBottom: 'none',
	}
});

export default function({
	user,
	setUser,
	socket
}) {
	const classes = useStyles();
	let history = useHistory();
	let { path, url } = useRouteMatch();
	const [rooms, setRooms] = useState(null);
	const [chats, setChats] = useState([]);
	const changePage = useCallback((page) => {
		history.push(`${url}/${page}`);
		setChats([]);
	}, [url, history, setChats]);
	useEffect(() => {
		if (socket.disconnected) {
			history.push('/');
			return;
		} else {
			socket.on("user-updated", data => {
				console.log(data);
				setRooms(data.rooms);
				let currentPage = history.location.pathname.split('/')[2].toLowerCase();
				let currentRoom = data.currentRoom.toLowerCase();
				if (currentPage !== currentRoom) {
					changePage(currentRoom);
				}
			});
			socket.on("chat-updated", msg => {
				setChats(chat => {
					let newChat = [
						...chat, 
						{
							...msg,
							time: new Date()
						}
					];
					if (newChat.length > 1000) newChat.shift();
					return newChat;
				});
			});
		}
	}, [socket, history, setChats, changePage]);
	function createRoom(room) {
		socket.emit('room-create', { room });
	}
	function joinRoom(room) {
		socket.emit('room-join', { room });
	}
	function submitChat(msg) {
		socket.emit('chat-submit', msg);
	}
	return (
		<div className={classes.root}>
			<div className={classes.userBox}>
				<Users user={user} rooms={rooms} />
			</div>
			<Switch>
				<Route path={`${path}/lobby`}>
					<div className={classes.roomBox}>
						<Rooms rooms={rooms} createRoom={createRoom} joinRoom={joinRoom}/>
					</div>
				</Route>
				<Route path={`${path}/:room`}>
					<div className={classes.gameBox}>
						<Connect4 
							socket={socket}
							leaveRoom={() => {
								joinRoom('Lobby');
								changePage('lobby');
							}}
						/>
					</div>
				</Route>
			</Switch>
			<div 
				className={classes.chatBox}
				style={{
					width: history.location.pathname === `${path}/lobby` ? 
					VIEWPORT_CONFIG.chatBoxWidth :
					VIEWPORT_CONFIG.chatBoxWidth1
				}}
			>
				<Chat user={user} chats={chats} submitChat={submitChat}/>
			</div>
		</div>
	)
}
