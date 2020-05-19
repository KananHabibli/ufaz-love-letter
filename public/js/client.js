var socket = io();
// 
// https://ufaz-love-letter.herokuapp.com

//DOM variables
const players = document.getElementById('players')


//Variables about game
let lobbyObject

// Parsing the query string
const nickname = new URLSearchParams(location.search).get('nickname')
const room = new URLSearchParams(location.search).get('room')
const number = new URLSearchParams(location.search).get('number')

socket.emit('new-user', room, nickname, number)
socket.on('send-first-message', ( newPlayer, lobby,  status, rooms ) => {
    lobbyObject = lobby
    var tag = document.createElement("p");
    var text = document.createTextNode(`Status : ${status} Player : ${newPlayer.nickname} Lobby : ${lobby.room} `);
    tag.appendChild(text);
    players.appendChild(tag)
})


const drawCard = document.getElementById('drawCard')
// Draw a card
drawCard.addEventListener('click', () => {
    socket.emit('drawCard',room)
})
socket.on('drawnCardReady', lobby => {
    lobbyObject = lobby
    console.log("After drawCard: ")
    console.log(lobby)
})



const drawAll = document.getElementById('drawAll')
// Draw a card
drawAll.addEventListener('click', () => {
    socket.emit('drawAll', room)
})
socket.on('drawAllReady', lobby => {
    lobbyObject = lobby
    console.log('After drawAll: ')
    console.log(lobby)
})



const discardCard = document.getElementById('discardCard')
// Discard a card
discardCard.addEventListener('click', () => {
    const chooseDiscardCard = document.getElementById('chooseDiscardCard').value
    socket.emit('discardCard', room, chooseDiscardCard)
})
socket.on('discardedCardReady', lobby => {
    lobbyObject = lobby
    console.log('After discardCard')
    console.log(lobby)
})


const guard = document.getElementById('guard')
// Guard
guard.addEventListener('click', () => {
    const guess = document.getElementById('guessCard').value
    console.log(`Your guess is ${guess}`)
    socket.emit('guard', room , guess, lobbyObject.players[1])
})
socket.on('guardReady', lobby => {
    console.log('After guard: ')
    console.log(lobby)
})


const priest = document.getElementById('priest')
// Priest
priest.addEventListener('click', () => {
    socket.emit('priest',room, lobbyObject.players[1])
})
socket.on('priestReady', (lobby, card) => {
    console.log('After priest: ')
    console.log(lobby)
    alert(card.card)
})


const baron = document.getElementById('baron')
// Baron
baron.addEventListener('click', () => {
    socket.emit('baron', room, lobbyObject.players[1])
})
socket.on('baronReady',lobby => {
    console.log("After baron")
    console.log(lobby)
} )


const handmaid = document.getElementById('handmaid')
// Handmaid
handmaid.addEventListener('click', () => {
    socket.emit('handmaid', room)
})
socket.on('handmaidReady', lobby => {
    console.log("After handmaid: ")
    console.log(lobby)
})


const prince = document.getElementById('prince')
// Prince
prince.addEventListener('click', () => {
    socket.emit('prince', room, lobbyObject.players[1])
})
socket.on('princeReady', lobby => {
    console.log('After prince: ')
    console.log(lobby)
})


const king = document.getElementById('king')
// King
king.addEventListener('click', () => {
    socket.emit('king', room, lobbyObject.players[1])
})
socket.on('kingReady', lobby => {
    console.log("After king: ")
    console.log(lobby)
})


const countess = document.getElementById('countess')
// Countess
countess.addEventListener('click', () => {
    socket.emit('countess', room)
})
socket.on('countessReady', lobby => {
    console.log("After countess: ")
    console.log(lobby)
})


const princess = document.getElementById('princess')
// Princess
princess.addEventListener('click', () => {
    socket.emit('princess', room)
})
socket.on('princessReady', lobby => {
    console.log("After princess: ")
    console.log(lobby)
})

const reset = document.getElementById('reset')
// Princess
reset.addEventListener('click', () => {
    socket.emit('reset', room)
})
socket.on('resetReady', lobby => {
    console.log("After reset: ")
    console.log(lobby)
})

// Round is over
socket.on('roundOver', lobby => {
    console.log("After roundOver: ")
    console.log(lobby)
    
})

// Game is over
socket.on('gameOver', lobby => {
    console.log("After gameOver: ")
    console.log(lobby)
    alert('gg')
})
socket.on('throwError', error => {
    alert(error)
})





