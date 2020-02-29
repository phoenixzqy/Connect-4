const io = require('socket.io-client');
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
let host_url = 'ws://localhost:3000';
let socket = io.connect(host_url);
const onevent = socket.onevent;
socket.onevent = function(packet) {
	let args = packet.data || [];
	onevent.call(this, packet); // original call
	packet.data = ["*"].concat(args);
	onevent.call(this, packet); // additional call to catch-all
};
// avatar attribute: Icons made by <a href="https://www.flaticon.com/authors/darius-dan" title="Darius Dan">Darius Dan</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
socket.on("*", function(event, data) {
	console.log(
		`-----------[${new Date().toLocaleString()}]---------
Event: ${event} \n
Response: \n ${JSON.stringify(data, undefined, 4)}
----------------------------------------------------`
	);
});

const options = {
	'help': 'print helper message',
	'exit': 'exit',
	'emit': `emit an event. eg: emit {"name": "chat-submit", "params": {"user": "tester", "message": "test msg"}}`
}
console.log(options);

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
const userInput = () => {
	readline.question('', (line) => {
		if (line.startsWith('help')) {
			console.log(options);
		} else if (line.startsWith('exit')) {
			socket.close();
			readline.close()
			return;
		} else if (line.startsWith('emit')) {
			let body = line.substr(4).trim();
			if (isJsonString(body)) {
				body = JSON.parse(body);
				if (!body.name && ! typeof body.name === 'string') {
					console.log("event name is required, and it must be a valid string!");
				}
				else if (!body.params) {
					console.log("event name is required!");
				} else {
				  socket.emit(body.name, body.params);
				}
			} else {
				console.log('invalid JSON format');
			}
		}
		userInput();
	});
}
userInput();
