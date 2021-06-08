const express = require('express');
const router = express.Router();
const User = require('../models/users');
const {Chatroom, Message} = require('../models/chatrooms');

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
          res.status(500).send("An error occured");
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
          res.status(500).send("An error occured");
				}
				else{
					console.log("Updated User : ", docs);
				}
			}
		);
	}
	res.status(200).send(room_name);

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