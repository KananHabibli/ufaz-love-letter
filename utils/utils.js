
const randomNumber = size => Math.floor(Math.random() * size)

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

const findCardIndex    = (cards, cardName) => cards.findIndex(currentCard => currentCard.card === cardName)

const findCard         = (cards, cardName) => cards.find(card => card.card === cardName)

const findPlayerIndex  = (nickname, players) => players.findIndex(player => player.nickname === nickname)

const findPlayerByID   = (lobby, id) => lobby.players.find(player => player.id === id)

const findPlayerByName = (lobby, nickname) => lobby.players.find(player => player.nickname === nickname)

const findLobby        = (rooms, room) => rooms.find(roomValue => roomValue.room == room)

const discardCard = (player, card) => {
    player.cardsDiscarded.push(card)
    player.cardsOnHand.splice(findCardIndex(player.cardsOnHand, card.card), 1)
    return player
}

const nextPlayer = (players, currentPlayer) => {
    let size = players.length - 1
    let currentIndex = findPlayerIndex(currentPlayer.nickname, players)
    let index = currentIndex
    while(size > 0){
        if(players[index + 1].isOutOfRound === false){
            players[index + 1].hisTurn = true
            return {
                nextIndex: index+1,
                result: "Round is on"
            }
        } else {
            size--
            index++
            if(index == players.length){
                index = 0
            }
        }
    }
    return {
        nextIndex: currentIndex,
        result: "Round over"
    }
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
    findCard,
    nextPlayer
}