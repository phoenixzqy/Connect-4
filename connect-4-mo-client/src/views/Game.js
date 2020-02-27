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

import colors from "../components/configs/colors";

const VIEWPORT_CONFIG = {
	width: 1024,
	height: 640,
	userBoxWidth: '20%',
	roomBoxWidth: '20%',
	gameBoxWidth: '60%',
	chatBoxWidth: '60%',
}
const useStyles = makeStyles({
	root: {
		width: VIEWPORT_CONFIG.width,
		height: VIEWPORT_CONFIG.height,
		border: `1px solid ${colors.primaryDark}`,
		borderRadius: 5,
		display: 'flex',
		flexDirection: 'row',
		overflow: 'hidden',
		backgroundColor: '#fff'
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
	const [page, setPage] = useState('lobby');
	const [rooms, setRooms] = useState(null);
	const [chats, setChats] = useState([]);
	useEffect(() => {
		if (socket.disconnected) {
			history.push('/');
			return;
		} else {
			socket.on("user-updated", data => {
				setRooms(data);
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
			})
		}
	}, [socket, history, setChats]);
	function changePage() {
		history.push(`${url}/${page}`);
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
						<Rooms rooms={rooms}/>
					</div>
				</Route>
				<Route path={`${path}/game`}>
					<div className={classes.gameBox}>
						Game.
					</div>
				</Route>
			</Switch>
			<div 
				className={classes.chatBox}
				style={{
					width: page === 'lobby' ? '60%' : '20%'
				}}
			>
				<Chat user={user} chats={chats} submitChat={submitChat}/>
			</div>
		</div>
	)
}
