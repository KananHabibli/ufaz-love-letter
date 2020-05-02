const mongoose = require('mongoose')
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
    discardedCards: [Object],
    distinctCards: [Object],
    theWholeDeck: [Object],
    goal: Number
}, {
    timestamps: true
})


const Game = mongoose.model("Game", GameSchema)

module.exports = Game
