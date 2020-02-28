import React, {
	useState,
	useEffect,
	createRef,
} from 'react';
import {
	makeStyles
} from '@material-ui/styles';
import { 
	Input
} from 'antd';
import colors from "../components/configs/colors";
import ChatBubble from "./ChatBubble";
const { TextArea } = Input;

const INPUT_BOX_HEIGHT = 106;
const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		height: '100%',
		position: 'relative',
		padding: 10
	},
	inputBox: {
		height: INPUT_BOX_HEIGHT,
	},
	chatBox: {
		height: 'calc(100% - 106px)',
		overflowY: 'auto',
		padding: 15
	},
	textArea: {
		resize: 'none', 
		borderRadius: 0,
		border: `1px solid ${colors.primary}`,
		'&:hover, &:focus': {
			border: `1px solid ${colors.primary}`,
			boxShadow: `0 0 0 2px ${colors.primaryLight}`
		}
	}
});
export default function({
	user,
	chats,
	submitChat
}){
	const messagesEndRef = createRef();
	const chatBoxRef = createRef();
	const [msg, setMsg] = useState('');
	const [shouldScroll, setShouldScroll] = useState(true);
	const classes = useStyles();
	useEffect(() => {
		if (shouldScroll) {
			messagesEndRef.current.scrollIntoView({ behavior:"smooth" });
		}
	}, [chats, shouldScroll, messagesEndRef]);

	function handleScroll(e) {
		let scrollFromBottom = 
			chatBoxRef.current.scrollHeight 
			- (
					chatBoxRef.current.scrollTop 
				+ chatBoxRef.current.offsetHeight
			);
		if (scrollFromBottom === 0) {
			setShouldScroll(true);
		} else {
			setShouldScroll(false);
		}
	}
	return (
		<div className={classes.root}>
			<div 
				onScroll={handleScroll}
				ref={chatBoxRef}
				className={classes.chatBox}>
				{chats 
					?
					chats.map((chat, i) => 
						<ChatBubble
							key={i} 
							msg={chat.message}
							type={chat.type}
							to={user}
							from={chat.user}
							time={chat.time}
						/>
					)
					: null}
					<div ref={messagesEndRef} />
			</div>
			<div className={classes.inputBox}>
				<TextArea 
					rows={4} 
					value={msg} 
					className={classes.textArea}
					placeholder="Press Ctrl + Enter to send message."
					onChange={e => {
						let value = e.target.value;
						setMsg(value);
					}}
					onPressEnter={e => {
						if (e.ctrlKey) {
							e.preventDefault();
							if (msg) { 
								setMsg("");
								submitChat(msg);
							}
						}
					}}
				/>
			</div>
		</div>
	)
}

