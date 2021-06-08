if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const bcrypt =require('bcryptjs');
const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const router = require("express").Router();
const passport = require('passport');

const initializePassport = require('../passport-config');
initializePassport(
  passport,
  async email => {
    await User.findOne({ email: email });
  },
  async _id => await User.findOne({ _id: _id })
)

const { JWT_SECRET } = config;

router.post("/log-in", (req, res, next) => {
  try {
    passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) {
      console.log(user);
      res.status(401).send("No User Exists");
    }
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.status(200).send(req.user.username);
      });
    }
  })(req, res, next);
  } catch (err) {
    console.log(err)
  };
  
});

router.post('/sign-up', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (user) throw Error('User already exists');
  
      const salt = await bcrypt.genSalt(10);
      if (!salt) throw Error('Something went wrong with bcrypt');
  
      const hash = await bcrypt.hash(password, salt);
      if (!hash) throw Error('Something went wrong hashing the password');
  
      const newUser = new User({
        username,
        email,
        password: hash
      });
  
      const savedUser = await newUser.save(function(err, doc) {
        if (err) return console.error(err);
        console.log("Document inserted succussfully!");
        res.status(200).json({
          token: ""
        });
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

router.get("/user", async (req, res) => {
  const u = await req.user;
  res.send(u);
});

router.get('/logout', function(req, res){
  req.logout();
  res.status(200);
  res.send("Logged out");
});

module.exports = router;