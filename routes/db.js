const express = require('express')
const router = express.Router()

const Card = require('../models/Cards')

router.get('/db/cards', (req, res) => {
    Card.find({}).then(cards => {
      res.json(cards)  
    });
})

module.exports = router