import React, {
	useState,
	useEffect
} from 'react';
import {
	makeStyles
} from '@material-ui/styles';
import { Button } from 'antd';
import colors from "../components/configs/colors";

const HEADER_HEIGHT = 50;
const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		position: 'relative'
	},
	headerBox: {
		backgroundColor: colors.primaryLight,
		height: HEADER_HEIGHT,
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottom: `1px solid ${colors.primaryDark}`,
	},
	header: {
		alignSelf: 'center',
		fontSize: 18,
		fontWeight: 'bold'
	},
	roomBox: {
		display: 'flex',
		height: `calc(100% - ${HEADER_HEIGHT}px)`,
		overflow: 'auto',
		flexDirection: 'column'
	},
	roomListItem: {
		display: 'inline-block',
		height: 50,
		width: '100%',
		position: 'relative',
		borderBottom: `1px solid ${colors.primaryLight}`,
		overflow: 'hidden',
		padding: '5px 15px',
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: '#efefef'
		}
	},
	rName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.primary,
		margin: 0
	},
	rStatus: {
		position: 'absolute',
		right: 15,
		top: 5,
		fontSize: 12
	},
	rucount: {
		margin: 0,
		fontSize: 12
	},
	addBtn: {
		position: 'absolute',
		right: 15,
		top: 12,
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
	},
});



export default function({ rooms }){
	const classes = useStyles();
	function roomListRender() {
		let result = [];
		for (let room in rooms) {
			if (room === 'Lobby') continue;
			result.push(
				<div className={classes.roomListItem}>
					<p className={classes.rName}>{room}</p>
					<span className={classes.rStatus}>[status]</span>
					<p className={classes.rucount}> users: {Object.keys(rooms[room].users).length}</p>
				</div>
			);
		}
		return result;
	}
	return (
		<div className={classes.root}>
			<div className={classes.headerBox}>
				<span className={classes.header}>Rooms</span>
				<Button icon="plus" className={classes.addBtn}/>
			</div>
			<div className={classes.roomBox}>
				{
					rooms 
					? roomListRender()
					: null
				}
			</div>
		</div>
	);
}
