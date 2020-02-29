import React, {
	useState,
} from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";
import io from 'socket.io-client';
// views
import Welcome from './views/Welcome';
import Game from './views/Game';

export default function() {
	const [user, setUser] = useState({
		name: "",
		avatar: 14,
		ip: ''
	});
	const testWSLocation = "http://localhost:3000";
	let wslocation = window.location.port === '3001' ? testWSLocation : undefined;
	const [socket] = useState(io(
		wslocation,
		{
			autoConnect: false,
			reconnectionAttempts: 100,
			reconnectionDelay: 1000
		}
	));
	return ( 
		<Router>
			<Switch>
				<Route path="/connect4">
					<Game user={user} setUser={setUser} socket={socket}/>
				</Route>
				<Route path="/">
					<Welcome user={user} setUser={setUser} socket={socket}/>
				</Route>
			</Switch>
		</Router>
	)
}
