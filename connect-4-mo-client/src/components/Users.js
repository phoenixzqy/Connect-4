import React, {
	useState,
	useEffect
} from 'react';
import {
	useHistory
} from "react-router-dom";
import {
	makeStyles
} from '@material-ui/styles';
import {
	Avatar,
	Button,
	Icon
} from 'antd';
import avatars from '../components/configs/avatars';
import colors from "../components/configs/colors";

const USER_BOX_HEIGHT = 165;

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		position: 'relative'
	},
	userBox: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: USER_BOX_HEIGHT,
		backgroundColor: colors.primaryDark,
		padding: 25,
	},
	avatarBox: {
		flexBasis: 100,
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
		alignSelf: 'center',
		textAlign: 'center',
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold'
	},
	uip: {
		alignSelf: 'center',
		textAlign: 'center',
		color: '#fff',
		fontSize: 10
	},
	userListBox: {
		height: `calc(100% - ${USER_BOX_HEIGHT}px)`,
		overflow: 'auto'
	},
	roomListItem: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column'
	},
	roomName: {
		padding: '0 15px',
		backgroundColor: colors.primaryLight,
		color: '#333',
		borderBottom: `1px solid ${colors.primaryDark}`,
		fontWeight: 'bold',
		userSelect: 'none'
	},
	roomUserCount: {
		position: 'absolute',
		right: 10,
		fontSize: 12,
		fontWeight: 'normal'
	},
	roomListBox: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column'
	},
	userListItem: {
		display: 'flex',
		padding: '5px 10px',
		borderBottom: `1px solid ${colors.primaryLight}`,
		cursor: 'pointer',
		"&:hover": {
			backgroundColor: '#eee'
		}
	},
	ulAvatar: {
		border: `1px solid ${colors.primaryLight}`,
		borderRadius: 5
	},
	ulinfo: {
		display: 'flex',
		flexDirection: 'column',
		paddingLeft: 10
	},
	ulName: {
		fontSize: 14,
		fontWeight: 'bold'
	},
	ulip: {
		fontSize: 8
	},
	logoutBtn: {
		position: 'absolute',
		left: 10,
		top: 10,
		fontSize: 12,
		height: 25,
		width: 25,
		border: `1px solid ${colors.primaryDark}`,
		backgroundColor: colors.primary,
		color: '#fff',
		'&:hover, &:focus': {
			border: `1px solid ${colors.primaryDark}`,
			backgroundColor: colors.primaryLight,
			color: colors.primaryDark,
		}
	}
});

export default function({
	user,
	rooms
}){
	const classes = useStyles();
	const history = useHistory();
	function userListRender(users) {
		let result = [];
		for (let uid in users) {
			result.push(
				<div
					key={uid}
					className={classes.userListItem}
				>
					<Avatar 
						className={classes.ulAvatar}
						src={avatars[users[uid].avatar]}
						size={35}
						shape="square"
					/>
					<div className={classes.ulinfo}>
						<span 
							className={classes.ulName}
							style={{
								color: user.id === uid ? colors.primaryDark : null
							}}
						>{users[uid].name}</span>
						<span className={classes.ulip}>{users[uid].ip}</span>
					</div>
				</div>
			);
		}
		return result;
	}
	function roomListRender() {
		let result = [];
		for (let rName in rooms) {
			result.push(
				<div 
					key={rName} 
					className={classes.roomListItem}
				>
					<div className={classes.roomName}>
						<span>{rName}</span>
						<span className={classes.roomUserCount}>
							{Object.keys(rooms[rName].users).length}
							<Icon type="user" />
						</span>
					</div>
					<div className={classes.roomListBox}>
						{userListRender(rooms[rName].users)}
					</div>
				</div>
			);
		}
		return result;
	}
	return (
		<div className={classes.root}>
			<div className={classes.userBox}>
				<Button 
					className={classes.logoutBtn} 
					icon="logout" 
					onClick={() => {
						// logout
						window.localStorage.clear();
						window.location.href = '/';
					}}
				/>
				<div className={classes.avatarBox}>
						<Avatar 
							className={classes.avatar}
							src={avatars[user.avatar]}
							size={64}
							// shape="square"
						/>
				</div>
				<span className={classes.uname}>{user.name}</span>
				<span className={classes.uip}>{user.ip}</span>
			</div>
			<div className={classes.userListBox}>
				{ rooms 
					?
					roomListRender()
					: null}
			</div>
		</div>
	)
}
