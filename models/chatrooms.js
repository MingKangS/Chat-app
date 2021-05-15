const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true
    },
  });

const ChatroomSchema = new Schema({
    room_name: String,
    messages: [MessageSchema],
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ],

});

const Chatroom = mongoose.model('chatroom', ChatroomSchema);
const Message = mongoose.model('message', MessageSchema);
module.exports = {Chatroom, Message};



