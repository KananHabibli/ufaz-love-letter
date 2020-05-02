const express = require('express')
const router = express.Router()

const { randomNumber } = require('../utils/utils')
const { ensureAuth } = require('../helpers/auth')


const Cards = require('../models/Cards')
const Game = require('../models/Game')
const SoloGame = require('../models/SoloGame')

router.get('/createLobby', (req, res) => {
    res.render('index/createLobby')
})


router.get('/solo/createLobby', (req, res) => {
    res.render('index/createSoloLobby')
})

router.post('/solo/createLobby', ensureAuth, (req, res) => {
    if(!req.body.lobbyName || !req.body.number){
        res.json({message: "You haven't entered lobby name"})
    }

    let number = req.body.number

    Cards.find({}).then(deck => {
        let mymap = new Map();
        let distinctCards = deck.filter(el => { 
            const val = mymap.get(el.strength); 
            if(val) { 
                if(el.id < val) { 
                    mymap.delete(el.strength); 
                    mymap.set(el.strength, el.id); 
                    return true; 
                } else { 
                    return false; 
                } 
            } 
            mymap.set(el.strength, el.id); 
            return true; 
        }); 
        let discardedCards = []
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
        let newSoloGame = new SoloGame({
            lobbyName: req.body.lobbyName,
            lobbyPassword: req.body.lobbyPassword,
            players:[{
                ...req.session,
                turn: true,
                outOfRound: false,
                roundsWon: 0,
                currentCards: [],
                discardedCards: []}],
            distinctCards,
            discardedCards,
            theWholeDeck: deck,
            goal
        })

        newSoloGame.save().then(game => {
            res.json(game)
            // res.redirect(`/lobby/${game.id}`)
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


// router.post('/createLobby', ensureAuth, (req, res) => {
//     if(!req.body.lobbyName || !req.body.number){
//         res.json({message: "You haven't entered lobby name"})
//     }

//     let number = req.body.number

//     Cards.find({}).then(deck => {
//         let cards = []
//         let current = []
//         let discardedCards= []
//         let goal
//         if(number == 4){
//             goal = 4
//         }else if(number == 3){
//             goal = 5
//         }else if(number == 2){
//             goal = 7
//             for(let i = 0; i < 3; i++){
//                 let rand = randomNumber(deck.length)
//                 discardedCards.push(deck[rand])
//                 deck.splice(rand, 1)
//             }
//         }
//         while(cards.length != number){
//             rand = randomNumber(deck.length)
//             console.log(rand)
//             current.push(deck[rand])
//             cards.push(current)
//             deck.splice(rand, 1);
//             current = []
//         }
//         let newGame = new Game({
//             lobbyName: req.body.lobbyName,
//             lobbyPassword: req.body.lobbyPassword,
//             players:[{...req.session, turn: true, outOfRound: false, roundsWon: 0}],
//             currentCards: cards,
//             discardedCards,
//             theWholeDeck: deck,
//             goal
//         })

//         newGame.save().then(game => {
//             res.json(game)
//             // res.redirect(`/lobby/${game.id}`)
//         }).catch(e => {
//             res.json({
//                 message: "There has been an error while creating the game lobby!!" + e
//             })
//         })
//     }).catch(e => {
//         res.json({
//             message: "The deck can't be fetched!!" + e
//         })
//     })
// })

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
            // res.redirect(`/lobby/${game.id}`)
            res.json(game)
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

// router.get("/lobby/:id", (req, res) => {
//     res.render('index/lobby')
// })

// router.get("/lobby/game/:id", (req, res) => {
//     Game.findOne({_id: req.params.id}).then(game => {
//         res.json(game)
//     }).catch(e => {
//         res.json({
//             message: "This lobby doesn't exist"
//         })
//     })
// })


module.exports = router