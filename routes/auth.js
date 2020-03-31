const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User')

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
    res.redirect('/profile')
})

router.get('/auth/verify', (req, res) => {
  if(req.user){
    console.log(req.user)
    res.json()
  }else{
    console.log('not auth')
  }
})
router.get('/auth/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/fail"
  })
);

router.get("/fail", (req, res) => {
  res.send("Failed attempt");
});

router.get('/auth/signup', (req, res) => {
  res.render('index/signup');
})

router.post('/auth/signup', (req, res, next) => {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }
  if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      image: "/public/Images/profile.jpeg",
      bio: "",
      gamesWon: 0,
      gamesLost: 0
    })
    newUser.save().then(user => {
      console.log("User saved")
      res.json(user)
    }).catch(err => {
      res.status(400).json({message: `unable to save to database: ${err}`});
    });
  }  else {
    res.json({message: "Problem occured!"})
  }
})


router.get('/auth/login', (req, res) => {
  res.render('index/login')
})

router.post('/auth/login', (req, res) => {
  if(req.body.email && req.body.password){
    console.log(req.body)
    User.find({email: req.body.email}).then(user => {
      res.json(user)
    }).catch(err => {
      res.json({message: `Error: ${err}`})
    })
  } else {
    res.json({message: "Problem occured!"})
  }
})

router.get('/auth/users', (req, res) => {
  User.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.json(userMap);  
  });
})

router.post('/auth/login', (req, res) => {

})


// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

module.exports = router