const express = require('express')
const router = express.Router()
const app = express()
const bcrypt = require('bcrypt')

// socket.io
const socketio = require('socket.io')
const server = require('http').createServer(app)
const io = socketio(server)

const { randomNumber } = require('../utils/utils')

const Cards = require('../models/Cards')
const Game = require('../models/Game')
const User  = require('../models/User')
router.get('/createLobby', (req, res) => {
    res.render('index/form')
})

router.post('/createLobby', (req, res) => {
    if(!req.body.lobbyName || !req.body.number){
        res.json({message: "You haven't entered lobby name"})
    }

    let number = req.body.number

    Cards.find({}).then(deck => {
        let cards = []
        let discardedCards= []
        let goal
        if(number == 4){
            goal = 4
        }else if(number == 3){
            goal = 5
        }else if(number == 2){
            goal = 7
            for(let i = 0; i < 3; i++){
                let rand = randomNumber(deck.length)
                discardedCards.push(deck[rand])
                deck.splice(rand, 1)
            }
        }
        while(cards.length != number){
            rand = randomNumber(deck.length)
            console.log(rand)
            cards.push(deck[rand])
            deck.splice(rand, 1);
        }
        let newGame = new Game({
            lobbyName: req.body.lobbyName,
            lobbyPassword: req.body.lobbyPassword,
            players:[],
            currentCards: cards,
            discardedCards,
            theWholeDeck: deck,
            roundsWon: [0,0,0,0],
            goal
        })

        newGame.save().then(game => {
            res.json(game)
        }).catch(e => {
            res.json({
                message: "There has been an error while creating the game lobby!!"
            })
        })
    }).catch(e => {
        res.json({
            message: "The deck can't be fetched!!" + e
        })
    })


    // res.json({
    //     username: req.body.username,
    //     room: req.body.room,
    //     number: req.body.number
    // })
})


module.exports = router