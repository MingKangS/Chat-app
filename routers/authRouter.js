if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const bcrypt =require('bcryptjs');
const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const router = require("express").Router();
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('../passport-config')
initializePassport(
  passport,
  async email => {
    console.log(email)
    await User.findOne({ email: email })
  },
  async _id => await User.findOne({ _id: _id })
)

const { JWT_SECRET } = config;

router.get('/', checkAuthenticated ,(req, res) => {
    res.redirect('/auth/log-in');
});

router.get('/log-in', checkNotAuthenticated, (req, res) => {
    res.render('logIn');
});

router.post("/log-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.status(200).send("Successfully Authenticated");
        console.log("_______",req.user);
      });
    }
  })(req, res, next);
});

/*async (req, res) => {
    
    console.log(req.isAuthenticated())
    const { email, password } = req.body;
    console.log(req.body)
    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
  
    try {
        // Check for existing user
        const user = await User.findOne({ email });
        if (!user) throw Error('User does not exist');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid credentials');
        console.log(user._id, JWT_SECRET)
        const token = jwt.sign({ id: user._id }, "JWT_SECRET", { expiresIn: 3600 });
        if (!token) throw Error('Couldnt sign the token');

        res.status(200).json({
            token,
            user: {
            id: user._id,
            name: user.username,
            email: user.email
            }
        });
        console.log(3)
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ msg: e.message });
    }
  });*/

router.get('/sign-up', (req, res) => {
    console.log(123)
    res.render('signUp');
});

router.post('/sign-up', async (req, res) => {
    const { username, email, password } = req.body;

    // Simple validation
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
  
      const savedUser = await newUser.save();
      if (!savedUser) throw Error('Something went wrong saving the user');
  
      const token = jwt.sign({ id: savedUser._id }, "JWT_SECRET", {
        expiresIn: 3600
      });
  
      res.status(200).json({
        token,
        user: {
          id: savedUser.id,
          username: savedUser.username,
          email: savedUser.email
        }
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

router.get("/user", async (req, res) => {
  const u = await req.user
  res.send(u); // The req.user stores the entire user that has been authenticated inside of it.
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/sign-up')
  }
  next()
}

module.exports = router;