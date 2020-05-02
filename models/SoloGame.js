const mongoose = require('mongoose')
const SoloGameSchema = new mongoose.Schema({
    lobbyName: {
        type: String,
        required: true
    },
    lobbyPassword: {
        type: String,
        trim: true,
        minLength: 4
    },
    player: Object,
    discardedCards: [Object],
    distinctCards: [Object],
    theWholeDeck: [Object],
    goal: Number
}, {
    timestamps: true
})


const SoloGame = mongoose.model("SoloGame", SoloGameSchema)

module.exports = SoloGame
