import React, {
	useState,
	useEffect,
	createRef,
	useRef
} from 'react';
import {
	makeStyles
} from '@material-ui/styles';
import { 
	Button,
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
		position: 'relative'
	},
	inputBox: {
		height: INPUT_BOX_HEIGHT,
	},
	chatBox: {
		height: 'calc(100% - 106px)',
		overflowY: 'auto',
		padding: 15
	}
});
export default function({
	user,
	chats,
	submitChat
}){
	const messagesEndRef = React.createRef();
	const [msg, setMsg] = useState('');
	const [shouldScroll, setShouldScroll] = useState(true);
	const classes = useStyles();

	useEffect(() => {
		if (shouldScroll) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [chats,shouldScroll]);
	return (
		<div className={classes.root}>
			<div className={classes.chatBox}>
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
					style={{resize: 'none', borderRadius: 0}}
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

