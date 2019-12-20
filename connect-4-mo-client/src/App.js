import React, {
	useState,
	useEffect
} from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
	const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState("");
	const [user, setUser] = useState("");
	const [chatChain, setChatChain] = useState([]);
	useEffect(() => {
		if (!socket) {
			setSocket(io());
		} else {
			socket.on('chat-update', msg => {
				msg.colorstyle = {color: 'black'};

				if(msg.ip == 'SERVER') {
					msg.colorstyle = {color: 'gray'};
				}

				setChatChain(chain => {
					chain.push(msg);
					if (chain.length > 100) {
						chain.shift();
					}
					return [...chain];
				});
			});
		}
	}, [socket]);

	const handleUserChange = event => {
		setUser(event.target.value);
	}
	const handleMsgChange = event => {
		setMessage(event.target.value);
	}
	const handleMsgSubmit = event => {
		event.preventDefault();
		socket.emit('chat-message-submit', {
			user: user || "Anomynous",
			message
		});
		setMessage("");
		return false;
	}
	return (
		<div className="App">
			<ul>{chatChain.map((msg, index) => {
				return <li key={index} style={msg.colorstyle}>{msg.user}[{msg.ip}]: {msg.message}</li>
			})}</ul>
			<form action="">
				<input 
					style={{width: '15%'}}
					placeholder="Anonymous"
					autoComplete="off" 
					value={user} 
					onChange={handleUserChange}
				/>

				<input 
					style={{width: '75%'}}
					placeholder="Message"
					autoComplete="off" 
					value={message} 
					onChange={handleMsgChange}
				/>
				<button onClick={handleMsgSubmit}>Send</button>
			</form>
		</div>
	);
}

export default App;
