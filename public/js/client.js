var socket = io('/game');

// Elements
const players  = document.getElementById('players')
const drawCard = document.getElementById('drawCard')
const discardCard = document.getElementById('discardCard')
const guard = document.getElementById('guard')
const guessCard = document.getElementById('guessCard').value
// Parsing the query string
const { nickname, room, number } = Qs.parse(location.search, {ignoreQueryPrefix : true})

console.log(number)

socket.emit('new-user', room, nickname, number)


// let playerObject;
let lobbyObject;
socket.on('send-first-message', ( newPlayer, lobby,  status, rooms ) => {
    localStorage.setItem('player',JSON.stringify(newPlayer))
    lobbyObject = lobby
    var tag = document.createElement("p");
    var text = document.createTextNode(`Status : ${status} Player : ${newPlayer.nickname} Lobby : ${lobby.room} `);
    tag.appendChild(text);
    players.appendChild(tag)
    console.log(rooms)
})


// Draw a card
drawCard.addEventListener('click', () => {
    // let player = localStorage.getItem('player')
    socket.emit('drawCard',lobbyObject.room, player, lobbyObject.cards.gameCards)
})

socket.on('drawnCardReady', (player, deck) => {
    playerObject = player
    lobbyObject.cards.gameCards = deck
    console.log("After drawCard: ")
    console.log(playerObject)
    console.log(lobbyObject)
})

// Discard a card

discardCard.addEventListener('click', () => {
    socket.emit('discardCard', lobbyObject.room, playerObject, playerObject.cardsOnHand[0])
})

socket.on('discardedCardReady', player => {
    playerObject = player
    console.log("After discardCard: ")
    console.log(playerObject)
})


// Guard
guard.addEventListener('click', () => {
    console.log(`Your guess is ${guessCard}`)
    socket.emit('guard', room, playerObject, guessCard, lobbyObject.players[1])
})

socket.on('guardReady', (playerAttacking, playerAttacked, result) => {
    playerObject = playerAttacking
    room.players[1] = playerAttacked
    console.log('After guard: ')
    console.log(result)
    console.log(playerAttacking)
    console.log(playerAttacked)
})

socket.on('throwError', error => {
    alert(error)
})

// socket.on('allRooms', rooms => console.log(rooms))

// socket.on('getRoomData', () => {
//     socket.emit('removeUser', room)
// }, () => {
//     alert(`${nickname} disconnected`)
// })




