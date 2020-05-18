var socket = io();
// 
// https://ufaz-love-letter.herokuapp.com

//DOM variables
const Enemies = document.querySelector('#Enemies')
const MyPlayer = document.querySelector('#MyPlayer')
const MyPlayername = document.querySelector('#MyPlayer--Name')
const MyPlayerCardsOnHand = document.querySelector('#MyPlayer--CardsOnHand')
//Variables about game
let players = [];
let game = {}
let playersNodes = []

// Parsing the query string
const nickname = new URLSearchParams(location.search).get('nickname')
const room = new URLSearchParams(location.search).get('room')
const number = new URLSearchParams(location.search).get('number')

socket.emit('new-user', room, nickname, number)
socket.on('send-first-message', ( newPlayer, lobby,  status, rooms ) => {
    console.log(lobby)
    Enemies.innerHTML = ``
if(newPlayer.nickname === nickname){
    localStorage.setItem('player',JSON.stringify(newPlayer))
}
const index = lobby.players.findIndex(elem => elem.nickname === nickname)
players = lobby.players.slice(index,lobby.players.length).concat(lobby.players.slice(0,index))
players.forEach((player,ind) => {
    if(ind !== 0){
        const enemy = document.createElement('div')
const title = document.createElement('h1')
title.innerHTML = player.nickname;
enemy.appendChild(title)
enemy.setAttribute('class','enemy')
Enemies.appendChild(enemy)
    }else{
        MyPlayername.innerHTML = players[0].nickname
    }
})
if(lobby.isFull){
    socket.emit('drawCard',room)
    socket.on('drawnCardReady', (lobby) => {
        const index = lobby.players.findIndex(elem => elem.nickname === nickname)
        players = lobby.players.slice(index,lobby.players.length).concat(lobby.players.slice(0,index));
        Enemies.innerHTML = ``
       players.forEach((plyr, ind) => {
        if(ind !== 0){
            const enemy = document.createElement('div');
    const title = document.createElement('h1');
    const cardsOnHand = document.createElement('div');
    cardsOnHand.setAttribute('class','enemy-cardsOnHand')
    title.innerHTML = plyr.nickname;
    enemy.appendChild(title);
    enemy.setAttribute('class','enemy');
    plyr.cardsOnHand.forEach((card) => {
        const cardComp = document.createElement('div')
        cardComp.setAttribute('class', 'card-so-little')
        cardsOnHand.appendChild(cardComp)
    })
    enemy.appendChild(cardsOnHand)
    Enemies.appendChild(enemy);
        }else{
MyPlayerCardsOnHand.innerHTML = '';
players[0].cardsOnHand.forEach((crd) => {
    const card = document.createElement('div')
card.setAttribute('class', 'MyCard')
const cardInner = document.createElement('div');
cardInner.setAttribute('class', 'MyCard-Inner');
card.appendChild(cardInner)
const cardInnerFront = document.createElement('div');
cardInnerFront.setAttribute('class','card-Inner-Front')
const cardInnerBack = document.createElement('div');
cardInnerBack.setAttribute('class','card-Inner-Back')
const img = new Image()
img.src = `../assets/${crd.card.toLowerCase()}.jpg`
cardInnerFront.appendChild(img)
cardInner.appendChild(cardInnerFront)
cardInner.appendChild(cardInnerBack)
MyPlayerCardsOnHand.appendChild(card)
})
        }
       })
    })
     
}
})


const drawCard = document.getElementById('drawCard')
// Draw a card
drawCard.addEventListener('click', () => {
    socket.emit('drawCard',room)
})
socket.on('drawnCardReady', lobby => {
    console.log("After drawCard: ")
    console.log(lobby)
})



// // Draw a card
// drawAll.addEventListener('click', () => {
// })





// // Discard a card
// discardCard.addEventListener('click', () => {
//     const chooseDiscardCard = document.getElementById('chooseDiscardCard').value
//     socket.emit('discardCard', room, chooseDiscardCard)
// })
// socket.on('discardedCardReady', player => {
//     console.log(player)
// })



// // Guard
// guard.addEventListener('click', () => {
//     const guess = document.getElementById('guessCard').value
//     console.log(`Your guess is ${guess}`)
//     socket.emit('guard', room , guess, lobbyObject.players[1])
// })
// socket.on('guardReady', lobby => {
//     console.log('After guard: ')
//     console.log(lobby)
// })



// // Priest
// priest.addEventListener('click', () => {
//     socket.emit('priest',room, lobbyObject.players[1])
// })
// socket.on('priestReady', (lobby, card) => {
//     console.log('After priest: ')
//     console.log(lobby)
//     alert(card.card)
// })



// // Baron
// baron.addEventListener('click', () => {
//     socket.emit('baron', room, lobbyObject.players[1])
// })
// socket.on('baronReady',(lobby, answer) => {
//     console.log("After baron")
//     console.log(lobby)
//     alert(answer)
// } )



// // Handmaid
// handmaid.addEventListener('click', () => {
//     socket.emit('handmaid', room)
// })
// socket.on('handmaidReady', lobby => {
//     console.log("After handmaid: ")
//     console.log(lobby)
// })



// // Prince
// prince.addEventListener('click', () => {
//     socket.emit('prince', room, lobbyObject.players[1])
// })
// socket.on('princeReady', (lobby, result) => {
//     console.log('After prince: ')
//     console.log(lobby)
//     alert(result)
// })



// // King
// king.addEventListener('click', () => {
//     socket.emit('king', room, lobbyObject.players[1])
// })
// socket.on('kingReady', lobby => {
//     console.log("After king: ")
//     console.log(lobby)
// })



// // Countess
// countess.addEventListener('click', () => {
//     socket.emit('countess', room)
// })
// socket.on('countessReady', lobby => {
//     console.log("After countess: ")
//     console.log(lobby)
// })



// // Princess
// princess.addEventListener('click', () => {
//     socket.emit('princess', room)
// })
// socket.on('princessReady', (lobby, answer) => {
//     console.log(lobby)
//     alert(answer)
// })

// Round is over
socket.on('roundOver', lobby => {
    console.log("After roundOver: ")
    console.log(lobby)
    
})

// Game is over
socket.on('gameOver', lobby => {
    console.log("After roundOver: ")
    console.log(lobby)
})
socket.on('throwError', error => {
    alert(error)
})





