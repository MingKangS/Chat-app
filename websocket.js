const mongoose = require('mongoose');
const User = require('./models/users');

module.exports = (io) => {
    io.on('connection', async socket => {
       console.log('app.js connection');
       user = await User.findOne({ username: socket.handshake.query.username });
        for (var chatroom of user.chatrooms) {
            //var chatroom = await Chatroom.findOne({ _id: chatroomId });
            socket.join(chatroom);
        }

        socket.on('message', ({ name, message }) => {
            io.emit('message', { name, message })
        })
    });  
 }

