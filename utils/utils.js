const randomNumber = size => {
    return Math.floor(Math.random() * size)
}

const shuffleCards = deck => {
    var size = deck.length, temp, index;

    // While there are elements in the array
    for(let i = size - 1; i >= 0; i--) {
        // Pick a random index
        index = randomNumber(i);
        // And swap the last element with it
        temp = deck[i];
        deck[i] = deck[index];
        deck[index] = temp;
    }
    return deck;
}

const findCard = (cards, cardName) => {
    return cards.findIndex(currentCard => currentCard.card === cardName)
}

const discardCard = (player, card) => {
    player.cardsDiscarded.push(card)
    player.cardsOnHand.splice(findCard(player.cardsOnHand, card.card), 1)
    return player
}

module.exports = {
    randomNumber,
    shuffleCards,
    discardCard,
    findCard
}