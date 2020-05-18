
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

const findOwner = players => players.find(player => player.isOwner == true)

const findCredentials = (rooms, room, id) => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, id)
    let playerIndex = findPlayerIndex(player.nickname, lobby.players)
    return {
        lobby,
        player,
        playerIndex
    }
}


const discardCard = (player, card) => {
    player.cardsDiscarded.push(card)
    player.cardsOnHand.splice(findCardIndex(player.cardsOnHand, card.card), 1)
    return player
}



const nextPlayer = (players, currentPlayer) => {
    let size = players.length - 1
    let currentIndex = findPlayerIndex(currentPlayer.nickname, players)
    let index = currentIndex + 1
    while(size > 0){
        if(players[index].isOutOfRound === false){
            players[index].hisTurn = true
            return {
                nextIndex: index,
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

const roundWinner = lobby => {
    let playersInRound = lobby.players.filter(player => player.isOutOfRound === false)
    playersInRound.sort((a, b) => b.cardsOnHand[0].strength - a.cardsOnHand[0].strength)
    let winnerIndex = findPlayerIndex(playersInRound[0].nickname, lobby.players)
    let previousOwner = findOwner(lobby.players)
    let previousOwnerIndex = findPlayerIndex(previousOwner.nickname, lobby.players)
    lobby.players[winnerIndex].roundsWon++
    lobby.players[winnerIndex].isOwner = true
    lobby.players[previousOwnerIndex].isOwner = false
    return {
        lobby,
        winner: lobby.players[winnerIndex]
    }
}

// lobbyCondition, event, toWho
const checkCondition = (lobby, nextIndex, result, id, opponentID, event) => {
    let direction
    if(event === "priest") {
        direction = id
    } else if(event === "king"){
        direction = []
        direction[0] = id
        direction[1] = opponentID
    } else {
        direction = lobby.room
    }
    if(result == "Round is on"){
        lobby.players[nextIndex].hisTurn = true
        return {
            lobbyCondition: lobby,
            event: `${event}Ready`,
            toWho: direction
        }
    } else{
        let previousOwner = findOwner(lobby.players)
        let previousOwnerIndex = findPlayerIndex(previousOwner.nickname, lobby.players)
        lobby.players[nextIndex].roundsWon++
        lobby.players[nextIndex].isOwner = true
        lobby.players[previousOwnerIndex].isOwner = false
        if(lobby.players[nextIndex].roundsWon == lobby.goal){
            return {
                lobbyCondition: lobby,
                event: `gameOver`,
                toWho: lobby.room
            }
        } else {
            return {
                lobbyCondition: lobby,
                event: `roundOver`,
                toWho: lobby.room
            }
        }
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
    findCredentials,
    findOwner,
    nextPlayer,
    roundWinner,
    checkCondition
}