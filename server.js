const express = require("express");
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/users');
const http = require('http');
const socketio = require('socket.io');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


var app = express(); 
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
require('./websocket')(io)

//const io = socketio(server);
const PORT = process.env.PORT || 5000;
var cors = require('cors')

app.use(cors()) // Use this after the variable declaration



// io.on('connection', async socket => {
//     console.log("-------------------------------------CHATTT",socket.handshake)

//     user = await User.findOne({ username: socket.handshake.query.username });
//     for (var chatroom of user.chatrooms) {
//         //var chatroom = await Chatroom.findOne({ _id: chatroomId });
//         socket.join(chatroom);
//     }

//     socket.on('message', ({ name, message }) => {
//         io.emit('message', { name, message })
//     })
// })

const dbURI = "mongodb+srv://mingkang:1234@cluster0.oydwh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(result => server.listen(PORT, () => console.log(`Server started on port: ${PORT}`)))
    .catch(err => console.log(err));

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  async email => await User.findOne({ email }),
  async _id => await User.findOne({ _id })
)


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.use(session({
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    console.log(0)
    res.redirect('/welcome');
});

app.get('/welcome', (req, res) => {
    res.render("welcome");
});

app.use("/auth", require("./routers/authRouter"));
app.use("/chat", require("./routers/chatRouter"));


