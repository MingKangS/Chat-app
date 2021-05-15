const express = require('express');
const router = express.Router();
const socketio = require('socket.io');
const mongoose = require('mongoose');
const User = require('../models/users');
const server = require('../server');
const {Chatroom, Message} = require('../models/chatrooms');
const io = socketio(server);

io.on('connection', async socket => {
    console.log("-------------------------------------CHATTT")
    user = await User.findOne({ username: socket.handshake.query.username });
    console.log("gud", socket);
    for (var chatroom of user.chatrooms) {
        //var chatroom = await Chatroom.findOne({ _id: chatroomId });
        socket.join(chatroom);
    }

    socket.on('message', ({ sender_name, room_name, message }) => {
        console.log("Socket message", sender_name, room_name, message)
        const newMessage = new Message({
            message: message,
            sender: sender_name,
            dateTime: Date.now(),
        });
        Chatroom.findOneAndUpdate({room_name: room_name}, { $push: { messages: newMessage } },function (err, docs) {
             if (err){
                console.log(err)
            }
            else{
                console.log("Updated User : ", docs);
            }
        });
        socket.to(room_name).emit('message', { sender_name, room_name, message })
    })
})

router.post('/create-chatroom', async (req, res) => {
    const { room_name, participants} = req.body
    console.log("CCR", room_name, participants)
    const newChatroom = new Chatroom({
        room_name,
    });
    
    const savedChatroom = await newChatroom.save();
    console.log(savedChatroom)

    for (var username of participants) {
        user = await User.findOne({ username: username });
        console.log(user)
        var updatedChatroom = Chatroom.findByIdAndUpdate(
            savedChatroom._id,
            { $push: { participants: user._id } },
            { new: true, useFindAndModify: false },
            function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    console.log("Updated User : ", docs);
                }
            }
        );
        console.log(updatedChatroom)
        var newUser = User.findByIdAndUpdate(
            user._id,
            { $push: { chatrooms: savedChatroom._id } },
            { new: true, useFindAndModify: false },
            function (err, docs) {
                if (err){
                    console.log(err)
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
    const req_user = await req.user
    const user = await User.findOne({ username: req_user.username });
    var userChatrooms = {}
    for (var chatroomTd of user.chatrooms) {
        var chatroom = await Chatroom.findOne({ _id: chatroomTd });
        userChatrooms[chatroom.room_name] = chatroom.messages
    }
    console.log(userChatrooms)
    res.send(userChatrooms);
});

router.post('/chatrooms', async (req, res) => {
    const username = req.body.username
    console.log(username)
    const user = await User.findOne({ username: username });
    var userChatrooms = []
    for (var chatroomTd of user.chatrooms) {
        var chatroom = await Chatroom.findOne({ _id: chatroomTd });
        userChatrooms.push({room_name: chatroom.room_name})
    }
    console.log(userChatrooms)
    res.send(userChatrooms);
});

router.post('/messages', async (req, res) => {
    console.log("get messages", req.body.chatroom)
    const chatroom = await Chatroom.findOne({ room_name: req.body.chatroom }, (err, chatroom) => {
        if (err) {
            res.status(500).send(err)
        } else {
            console.log(1, chatroom);
        }
    });
    console.log(2, chatroom)
    res.send(chatroom.messages);
});

router.get('/sign-up', (req, res) => {
    res.render('signUp');
});

module.exports = router;