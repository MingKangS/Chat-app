const express = require('express');
const router = express.Router();
const socketio = require('socket.io');
const mongoose = require('mongoose');
const User = require('../models/users');
const server = require('../server');
const Chatroom = require('../models/chatrooms');
const io = socketio(server);

io.on('connection', async socket => {
    console.log("-------------------------------------CHATTT")
    user = await User.findOne({ username: socket.handshake.query.username });
    console.log("gud", socket);
    for (var chatroom of user.chatrooms) {
        //var chatroom = await Chatroom.findOne({ _id: chatroomId });
        socket.join(chatroom);
    }

    socket.on('message', ({ name, message }) => {
        io.emit('message', { name, message })
    })
})

router.post('/create-chatroom', async (req, res) => {
    const { room_name, participants} = req.body
    const newChatroom = new Chatroom({
        room_name,
    });
  
    const savedChatroom = await newChatroom.save();
    console.log(savedChatroom)

    for (var username of participnts) {
        user = await User.findOne({ username: username });
        var updatedChatroom = Chatroom.findByIdAndUpdate(
            savedChatroom._id,
            { $push: { participants: user._id } },
            { new: true, useFindAndModify: false }
        );

        var newUser = User.findByIdAndUpdate(
            user._id,
            { $push: { chatrooms: newChatroom._id } },
            { new: true, useFindAndModify: false }
        );
    }
    res.send(updatedChatroom);

});

router.get('/chatrooms', async (req, res) => {
    const req_user = await req.user
    const user = await User.findOne({ username: req_user.username });
    var userChatrooms = []
    for (var chatroomTd of user.chatrooms) {
        var chatroom = await Chatroom.findOne({ _id: chatroomTd });
        userChatrooms.push(chatroom.room_name)
    }
    res.send(userChatrooms);
});

router.get('/sign-up', (req, res) => {
    res.render('signUp');
});

module.exports = router;