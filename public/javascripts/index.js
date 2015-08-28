$(document).ready(function() {
	/* Get user name from Dialog */
	function adduser() {
		var name = $('#name_input').val();
		if (name == '') {
			$('#name_input').addClass('tooltipped').attr('data-position', 'bottom')
				.attr('data-tooltip', 'Name cannot be empty')
				.tooltip({ delay: 50 });
			$('#name_input').focus().mouseover();
			setTimeout(function() {
				$('#name_input').removeClass('tooltipped').removeAttr('data-delay')
					.removeAttr('data-position').removeAttr('data-tooltip');
				$('.material-tooltip').remove();
			}, 3000);
			return;
		}
		$('#name').val(name);
		$('#name_input').val('');
		$('#modal_name').closeModal();
		$('#m').focus();
	}

	$("#name_submit").click(adduser);
	$('#modal_name').find('form').on("submit", function(event) {
		event.preventDefault();
		adduser();
	});
	$('#modal_name').openModal({ dismissible: false });
	$('#name_input').focus();

	/* RealTime Communication */
	function outputMsg(msgObj, isMe){
		if (isMe === true)
			msgObj.name = "Me";

		var localTime = new Date(msgObj.timestamp);
		var msgList = $('#messages');
		var msgHeader = $('<h5></h5>').text(msgObj.name).append($('<small></small>')
			.addClass('right').text(localTime.toLocaleString()));
		var msgText = $('<p></p>').text(msgObj.msg);
		var msgPlain = msgText.text();
		msgText.html(msgPlain.replace(/\n/g, '<br>'));
		var msgItem = $('<div>').append(msgHeader).append(msgText);
		if (isMe === true)
			msgItem.addClass('me');
		msgList.append($('<li>').addClass('col').addClass('s12').append(msgItem));
		$('html, body').scrollTop(msgList.height());
	}
	var socket = io();
	$('form.msg_input').submit(function() {
		var msgText = $('#m').val();
		if (msgText == '') return false;
		var msgObj = { msg: msgText, name: $('#name').val(), timestamp: Date.now() };
		socket.emit('chat message', msgObj);
		outputMsg(msgObj, true);
		$('#m').val('');
		return false;
	});
	socket.on('chat message', function(msgObj) {
		outputMsg(msgObj);
	});
	// Get previous messages
	$.get('/items', function(data, textStatus, jqXHR) {
		if (textStatus == 'success') {
			data.forEach(function(item, idx, arr) {
				outputMsg(item);
			});
		}
		else {
			console.log(textStatus);
		}
	});
});
