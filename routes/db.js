const express = require('express')
const router = express.Router()

const User = require('../models/User')
const Card = require('../models/Cards')

router.get('/db/users', (req, res) => {
  User.find({}).then(users => {
    res.json(users)  
  });
})

router.get('/db/cards', (req, res) => {
    Card.find({}).then(cards => {
      res.json(cards)  
    });
})

module.exports = router