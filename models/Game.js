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
        minLength: 4,
        validate(value){
            if ( validator.contains('password',value)){
                throw new Error('Password can not contain the word password')
            }
        }
    },
    players: [Object],
    currentCards: [Object],
    discardedCards: [Object],
    theWholeDeck: [Object],
    roundsWon: [
        {
            type: Number,
            required: true
        }
    ],
    goal: {
        type: Number,
    }
}, {
    timestamps: true
})


const Game = mongoose.model("Game", GameSchema)

module.exports = Game
