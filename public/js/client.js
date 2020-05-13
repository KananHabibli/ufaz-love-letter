var socket = io('/game');

// Elements
const players  = document.getElementById('players')
const drawCard = document.getElementById('drawCard')
const discardCard = document.getElementById('discardCard')
const guard = document.getElementById('guard')
const priest = document.getElementById('priest')
const baron = document.getElementById('baron')
const handmaid = document.getElementById('handmaid')
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
    socket.emit('drawCard',room, lobbyObject)
})

socket.on('drawnCardReady', (player, lobby) => {
    lobbyObject = lobby
    console.log("After drawCard: ")
    console.log(player)
    console.log(lobby)
})

// Discard a card

discardCard.addEventListener('click', () => {
    socket.emit('discardCard', lobbyObject.room)
})

socket.on('discardedCardReady', player => {
    playerObject = player
    console.log("After discardCard: ")
    console.log(playerObject)
})


// Guard
guard.addEventListener('click', () => {
    const guessCard = document.getElementById('guessCard').value
    console.log(`Your guess is ${guessCard}`)
    socket.emit('guard', room, lobbyObject.players[0] , guessCard, lobbyObject.players[1])
})

socket.on('guardReady', (playerAttacking, playerAttacked, result) => {
    // playerObject = playerAttacking
    // room.players[1] = playerAttacked
    console.log('After guard: ')
    alert(result)
    console.log(playerAttacking)
    console.log(playerAttacked)
})

// Priest
priest.addEventListener('click', () => {
    socket.emit('priest', lobbyObject.players[1])
})

socket.on('priestReady', card => {
    alert(card.card)
})

// Baron
baron.addEventListener('click', () => {
    socket.emit('baron', room, lobbyObject.players[1])
})

socket.on('baronReady',(playerAttacking, playerAttacked, result) => {
    console.log(playerAttacked)
    console.log(playerAttacking)
    alert(result)
} )


// Handmaid
handmaid.addEventListener('click', () => {
    socket.emit('handmaid', room)
})

socket.on('handmaidReady', player => {
    alert(`${player.nickname} is protected`)
})


socket.on('throwError', error => {
    alert(error)
})





