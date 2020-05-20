var socket = io();
// 
// https://ufaz-love-letter.herokuapp.com

//DOM variables
// const players = document.getElementById('players')
let players = []
let game = {}
let cards = {}

// Parsing the query string
const nickname = new URLSearchParams(location.search).get('nickname')
const room = new URLSearchParams(location.search).get('room')
const number = new URLSearchParams(location.search).get('number')


let enemyNodes = []
let enemyCardsOnHand = []
let enemyCardsDiscarded = []
const MyPlayerHisTurn = document.querySelector('.hisTurn-Comp-Unmount')
const MyPlayer = document.querySelector('.MyPlayer')
const MyPlayerTitle = document.querySelector('.MyPlayer--name')
const MyPlayerCardsOnHand = document.querySelector('.MyPlayer--CardsOnHand')
const MyPlayerCardsDiscarded = document.querySelector('.MyPlayer--CardsDiscarded')
const Enemies = document.querySelector('.Enemies')
const CardHolder = document.querySelector('.cardHolder')
// const Backdrop = document.querySelector('.backdrop')
//Variables about game

const drawCards = (lobby) => {
    const index = lobby.players.findIndex(elem => elem.nickname === nickname);
    players = lobby.players.slice(index,lobby.players.length).concat(lobby.players.slice(0,index));
    cards = lobby.cards
    game = {
  ...lobby.game,
  isFull:lobby.isFull,
  numberOfPlayers: lobby.numberOfPlayers,
  room:lobby.room   
  }
  MyPlayerCardsDiscarded.innerHTML = ''
  MyPlayerCardsOnHand.innerHTML = ''
  Enemies.innerHTML = ''
  enemyNodes = []
      console.log("DrawCards()",  lobby)
      CardHolder.innerHTML = lobby.cards.gameCards.length
 players.forEach((player, index) => {
     if(index === 0){
    MyPlayerTitle.innerHTML = player.nickname;
    if(player.hisTurn){
        MyPlayerHisTurn.classList.add('hisTurn--Comp')
    }else{
        MyPlayerHisTurn.classList.remove('hisTurn--Comp')
      }
    player.cardsOnHand.forEach((crdOnhd) => {
        const myCard = document.createElement('div')
        myCard.setAttribute('class','MyCard');
        myCard.addEventListener('click', function(){
            console.log('card clicked')
            if(player.hisTurn){
if(crdOnhd.strength === 1){
    console.log('Guard is CLicked')
alert("Select Player To Guess")
enemyNodes.forEach((enemyNode, ind) => {
  enemyNode.addEventListener('click', function(){
      console.log(room)
      console.log(players[ind + 1])
    socket.emit('guard', room , "Guard", players[ind + 1])
  })
})
}else if(crdOnhd.strength === 2){
    alert("Select Player To Watch His Hand")
    enemyNodes.forEach((enemyNode, ind) => {
      enemyNode.addEventListener('click', function(){
        socket.emit('priest',room, players[ind + 1])
    })
    }) 
}else if(crdOnhd.strength === 3){
    console.log('Baron Clicked')
    alert("Select Player To Compare Your Hand")
    enemyNodes.forEach((enemyNode, ind) => {
      enemyNode.addEventListener('click', function(){
          console.log(players[ind + 1])
          console.log(room)
        socket.emit('baron', room, players[ind + 1])

    })
    }) 
}else if(crdOnhd.strength === 4){
    alert('You are protected')
    socket.emit('handmaid', room)
}else if(crdOnhd.strength === 5){
    alert("Select Player To Discard His Card And Take New One")
    enemyNodes.forEach((enemyNode, ind) => {
      enemyNode.addEventListener('click', function(){
          console.log(players[ind + 1])
          console.log(room)
          socket.emit('prince', room, players[ind + 1])
    })
    }) 
}
else if(crdOnhd.strength === 6){
    console.log('King is Clicked')
    alert("Select Player To Trade Your Hands")
    enemyNodes.forEach((enemyNode, ind) => {
      enemyNode.addEventListener('click', function(){
          console.log(players[ind + 1])
          console.log(room)
          socket.emit('king', room, players[ind + 1])
    })
    }) 
}
else if(crdOnhd.strength === 7){
        socket.emit('countess', room)
}else if(crdOnhd.strength === 8){
    socket.emit('princess', room)
}
            }
            else{
                alert('Wait for your turn.')
            }
        })
        myCard.style.backgroundImage = `url(../assets/${crdOnhd.card.toLowerCase()}.jpg)`
        MyPlayerCardsOnHand.appendChild(myCard)
    })
    player.cardsDiscarded.forEach((crdDsc) => {
      const myCard = document.createElement('div')
      myCard.setAttribute('class','card-discarded');
      myCard.style.backgroundImage = `url(../assets/${crdDsc.card.toLowerCase()}.jpg)`
      MyPlayerCardsDiscarded.appendChild(myCard)
    })
    if(player.isOutOfRound){
        MyPlayer.style.opacity = '0.5'
    }
     }else{
      const enemy = document.createElement('div')
      if(player.hisTurn){
          const enemyTurn = document.createElement('div');
          enemyTurn.setAttribute('class','hisTurn--Comp');
          enemy.appendChild(enemyTurn)
      }
      enemy.setAttribute('class', 'enemy');
      const enemyTitle = document.createElement('div')
      enemyTitle.setAttribute('class','enemy-title')
      enemyTitle.innerHTML = player.nickname
      enemy.appendChild(enemyTitle)
      const enemyDiscarded = document.createElement('div');
      enemyDiscarded.setAttribute('class','enemy-cards-discarded');

      player.cardsDiscarded.forEach((crdDsc) => {
          const card = document.createElement('div')
          card.setAttribute('class','card-discarded');
          card.style.backgroundImage = `url(../assets/${crdDsc.card.toLowerCase()}.jpg)`
          enemyDiscarded.appendChild(card)
      })

      const enemyOnHand = document.createElement('div');
      enemyOnHand.setAttribute('class','enemy-cardsOnHand');
      player.cardsOnHand.forEach((crdOnhd) => {
          const card = document.createElement('div')
          card.setAttribute('class','enemy-card');
          enemyOnHand.appendChild(card)
      })
      enemy.appendChild(enemyDiscarded)
      enemyCardsDiscarded.push(enemyDiscarded)
      enemyCardsOnHand.push(enemyOnHand)
      enemy.appendChild(enemyOnHand)
      enemyNodes.push(enemy)
      Enemies.appendChild(enemy)
      if(player.isOutOfRound){
        enemy.style.opacity = '0.5'
    }
     }
 })
}

