import TextField from "@material-ui/core/TextField";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from 'axios';
import SendIcon from '@material-ui/icons/Send';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import '../../styles/conversation.css';

function Conversation(props) {
	const [ chat, setChat ] = useState([]);
	const [ message, setMessage ] = useState("");

	const socketRef = useRef();

	const leaguesRef = React.useRef(chat);

	React.useEffect(() => {
		leaguesRef.current = chat;
	});

	useEffect(
		
		() => {
			axios.post('/chat/messages', {chatroom: props.chatroom})
				.then(res => { 
					setChat(res.data);
					updateScroll()
				});
			setMessage("");
			socketRef.current = io.connect("/", { query: { username: props.username } });
			socketRef.current.on("message", ({ sender_name, room_name, message }) => {
				if ( room_name == props.chatroom) {
					setChat([ ...leaguesRef.current, { sender: sender_name, room_name, message } ]);
					updateScroll()
				}
			})

      var modal = document.getElementById("logoutModal");
      var span = document.getElementById("closeLogoutModal");
      // When the user clicks on <span> (x), close the modal

      span.onclick = function() {
        modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
			return () => socketRef.current.disconnect();
		},
		[ props.chatroom ]
	)

	const updateScroll = () => {
    var element = document.getElementById("chat-container");
    element.scrollTop = element.scrollHeight;
}

	const onTextChange = (e) => {
		setMessage(e.target.value);
	}

	const onMessageSubmit = (e) => {
		const sender_name = props.username;
		const room_name = props.chatroom;
		socketRef.current.emit("message", { sender_name, room_name, message });
		e.preventDefault();
		setMessage("");
	}

  const toggleLogoutModalVisibility = (e) => {
    var modal = document.getElementById("logoutModal");
    modal.style.display = "block";
  }

  const logout = (e) => {
    axios.get('/auth/logout')
      .then(res => { 
        window.location = '/';
      });
  }

	const renderChat = () => {
		if (!chat) return;
		return chat.map(({ sender, message }, index) => (
			<div key={index} className={sender==props.username ? "chat sent-chat" : "chat received-chat"}>
				<p className={sender==props.username ? "message sent-chat-message" : "message received-chat-message"}>
					{!(sender==props.username) && sender + ": "}{message}
				</p>
			</div>
		))
	}

	return (
		<div id="conversation-container">
      <div id="logoutModal" className="modal">
        <div class="modal-content">
          <span id="closeLogoutModal" className="close">&times;</span>
          <p>Are you sure you want to log out?</p>
          <button id="confirmLogoutButton" className="btn btn-primary" onClick={logout}>Log out</button>
        </div>
      </div>
			<div id="conversationHeader">
				<h1 id="chatroomName">{props.chatroom}</h1>
        <div id="logoutContainer">
          <ExitToAppIcon id="logoutIcon" onClick={toggleLogoutModalVisibility}/>
        </div>
        
			</div>
			<div id="chat-container">
				{ chat && renderChat()}
			</div>
			<form className="message-form" onSubmit={onMessageSubmit}>
				<span id="input-container">
					<input
						name="message"
						onChange={(e) => onTextChange(e)}
						value={message}
						id="message-input"
						label="Message"
						autocomplete="off"
					/>
				</span>
				<SendIcon id="sendIcon" onClick={onMessageSubmit}/>
			</form>
			
		</div>
	)
}

export default Conversation;

