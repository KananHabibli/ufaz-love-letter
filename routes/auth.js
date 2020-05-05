const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const sharp = require('sharp')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const config = require('config');
const fs = require('fs');


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

const upload = multer({
  dest: 'avatars',
  limits: {
      fileSize: 1000000
  },
  fileFilter(req, file, callback){
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
          return callback(new Error('Please upload  jpg, jpeg, png format'))
      }
      callback(undefined, true)
  }
})

router.post('/auth/signup', upload.single('photo'), async (req, res, next) => {
  if (req.body.password !== req.body.passwordConf) {
    return res.json({message: "Passwords don't match"});
  }
  console.log(req.file)
  if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
    const image = await sharp(req.file.path).resize({width:250, height: 250}).png().toBuffer();
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      image,
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
          const payload = {
            user
          }
          jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        } else {
          res.json({message: "Password isn't correct"})
        }
      })
    })
  } else {
    res.json({message: "Problem occured!"})
  }
})

router.get('/profile/update', (req, res) => {
  res.render('index/editProfile')
})

module.exports = router