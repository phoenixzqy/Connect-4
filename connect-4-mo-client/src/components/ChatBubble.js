import React, {
	useState,
	useEffect
} from 'react';
import {
	makeStyles
} from '@material-ui/styles';
import {
	Avatar
} from "antd";
import colors from "./configs/colors";
import avatars from "./configs/avatars";

const useStyles = makeStyles({
	root: {
		width: '100%',
		position: 'relative',
		display: 'flex',
		marginTop: 5
	},
	systemMsg: {
		fontSize: 11,
		lineHeight: '12px',
		textAlign: 'center',
		margin: '5px auto',
		color: '#777',
		"&:before": {
			content: '""',
			width: '30%',
			borderTop: '1px solid #ccc',
			position: 'absolute',
			left: 20,
			top: '60%'
		},
		"&:after": {
			content: '""',
			width: '30%',
			borderTop: '1px solid #ccc',
			position: 'absolute',
			right: 20,
			top: '60%'
		}
	},
	avatarBox: {
		marginRight: 5,
	},
	messageBox: {
		padding: "0 5px",
		backgroundColor: '#efefef69',
	},
	userMsgTitle: {
		fontSize: 12,
		margin: 0
	},
	userMsg: {
		fontSize: 12,
		whiteSpace: 'pre-wrap'
	},
	avatar: {
		border: `1px solid ${colors.primary}`,
		borderRadius: 5
	}
});
export default function({
	msg,
	type,
	from,
	to,
	time
}){
	const classes = useStyles();
	const dateString = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
	return (
		<div className={classes.root}>
			{type === 'system' 
				? 
				<>
					<p className={classes.systemMsg}>
						<span>{msg}</span><br/>
						<span style={{color: '#aaa', fontSize: 10}}>{dateString}</span>
					</p>
				</>
				: 
				<>
					<div className={classes.avatarBox}>
						<Avatar 
							size={30}
							src={avatars[from.avatar]}
							shape="square"
							className={classes.avatar}
						/>
					</div>
					<div className={classes.messageBox}>
						<p className={classes.userMsgTitle}>
							<span 
								style={{
									fontWeight: 'bold',
									color: from.id === to.id ? colors.primaryDark : undefined
								}}
							>{from.name}@{from.ip}</span>
							<span style={{color: '#aaa', marginLeft: 15}}>{dateString}</span>
						</p>
						<code className={classes.userMsg}>
							{msg}
						</code>
					</div>
				</>
			}
		</div>
	)
}


