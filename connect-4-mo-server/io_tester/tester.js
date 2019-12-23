$(document).ready(function() {

	var socket = io.connect('http://localhost:3000');

	var onevent = socket.onevent;
	socket.onevent = function(packet) {
		var args = packet.data || [];
		onevent.call(this, packet); // original call
		packet.data = ["*"].concat(args);
		onevent.call(this, packet); // additional call to catch-all
	};

	socket.on("*", function(event, data) {
		// TODO: append to a log window
		let ele = $('#log');
		ele.append(`<b>Event</b>: <i>${event}</i> [${new Date().toLocaleString()}] <br/>`);
		ele.append('<b>Response</b>: ');
		ele.append(JSON.stringify(data, undefined, 4));
		ele.append('<br/>');
	});

	window.handleClick = function(event) {
		const params = io_define[event].params;
		$("#event-params").val(JSON.stringify(params));
		$("#event-name").val(event);
	}

	// load io_define to table
	for (let event in io_define) {
		let tableEle = $("#event-list").find('tbody');
		// TODO: onclick in loop.... wtf
		tableEle.append(
			`<tr>
				<td>${event}</td>
				<td><button onclick="handleClick('${event}')">Apply</button></td>
			</tr>
		`);
	}

	// emit new event
	$("#send-btn").click(function() {
		let event = $("#event-name").val();
		let params = $("#event-params").val();
		if (!event) {
			alert("Event Name is required!");
			return;
		}
		if (!params) {
			alert("Event Params is required, and must be valid JSON type!");
			return;
		}
		params = JSON.parse(params);
		socket.emit(event, params);
	});
});
