import React, {
	useState,
	useEffect,
	useCallback
} from 'react';
import {
	useHistory
} from "react-router-dom";
import avatars from '../components/configs/avatars';
import colors from "../components/configs/colors";
import {
	makeStyles
} from '@material-ui/styles';
import {
	Input,
	Avatar,
	Button,
	Popover,
	message
} from 'antd';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: 250,
	},
	headerBox: {
		width: '100%',
		border: `1px solid ${colors.primaryDark}`,
		color: colors.primaryDark,
		padding: 5,
		borderRadius: 5,
		marginBottom: 15,
		textAlign: 'center',
		userSelect: 'none',
		backgroundColor: '#fff'
	},
	userBox: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		backgroundColor: colors.primary,
		padding: 25,
		borderRadius: 5
	},
	avatarBox: {
		flexBasis: 125,
		alignSelf: 'center',
		alignItems: 'center',
		display: 'flex',
		marginTop: -20,
	},
	avatar: {
		backgroundColor: '#fff',
		border: `1px solid ${colors.primaryDark}`,
		cursor: 'pointer',
		margin: 5
	},
	uname: {
		width: 150,
		alignSelf: 'center'
	},
	saveBtn: {
		borderColor: colors.primaryDark,
		backgroundColor: colors.primary,
		marginTop: 15,
		color: '#fff',
		"&:hover, &:focus": {
			borderColor: colors.primaryDark,
			backgroundColor: colors.primaryLight,
			color: '#fff'
		}
	}
});

export default function({
	user,
	setUser,
	socket
}) {
	const classes = useStyles();
	const [show, setShow] = useState(false);
	let history = useHistory();
	const [showPage, setShowPage] = useState(false);
	const joinLobby = useCallback((myUser) => {
		socket.on('connect', () => {
			if (socket.connected) {
				socket.emit("join-lobby", myUser);
				history.push('/connect4/lobby');
			}
		});
		socket.on('user-initiated', user => {
			window.localStorage.setItem('user', JSON.stringify(user));
			setUser(user);
		});
		socket.on('connect_error', err => {
			console.error(err);
			message.error("[CONNECT_ERROR] Failed to connect server!");
		});
		socket.on('connect_timeout', err => {
			console.error(err);
			message.error("[TIMEOUT] Failed to connect server!");
		});
		socket.on('error', err => {
			console.error(err);
			message.error("[ERROR] Failed to connect server!");
		});
		socket.on('ret-svr', err => {
			console.error(err);
			message.error(err);
		});
		socket.on('ret-clt', err => {
			console.error(err);
			message.error(err);
		});
		socket.on('ret-err', err => {
			console.error(err);
			message.error(err);
		});
		socket.on('disconnect', (reason) => {
			if (reason === 'io server disconnect') {
				// the disconnection was initiated by the server, you need to reconnect manually
				message.error("[DISCONNECTED] Disconnected by server. Will try to reconnect soon.");
				socket.open();
			}
			// else the socket will automatically try to reconnect
		});
		socket.on('reconnect_attempt', (attemptNumber) => {
			message.info(`Attempt(${attemptNumber}) to reconnect to server. `);
		});
		socket.on('reconnect_failed', () => {
			message.error("[RECONNECTED_FAILED] Failed to reconnect server!");
		});


		// start connection
		socket.open();
	}, [socket, history, setUser]);

	useEffect(() => {
		let myUser = JSON.parse(window.localStorage.getItem('user'));
		if (myUser) {
			// auto joining 
			joinLobby(myUser);
		} else {
			setShowPage(true);
		}
	}, [joinLobby]);

	function avatarSelectorRender() {
		return avatars.map((url, i) => <Avatar
				className={classes.avatar}
				key={i}
				src={url}
				size={64}
				onClick={e => {
					setUser(user => ({...user, avatar: i}))
					setShow(false);
				}}
			></Avatar>)
	}


	function handleClick() {
		if (!user.name) {
			message.error("User Name can NOT be empty!");
			return;
		}
		if (user.name.length > 16) {
			message.error("User Name can NOT be longer than 16 charactors!");
			return;
		}
		joinLobby(user);
	}


	return (
		<div className={classes.root}>
			{showPage ?
				<>
					<span className={classes.headerBox}>
						Connect - 4 - Online
					</span>
					<div className={classes.userBox}>
						<div className={classes.avatarBox}>
							{/* avatar selector*/}
							<Popover
								content={(<div
										style={{
											maxWidth: 500,
											maxHeight: 300,
											overflow: 'auto'
										}}
									>{avatarSelectorRender()}</div>)}
								trigger="click"
								visible={show}
								onVisibleChange={visible => setShow(visible)}
							>
								<Avatar 
									className={classes.avatar}
									src={avatars[user.avatar]}
									size={64}
									// shape="square"
								/>
							</Popover>
						</div>
						<Input 
							placeholder="What's your name?" 
							className={classes.uname}
							onPressEnter={handleClick}
							onChange={e => {
								let name = e.target.value;
								setUser(user => ({
									...user,
									name
								}))
							}}
						/>
					</div>
					<Button 
						className={classes.saveBtn}
						onClick={handleClick}
					>Let's Play!</Button>
				</>
			: null}
		</div>)
}
