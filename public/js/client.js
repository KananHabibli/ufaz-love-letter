var socket = io.connect("http://ufaz-love-letter.herokuapp.com/", {transports:['websocket']});

// Elements
const players  = document.getElementById('players')
const drawCard = document.getElementById('drawCard')
const drawAll = document.getElementById('drawAll')
const discardCard = document.getElementById('discardCard')
const guard = document.getElementById('guard')
const priest = document.getElementById('priest')
const baron = document.getElementById('baron')
const handmaid = document.getElementById('handmaid')
const prince = document.getElementById('prince')
const countess = document.getElementById('countess')
const princess = document.getElementById('princess')



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
    socket.emit('drawCard',room)
})
socket.on('drawnCardReady', (player, lobby) => {
    lobbyObject = lobby
    console.log("After drawCard: ")
    console.log(player)
    console.log(lobby)
})



// Draw a card
drawAll.addEventListener('click', () => {
    socket.emit('drawAll',room)
})
socket.on('drawAllReady', lobby => {
    console.log(lobby)
})




// Discard a card
discardCard.addEventListener('click', () => {
    const chooseDiscardCard = document.getElementById('chooseDiscardCard').value
    socket.emit('discardCard', room, chooseDiscardCard)
})
socket.on('discardedCardReady', player => {
    playerObject = player
    console.log("After discardCard: ")
    console.log(playerObject)
})



// Guard
guard.addEventListener('click', () => {
    const guess = document.getElementById('guessCard').value
    console.log(`Your guess is ${guessCard}`)
    socket.emit('guard', room , guess, lobbyObject.players[1])
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



// Prince
prince.addEventListener('click', () => {
    socket.emit('prince', room, lobbyObject.players[1])
})
socket.on('princeReady', (card, playerAttacked, result) => {
    alert(result)
    console.log(`${playerAttacked.nickname}'s ${card.card} is discarded`)
})



// King
king.addEventListener('click', () => {
    socket.emit('king', room, lobbyObject.players[1])
})
socket.on('kingReady', (playerAttacking, playerAttacked) => {
    console.log(playerAttacking)
    console.log(playerAttacked)
})



// Countess
countess.addEventListener('click', () => {
    socket.emit('countess', room)
})
socket.on('countessReady', player => {
    console.log(player)
})



// Princess
princess.addEventListener('click', () => {
    socket.emit('princess', room)
})
socket.on('princessReady', (player, result) => {
    alert(result)
    console.log(player)
})



socket.on('throwError', error => {
    alert(error)
})





