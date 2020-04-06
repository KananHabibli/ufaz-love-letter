const express = require('express')
const router = express.Router()

const User = require('../models/User')
const Card = require('../models/Cards')

router.get('/db/users', (req, res) => {
  User.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user.username] = user;
    });

    res.json(userMap);  
  });
})

router.get('/db/cards', (req, res) => {
    Card.find({}, function(err, cards) {
      var cardMap = {};
  
      cards.forEach(function(card) {
        cardMap[card.card] = card;
      });
  
      res.json(cardMap);  
    });
})

module.exports = router