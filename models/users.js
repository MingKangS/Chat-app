const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  chatrooms: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chatroom"
    }
  ],
});

const Users = mongoose.model('users', UserSchema);
module.exports = Users;