socket.on('drawnCardReady', lobby => {
    console.log("Card is given")
    drawCards(lobby)
})


socket.on('baronReady',function(lobbyCondition) {
    console.log("Baron")
  drawCards(lobbyCondition)
} )

socket.on('drawAllReady', function(lobby){
    console.log("Card is given to all")
    drawCards(lobby)
   }
   )

socket.on('handmaidReady', lobby => {
    console.log("Handmaid")

    drawCards(lobby)
})

   socket.on('guardReady', (lobbyCondition, matched) => {
    console.log('After guard')
    console.log(matched)
    drawCards(lobbyCondition)
    })

    socket.on('kingReady', lobby => {
        console.log("After king: ")
drawCards(lobby)
    })

    socket.on('princeReady', function(lobby){
        console.log('After prince: ')
        console.log(lobby)
        drawCards(lobby)
    })

socket.on('priestReady', function(lobby, card){
    alert("The Player  has " + card.card)
    drawCards(lobby)
})

socket.on('handmaidReady', lobby => {
    drawCards(lobby)

})

socket.on('countessReady', lobby => {
    drawCards(lobby)
})

socket.on('princessReady', lobby => {
drawCards(lobby)
})

socket.emit('new-user', room, nickname, number)
socket.on('send-first-message', ( newPlayer, lobby,  status, rooms ) => {
    const index = lobby.players.findIndex(elem => elem.nickname === nickname);
  players = lobby.players.slice(index,lobby.players.length).concat(lobby.players.slice(0,index));
  cards = lobby.cards
  game = {...lobby.game,
isFull:lobby.isFull,
numberOfPlayers: lobby.numberOfPlayers,
room:lobby.room   
}

console.log(lobby);
if(game.isFull){
    if(players[0].hisTurn){
        socket.emit('drawAll',room)
        socket.emit('drawCard', room)
    }
        socket.on('drawAllReady', function(lobby){
            const index = lobby.players.findIndex(elem => elem.nickname === nickname);
            players = lobby.players.slice(index,lobby.players.length).concat(lobby.players.slice(0,index));
            cards = lobby.cards
            game = {
          ...lobby.game,
          isFull:lobby.isFull,
          numberOfPlayers: lobby.numberOfPlayers,
          room:lobby.room   
          }
          MyPlayerCardsDiscarded.innerHTML = ''
          MyPlayerCardsOnHand.innerHTML = ''
          Enemies.innerHTML = ''
          enemyNodes = []
          enemyCardsDiscarded = []
          enemyCardsOnHand = []
       players.forEach((player, index) => {
           if(index === 0){
          MyPlayerTitle.innerHTML = player.nickname;
          if(player.hisTurn){
              MyPlayerHisTurn.classList.add('hisTurn--Comp')
          }else{
            MyPlayerHisTurn.classList.remove('hisTurn--Comp')

          }
          player.cardsOnHand.forEach((crdOnhd) => {
              const myCard = document.createElement('div')
              myCard.setAttribute('class','MyCard');
              myCard.style.backgroundImage = `url(../assets/${crdOnhd.card.toLowerCase()}.jpg)`
              MyPlayerCardsOnHand.appendChild(myCard)
          })
          player.cardsDiscarded.forEach((crdDsc) => {
            const myCard = document.createElement('div')
            myCard.setAttribute('class','card-discarded');
            myCard.style.backgroundImage = `url(../assets/${crdDsc.card.toLowerCase()}.jpg)`
            MyPlayerCardsDiscarded.appendChild(myCard)
          })
           }else{
            const enemy = document.createElement('div')
            if(player.hisTurn){
                const enemyTurn = document.createElement('div');
                enemyTurn.setAttribute('class','hisTurn--Comp');
                enemy.appendChild(enemyTurn)
            }
            enemy.setAttribute('class', 'enemy');
            const enemyTitle = document.createElement('div')
            enemyTitle.setAttribute('class','enemy-title')
            enemyTitle.innerHTML = player.nickname
            enemy.appendChild(enemyTitle)
            const enemyDiscarded = document.createElement('div');
            enemyDiscarded.setAttribute('class','enemy-cards-discarded');

            player.cardsDiscarded.forEach((crdDsc) => {
                const card = document.createElement('div')
                card.setAttribute('class','card-discarded');
                card.style.backgroundImage = `url(../assets/${crdDsc.card.toLowerCase()}.jpg)`
                enemyDiscarded.appendChild(card)
            })

            const enemyOnHand = document.createElement('div');
            enemyOnHand.setAttribute('class','enemy-cardsOnHand');
            player.cardsOnHand.forEach((crdOnhd) => {
                const card = document.createElement('div')
                card.setAttribute('class','enemy-card');
                enemyOnHand.appendChild(card)
            })
            enemy.appendChild(enemyDiscarded)
            enemyCardsDiscarded.push(enemyDiscarded)
            enemyCardsOnHand.push(enemyOnHand)
            enemy.appendChild(enemyOnHand)
            Enemies.appendChild(enemy)
           }
       })
           }
           )

}
})

