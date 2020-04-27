const mongoose = require('mongoose')
const validator = require('validator')
const GameSchema = new mongoose.Schema({
    lobbyName: {
        type: String,
        required: true
    },
    lobbyPassword: {
        type: String,
        trim: true,
        minLength: 4
    },
    players: [Object],
    currentCards: [[Object]],
    discardedCards: [Object],
    theWholeDeck: [Object],
    goal: Number
}, {
    timestamps: true
})


const Game = mongoose.model("Game", GameSchema)

module.exports = Game
