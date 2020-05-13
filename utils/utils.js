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

const findCardIndex = (cards, cardName) => {
    return cards.findIndex(currentCard => currentCard.card === cardName)
}

const findCard = (cards, cardName) => {
    return cards.find(card => card.card === cardName)
}

const findPlayerIndex = (nickname, players) => {
    return players.findIndex(player => player.nickname === nickname)
}

const findPlayerByID = (lobby, id) => {
    return lobby.players.find(player => player.id === id)
}

const findPlayerByName = (lobby, nickname) => {
    return lobby.players.find(player => player.nickname === nickname)
}

const findLobby = (rooms, room) => {
    return rooms.find(roomValue => roomValue.room == room)
}

const discardCard = (player, card) => {
    player.cardsDiscarded.push(card)
    player.cardsOnHand.splice(findCardIndex(player.cardsOnHand, card.card), 1)
    return player
}

module.exports = {
    randomNumber,
    shuffleCards,
    discardCard,
    findCardIndex,
    findPlayerIndex,
    findPlayerByID,
    findPlayerByName,
    findLobby,
    findCard
}