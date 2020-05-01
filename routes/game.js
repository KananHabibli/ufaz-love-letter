const express = require('express')
const router = express.Router()
const app = express()
const bcrypt = require('bcrypt')

// socket.io
const socketio = require('socket.io')
const server = require('http').createServer(app)
const io = socketio(server)

const { randomNumber } = require('../utils/utils')
const { ensureAuth } = require('../helpers/auth')


const Cards = require('../models/Cards')
const Game = require('../models/Game')

router.get('/createLobby', (req, res) => {
    res.render('index/createLobby')
})

router.post('/createLobby', ensureAuth, (req, res) => {
    if(!req.body.lobbyName || !req.body.number){
        res.json({message: "You haven't entered lobby name"})
    }

    let number = req.body.number

    Cards.find({}).then(deck => {
        let cards = []
        let current = []
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
            current.push(deck[rand])
            cards.push(current)
            deck.splice(rand, 1);
            current = []
        }
        let newGame = new Game({
            lobbyName: req.body.lobbyName,
            lobbyPassword: req.body.lobbyPassword,
            players:[{...req.session, turn: true, outOfRound: false, roundsWon: 0}],
            currentCards: cards,
            discardedCards,
            theWholeDeck: deck,
            goal
        })

        newGame.save().then(game => {
            res.json(game)
        }).catch(e => {
            res.json({
                message: "There has been an error while creating the game lobby!!" + e
            })
        })
    }).catch(e => {
        res.json({
            message: "The deck can't be fetched!!" + e
        })
    })
})

router.get('/joinLobby', (req, res) => {
    res.render('index/joinLobby')
})

router.post('/joinLobby', async (req, res) => {
    if(req.body.lobbyName){
        const lobbyName = req.body.lobbyName
        const lobbyPassword = req.body.lobbyPassword
        let game = await Game.findOne({lobbyPassword, lobbyName})
        game.players.push({...req.session, turn: true, outOfRound: false, roundsWon: 0})
        game.save().then(game => {
            return res.json({game})
        }).catch(e => {
            return res.json({
                message: "There has been a problem while joining the lobby"
            })
        })
    } else {
        res.json({
            message: "Please enter a lobby name"
        })
    }
})


module.exports = router