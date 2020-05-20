
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

const checkDiscard = card => {
    if(card.card === "Princess"){
        return true
    }
    return false
}


const nextPlayer = (lobby, currentPlayer) => {
    let size = lobby.players.length - 1
    let currentIndex = findPlayerIndex(currentPlayer.nickname, lobby.players)
    let index = currentIndex + 1
    if(index == lobby.players.length){
        index = 0
    }
    console.log(`Next Player Index: ${index}`)
    if(lobby.numberOfPlayersInRound == 1){
        let remainingPlayer = lobby.players.find(player => player.isOutOfRound == false)
        let remainingPlayerIndex = findPlayerIndex(remainingPlayer.nickname, lobby.players)
        return {
            nextLobby: lobby,
            nextIndex: remainingPlayerIndex,
            result: "Round over"
        }
    }
    while(size > 0){
        console.log('lmao')
        if(lobby.players[index].isOutOfRound == false){
            if(lobby.cards.gameCards.length == 0){
                let {lobby: nextLobby, winner} = roundWinner(lobby)
                return {
                    nextLobby,
                    nextIndex: findPlayerIndex(winner.nickname, nextLobby.players),
                    result: "Round over"
                }
            } else {
                lobby.players[index].hisTurn = true
                lobby.players[index].cardsOnHand.push(lobby.cards.gameCards[0])
                lobby.cards.gameCards.splice(0, 1)
                return {
                    nextLobby: lobby,
                    nextIndex: index,
                    result: "Round is on"
                }
            }
        } else {
            size--
            index++
            if(index == lobby.players.length){
                index = 0
            }
        }
    }
}

const roundWinner = lobby => {
    let playersInRound = lobby.players.filter(player => player.isOutOfRound === false)
    playersInRound.sort((a, b) => b.cardsOnHand[0].strength - a.cardsOnHand[0].strength)
    let winnerIndex = findPlayerIndex(playersInRound[0].nickname, lobby.players)
    let previousOwner = findOwner(lobby.players)
    let previousOwnerIndex = findPlayerIndex(previousOwner.nickname, lobby.players)
    lobby.players[previousOwnerIndex].isOwner = false
    lobby.players[winnerIndex].roundsWon++
    lobby.players[winnerIndex].isOwner = true
    return {
        lobby,
        winner: lobby.players[winnerIndex]
    }
}

// lobbyCondition, event, toWho
const checkCondition = (lobby, nextIndex, result, event) => {
    if(result == "Round is on"){
        lobby.players[nextIndex].hisTurn = true
        return {
            lobbyCondition: lobby,
            event: `${event}Ready`
        }
    } else{
        let previousOwner = findOwner(lobby.players)
        let previousOwnerIndex = findPlayerIndex(previousOwner.nickname, lobby.players)
        lobby.players[previousOwnerIndex].isOwner = false
        lobby.players[nextIndex].roundsWon = lobby.players[nextIndex].roundsWon + 1
        console.log(`roundsWon: ${lobby.players[nextIndex].roundsWon}`)
        console.log(`goal: ${lobby.goal}`)
        lobby.players[nextIndex].isOwner = true
        lobby.players.forEach(player => {
            if(player.isOutOfRound == false){
                player = discardCard(player, player.cardsOnHand[0])
            }
        })
        if(lobby.players[nextIndex].roundsWon == lobby.goal){
            return {
                lobbyCondition: lobby,
                event: `gameOver`
            }
        } else {
            return {
                lobbyCondition: lobby,
                event: `roundOver`
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
    checkCondition,
    checkDiscard
}