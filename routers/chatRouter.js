const express = require('express');
const router = express.Router();
const socketio = require('socket.io');
const User = require('../models/users');
const server = require('../server');
const {Chatroom, Message} = require('../models/chatrooms');
const io = socketio(server);

// io.on('connection', async socket => {
// 	user = await User.findOne({ username: socket.handshake.query.username });
// 	for (var chatroom of user.chatrooms) {
// 		socket.join(chatroom);
// 	}

// 	socket.on('message', ({ sender_name, room_name, message }) => {
// 		const newMessage = new Message({
// 			message: message,
// 			sender: sender_name,
// 			dateTime: Date.now(),
// 		});
// 		Chatroom.findOneAndUpdate({room_name: room_name}, { $push: { messages: newMessage } },function (err, docs) {
// 			if (err){
// 				console.log(err);
// 			}
// 			else{
// 				console.log("Updated User : ", docs);
// 			}
// 		});
// 		socket.to(room_name).emit('message', { sender_name, room_name, message });
// 	})
// })

router.post('/create-chatroom', async (req, res) => {
	const { room_name, participants} = req.body;
	const newChatroom = new Chatroom({
		room_name,
	});
    
  const savedChatroom = await newChatroom.save();

	for (var username of participants) {
		user = await User.findOne({ username: username });
		var updatedChatroom = Chatroom.findByIdAndUpdate(
			savedChatroom._id,
			{ $push: { participants: user._id } },
			{ new: true, useFindAndModify: false },
			function (err, docs) {
				if (err){
					console.log(err);
				}
				else{
					console.log("Updated User : ", docs);
				}
			}
		);
		const newUser = User.findByIdAndUpdate(
			user._id,
			{ $push: { chatrooms: savedChatroom._id } },
			{ new: true, useFindAndModify: false },
			function (err, docs) {
				if (err){
					console.log(err);
				}
				else{
					console.log("Updated User : ", docs);
				}
			}
		);
	}
	res.send(updatedChatroom);

});

router.get('/chatrooms', async (req, res) => {
	const req_user = await req.user;
	const user = await User.findOne({ username: req_user.username });
	var userChatrooms = {};
	for (var chatroomTd of user.chatrooms) {
		var chatroom = await Chatroom.findOne({ _id: chatroomTd });
		userChatrooms[chatroom.room_name] = chatroom.messages;
	}
	res.send(userChatrooms);
});

router.post('/chatrooms', async (req, res) => {
	const username = req.body.username;
	const user = await User.findOne({ username: username });
	var userChatrooms = [];
	for (var chatroomTd of user.chatrooms) {
		var chatroom = await Chatroom.findOne({ _id: chatroomTd });
		userChatrooms.push({room_name: chatroom.room_name});
	}
	res.send(userChatrooms);
});

router.post('/messages', async (req, res) => {
	const chatroom = await Chatroom.findOne({ room_name: req.body.chatroom }, (err, chatroom) => {
		if (err) {
			res.status(500).send(err);
		} else {
			console.log(1, chatroom);
		}
	});
	res.send(chatroom.messages);
});

module.exports = router;