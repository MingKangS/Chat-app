const User = require('./models/users');
const {Chatroom, Message} = require('./models/chatrooms');
var usersArray = [];

module.exports = (io) => {
	io.on('connection', async socket => {
		user = await User.findOne({ username: socket.handshake.query.username });
		usersArray.push({"socket": socket, "id": user._id});


		for (var chatroom of user.chatrooms) {
			socket.join(chatroom.toString());
		}

		socket.on('message', ({ sender_name, room_name, message }) => {
			const newMessage = new Message({
				message: message,
				sender: sender_name,
				dateTime: Date.now(),
			});
			Chatroom.findOneAndUpdate({room_name: room_name}, { $push: { messages: newMessage } }, {useFindAndModify: false}, function (err, docs) {
				if (err){
					console.log(err);
				}
				else{
					io.in(docs._id.toString()).emit('message', { sender_name, room_name, message });
				}
			});
				
		})

		socket.on('New chatroom', ({ chatroom_id, participants }) => {
			for (var p of participants) {
				let p_index = usersArray.findIndex(user => user.id == p);
				let p_socket = usersArray[p_index].socket;
				p_socket.join(chatroom_id);
			}
			io.in(chatroom_id.toString()).emit('New chatroom', { room_name });
		})
	});  
}

