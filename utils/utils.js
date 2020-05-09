const randomNumber = size => {
    return Math.floor(Math.random() * size)
}

const randomCard = (deck, discardedCards) => {
    let rand = randomNumber(deck.length)
    discardedCards.push(deck[rand])
    deck.splice(rand, 1)
    return [
        discardedCards,
        deck
    ]
}

module.exports = {
    randomNumber,
    randomCard
}