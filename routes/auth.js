const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const sendEmail = require('../mails/mail')


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
    res.redirect('/')
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
    req.session.destroy();
    res.redirect('/');
})

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback", passport.authenticate("facebook", {
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
    return res.json({message: "Passwords don't match"});
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
      sendEmail(user)
      res.json(user)
    }).catch(err => {
      res.json({message: "This user already exists."});
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
    User.findOne({email: req.body.email}).exec((err, user) => {
      if(err){
        return res.json({message: `An error has occured`})
      } else if(!user){
        return res.json({message: "This user doesn't exist"})
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(result){
          req.session.user = user
          res.json(user)
        } else {
          res.json({message: "Password isn't correct"})
        }
      })
    })
  } else {
    res.json({message: "Problem occured!"})
  }
})

module.exports = router