// const prince = document.getElementById('prince')
// // Prince
// prince.addEventListener('click', () => {
//     socket.emit('prince', room, lobbyObject.players[1])
// })
// socket.on('princeReady', lobby => {
//     console.log('After prince: ')
//     console.log(lobby)
// })


// const king = document.getElementById('king')
// // King
// king.addEventListener('click', () => {
//     socket.emit('king', room, lobbyObject.players[1])
// })
// socket.on('kingReady', lobby => {
//     console.log("After king: ")
//     console.log(lobby)
// })


// const countess = document.getElementById('countess')
// // Countess
// countess.addEventListener('click', () => {
//     socket.emit('countess', room)
// })
// socket.on('countessReady', lobby => {
//     console.log("After countess: ")
//     console.log(lobby)
// })


// const princess = document.getElementById('princess')
// // Princess
// princess.addEventListener('click', () => {
//     socket.emit('princess', room)
// })
// socket.on('princessReady', lobby => {
//     console.log("After princess: ")
//     console.log(lobby)
// })

// const reset = document.getElementById('reset')
// // Princess
// reset.addEventListener('click', () => {
//     socket.emit('reset', room)
// })
// socket.on('resetReady', lobby => {
//     console.log("After reset: ")
//     console.log(lobby)
// })

// // Round is over
// socket.on('roundOver', lobby => {
//     console.log("After roundOver: ")
//     console.log(lobby)
    
// })

// // Game is over
// socket.on('gameOver', lobby => {
//     console.log("After gameOver: ")
//     console.log(lobby)
//     alert('gg')
// })
// socket.on('throwError', error => {
//     alert(error)
// })


// const discardCard = document.getElementById('discardCard')
// // Discard a card
// discardCard.addEventListener('click', () => {
//     const chooseDiscardCard = document.getElementById('chooseDiscardCard').value
//     socket.emit('discardCard', room, chooseDiscardCard)
// })
// socket.on('discardedCardReady', lobby => {
//     lobbyObject = lobby
//     console.log('After discardCard')
//     console.log(lobby)
// })

socket.on('roundOver', lobby => {
    console.log("After roundOver: ")
    console.log(lobby)
    alert("Round is over")
    
})



