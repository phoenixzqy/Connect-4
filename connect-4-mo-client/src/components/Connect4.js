import React from "react";
import {
	Button,
} from "antd";

export default function({ 
	socket,
	leaveRoom
}) {
	
	return (
		<div>
			Connect 4 game penal
			<Button 
				icon="logout"
				onClick={() => leaveRoom()}
			>Leave Room</Button>
		</div>
	)
}
