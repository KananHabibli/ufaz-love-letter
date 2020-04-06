const mongoose = require('mongoose')

const CardSchema = new mongoose.Schema({
    card: {
        type: String,
        required: true
    },
    strength: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const Card = mongoose.model("Cards", CardSchema)

module.exports = Card

// const deck = 
// [
//     {
//         card: "Guard",
//         strength: 1,
//         description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card."
//     },
//     {
//         card: "Guard",
//         strength: 1,
//         description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card."
//     },
//     {
//         card: "Guard",
//         strength: 1,
//         description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card."
//     },
//     {
//         card: "Guard",
//         strength: 1,
//         description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card."
//     },
//     {
//         card: "Guard",
//         strength: 1,
//         description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card."
//     },
//     {
//         card: "Priest",
//         strength: 2,
//         description: "Player is allowed to see another player's hand."
//     },
//     {
//         card: "Priest",
//         strength: 2,
//         description: "Player is allowed to see another player's hand."
//     },
//     {
//         card: "Baron",
//         strength: 3,
//         description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round."
//     },
//     {
//         card: "Baron",
//         strength: 3,
//         description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round."
//     },
//     {
//         card: "Handmaid",
//         strength: 4,
//         description: "Player cannot be affected by any other player's card until the next turn"
//     },
//     {
//         card: "Handmaid",
//         strength: 4,
//         description: "Player cannot be affected by any other player's card until the next turn"
//     },
//     {
//         card: "Prince",
//         strength: 5,
//         description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated"
//     },
//     {
//         card: "Prince",
//         strength: 5,
//         description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated"
//     },
//     {
//         card: "King",
//         strength: 6,
//         description: "Player trades hands with any other player."
//     },
//     {
//         card: "Countess",
//         strength: 7,
//         description: "If a player holds both this card and either the King or Prince card, this card must be played immediately."
//     },
//     {
//         card: "Princess	",
//         strength: 8,
//         description: "If a player plays this card for any reason, they are eliminated from the round."
//     }
// ]

// Card.collection.insertMany(deck, onInsert)

// function onInsert(err, docs){
//     if(err){
//         throw new Error(err)
//     } else {
//         console.log(docs)
//     }
// }