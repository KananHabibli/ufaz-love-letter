const socket = io();
let errorMap = new Map();

errorMap.set(100, "Lobby is full!");
errorMap.set(101, "Lobby has already been created!")
errorMap.set(102, "Lobby doesn't exist")
errorMap.set(103, "Everybody must be ready")
errorMap.set(200, "This nickname is already in use in this lobby!");

let players = []
let game = {}
let cards = {}

const nickname = new URLSearchParams(location.search).get('nickname')
const room = new URLSearchParams(location.search).get('room')
const number = new URLSearchParams(location.search).get('number')


let enemyNodes = []
let enemyCardsOnHand = []
let enemyCardsDiscarded = []
const backdropPlayersWaiting = document.querySelector('.backdrop-waitingPlayers')
const MyPlayerHisTurn = document.querySelector('.hisTurn-Comp-Unmount')
const MyPlayer = document.querySelector('.MyPlayer')
const MyPlayerTitle = document.querySelector('.MyPlayer--name')
const MyPlayerCardsOnHand = document.querySelector('.MyPlayer--CardsOnHand')
const MyPlayerCardsDiscarded = document.querySelector('.MyPlayer--CardsDiscarded')
const MyPlayerRoundsWon = document.querySelector('.player-roundsWon')

const Enemies = document.querySelector('.Enemies')
const CardHolder = document.querySelector('.cardHolder-container')
const CardHolderNumber = document.querySelector('.cardHolder-number')
const backdropGuard = document.querySelector('.backdrop-guard')
const backdropGuardContainer = document.querySelector('.backdrop-guard_container')
const backdropRoundOver = document.querySelector('.backdrop-roundOver')
const backdropAttack = document.querySelector('.backdrop-attacking')
const backdropAttacking = document.querySelector('.backdrop-attacking_container-playerAttacking')
const backdropAttacked = document.querySelector('.backdrop-attacking_container-playerAttacked')
const backdropAttackCard = document.querySelector('.backdrop-attacking_container-cardPlayed')
//Variables about game

const drawCards = (lobby) => {
    const index = lobby.players.findIndex(elem => elem.nickname === nickname);
    players = lobby.players.slice(index,lobby.players.length).concat(lobby.players.slice(0,index));
    cards = lobby.cards
    game = {
  ...lobby.game,
  isFull:lobby.isFull,
  goal:lobby.goal,
  numberOfPlayers: lobby.numberOfPlayers,
  room:lobby.room   
  }
  MyPlayerCardsDiscarded.innerHTML = ''
  MyPlayerCardsOnHand.innerHTML = ''
  Enemies.innerHTML = ''
  MyPlayerRoundsWon.innerHTML = ''
  enemyNodes = []
      console.log("DrawCards()",  lobby)
      CardHolder.innerHTML = ''
      lobby.cards.gameCards.forEach((elem) => {
          const cardDeck = document.createElement('div')
          cardDeck.setAttribute('class', 'card-deck')
          CardHolder.appendChild(cardDeck)
      })
      CardHolderNumber.innerHTML = lobby.cards.gameCards.length
 players.forEach((player, index) => {
     if(index === 0){
    MyPlayerTitle.innerHTML = player.nickname;
    if(player.hisTurn){
        MyPlayerHisTurn.classList.add('hisTurn--Comp')
    }else{
        MyPlayerHisTurn.classList.remove('hisTurn--Comp')
      }
      for(let i = 1; i <= game.goal; i++){
          const plyrWon = document.createElement('div')
          if(i <= player.roundsWon){
              plyrWon.setAttribute('class','player-won')
          }else{
              plyrWon.setAttribute('class', 'player-not-won')
          }
          MyPlayerRoundsWon.appendChild(plyrWon)
      }
    player.cardsOnHand.forEach((crdOnhd) => {
        const myCard = document.createElement('div')
        myCard.setAttribute('class','MyCard');
        myCard.addEventListener('click', function(){
            enemyNodes.forEach((enemyNode,enemyNodeInd) => {
                let newEnemyNode = enemyNode.cloneNode(true)
                Enemies.replaceChild(newEnemyNode, enemyNode)
                enemyNodes.splice(enemyNodeInd,1,newEnemyNode)
    
            })
                        console.log('card clicked')
                        if(player.hisTurn){
                            let allPlayersProtected = players.slice(1).every((elem) => elem.isProtected)
                            if(allPlayersProtected){
                                if(crdOnhd.strength === 8){
                                    socket.emit('princess', room)
                                }else{
                                    socket.emit('discardCard', room, crdOnhd.card)
                                }
                            }else{
   if(crdOnhd.strength === 1){
                    console.log('Guard is CLicked')
                    alert("Select Player To Guess")
                    enemyNodes.forEach((enemyNode, enemyInd) => {
                    enemyNode.addEventListener('click', function(){
                    if(players[enemyInd + 1].isProtected){
                    alert('This player is protected')
                    }else{
                    console.log(room)
                    console.log(players[enemyInd + 1])
                    backdropGuardContainer.innerHTML = ''
                    backdropGuard.style.display = 'flex'
                    let guardGuess = ''
                    cards.distinctCards.forEach((elem, innd) => {
                            const guardGuessComp = document.createElement('div');
                        guardGuessComp.setAttribute('class','guard-guess-card');
                        guardGuessComp.style.backgroundImage = `url(../assets/${elem.card.toLowerCase()}.jpg)`;
                        backdropGuardContainer.appendChild(guardGuessComp)
                        guardGuessComp.addEventListener('click', function(){
                            socket.emit('guard', room , elem.card, players[enemyInd + 1])
                            backdropGuard.style.display = ''
                        })
                    })
                    
                    }
                    })
                    })
                    }else if(crdOnhd.strength === 2){
                    alert("Select Player To Watch His Hand")
                    enemyNodes.forEach((enemyNode, ind) => {
                    enemyNode.addEventListener('click', function(){
                    if(players[ind + 1].isProtected){
                        alert('This player is protected')
                             }else{
                    socket.emit('priest',room, players[ind + 1])
                             }
                    })
                    }) 
                    }else if(crdOnhd.strength === 3){
                    console.log('Baron Clicked')
                    alert("Select Player To Compare Your Hand")
                    enemyNodes.forEach((enemyNode, ind) => {
                    enemyNode.addEventListener('click', function(){
                    if(players[ind + 1].isProtected){
                        alert('This player is protected')
                             }else{
                      console.log(players[ind + 1])
                      console.log(room)
                    socket.emit('baron', room, players[ind + 1])
                             }
                    })
                    }) 
                    }else if(crdOnhd.strength === 4){
                    alert('You are protected')
                    socket.emit('handmaid', room)
                    }
                    else if(crdOnhd.strength === 5){
                    if(player.cardsOnHand[0].card !== player.cardsOnHand[1].card){
                    const index = player.cardsOnHand.findIndex((elem) => elem.card !== crdOnhd.card)
                    if(player.cardsOnHand[index].strength === 7){
                        alert("You should discard countess")
                    }else{
                        alert("Select Player To Discard His Card And Take New One")
                        enemyNodes.forEach((enemyNode, ind) => {
                          enemyNode.addEventListener('click', function(){
                              console.log(players[ind + 1])
                              console.log(room)
                              socket.emit('prince', room, players[ind + 1])
                        })
                        }) 
                    }
                    }else{
                    alert("Select Player To Discard His Card And Take New One")
                    enemyNodes.forEach((enemyNode, ind) => {
                      enemyNode.addEventListener('click', function(){
                          console.log(players[ind + 1])
                          console.log(room)
                          socket.emit('prince', room, players[ind + 1])
                    })
                    }) 
                    }                    
                    }
                    else if(crdOnhd.strength === 6){
                    if(player.cardsOnHand[0].card !== player.cardsOnHand[1].card){
                    const index = player.cardsOnHand.findIndex((elem) => elem.card !== crdOnhd.card)
                    if(player.cardsOnHand[index].strength === 7){
                    alert("You should discard countess")
                    }else{
                    console.log('King is Clicked')
                    alert("Select Player To Trade Your Hands")
                    enemyNodes.forEach((enemyNode, ind) => {
                      enemyNode.addEventListener('click', function(){
                        if(players[ind + 1].isProtected){
                            alert('This player is protected')
                                 }else{
                          console.log(players[ind + 1])
                          console.log(room)
                          socket.emit('king', room, players[ind + 1])
                                 }
                    })
                    }) 
                    }
                    }else{
                    console.log('King is Clicked')
                    alert("Select Player To Trade Your Hands")
                    enemyNodes.forEach((enemyNode, ind) => {
                    enemyNode.addEventListener('click', function(){
                    if(players[ind + 1].isProtected){
                        alert('This player is protected')
                             }else{
                      console.log(players[ind + 1])
                      console.log(room)
                      socket.emit('king', room, players[ind + 1])
                             }
                    })
                    }) 
                    }
                    
                    }
                    else if(crdOnhd.strength === 7){
                    socket.emit('countess', room)
                    }
                    if(crdOnhd.strength === 8){
                        socket.emit('princess', room)
                    }
                            }
                 
                        }else{
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
      const enemyOptions = document.createElement('div')
      enemyOptions.setAttribute('class','player-options')
      const enemyTitle = document.createElement('div')
      if(player.hisTurn){
          const enemyTurn = document.createElement('div');
          enemyTurn.setAttribute('class','hisTurn--Comp');
          enemyOptions.appendChild(enemyTurn)
      }
      if(player.isProtected){
        const enemyProtect = document.createElement('div');
        enemyProtect.setAttribute('class','player-protect');
        enemyOptions.appendChild(enemyProtect)
      }
      enemy.setAttribute('class', 'enemy');
      enemyTitle.setAttribute('class','enemy-title')
      enemyTitle.innerHTML = player.nickname
      enemyOptions.appendChild(enemyTitle)
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
      enemy.appendChild(enemyOptions)
      enemy.appendChild(enemyDiscarded)
      enemyCardsDiscarded.push(enemyDiscarded)
      enemyCardsOnHand.push(enemyOnHand)
      enemyOptions.appendChild(enemyOnHand)
      const playerRoundsWon = document.createElement('div')
      playerRoundsWon.setAttribute('class','player-roundsWon')
      for(let i = 1; i <= game.goal; i++){
        const plyrWon = document.createElement('div')
        if(i <= player.roundsWon){
            plyrWon.setAttribute('class','player-won')
        }else{
            plyrWon.setAttribute('class', 'player-not-won')
        }
        playerRoundsWon.appendChild(plyrWon)
    }
    enemy.appendChild(playerRoundsWon)
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
    backdropAttack.style.display = 'flex'
    backdropAttacking.innerHTML = lobbyCondition.game.playerAttacking
    backdropAttacked.innerHTML = lobbyCondition.game.playerAttacked
    backdropAttackCard.style.backgroundImage = `url(../assets/${lobbyCondition.game.cardPlayer.toLowerCase()}.jpg)`
    setTimeout(() => {
        backdropAttack.style.display = ''
        drawCards(lobbyCondition)
    },1500) 
} )

socket.on('drawAllReady', function(lobby){
    console.log("Card is given to all")
    drawCards(lobby)
   }
   )

socket.on('handmaidReady', lobby => {
    console.log("Handmaid")
    backdropAttack.style.display = 'flex'
    backdropAttacking.innerHTML = lobby.game.playerAttacking
    backdropAttacked.innerHTML =  ''
    backdropAttackCard.style.backgroundImage = `url(../assets/${lobby.game.cardPlayer.toLowerCase()}.jpg)`
    setTimeout(() => {
        backdropAttack.style.display = ''
        drawCards(lobby)
    },1500) })

   socket.on('guardReady', (lobbyCondition, matched) => {
    console.log('After guard')
    console.log(matched)
    backdropAttack.style.display = 'flex'
    backdropAttacking.innerHTML = lobbyCondition.game.playerAttacking
    backdropAttacked.innerHTML = lobbyCondition.game.playerAttacked
    backdropAttackCard.style.backgroundImage = `url(../assets/${lobbyCondition.game.cardPlayer.toLowerCase()}.jpg)`
    setTimeout(() => {
        backdropAttack.style.display = ''
        drawCards(lobbyCondition)
    },1500) 
   })

    socket.on('kingReady', lobby => {
        console.log("After king: ")
        backdropAttack.style.display = 'flex'
        backdropAttacking.innerHTML = lobby.game.playerAttacking
        backdropAttacked.innerHTML = lobby.game.playerAttacked
        backdropAttackCard.style.backgroundImage = `url(../assets/${lobby.game.cardPlayer.toLowerCase()}.jpg)`
        setTimeout(() => {
            backdropAttack.style.display = ''
            drawCards(lobby)
        },1500) 
        })

    socket.on('princeReady', function(lobby){
        console.log('After prince: ')
        backdropAttack.style.display = 'flex'
        backdropAttacking.innerHTML = lobby.game.playerAttacking
        backdropAttacked.innerHTML = lobby.game.playerAttacked
        backdropAttackCard.style.backgroundImage =`url(../assets/${lobby.game.cardPlayer.toLowerCase()}.jpg)`
        setTimeout(() => {
            backdropAttack.style.display = ''
            drawCards(lobby)
        },1500) 
      })

socket.on('priestReady', function(lobby, card){
    if(players[0].nickname === lobby.game.playerAttacking){
        alert("The Player  has " + card.card)
    }
    backdropAttack.style.display = 'flex'
    backdropAttacking.innerHTML = lobby.game.playerAttacking
    backdropAttacked.innerHTML = lobby.game.playerAttacked
    backdropAttackCard.style.backgroundImage = `url(../assets/${lobby.game.cardPlayer.toLowerCase()}.jpg)`
    setTimeout(() => {
        backdropAttack.style.display = ''
        drawCards(lobby)
    },1500) 
})

socket.on('handmaidReady', lobby => {
    backdropAttack.style.display = 'flex'
    backdropAttacking.innerHTML = lobby.game.playerAttacking
    backdropAttacked.innerHTML = ''
    backdropAttackCard.style.backgroundImage = `url(../assets/${lobby.game.cardPlayer.toLowerCase()}.jpg)`
    setTimeout(() => {
        backdropAttack.style.display = ''
        drawCards(lobby)
    },1500) 
})

socket.on('countessReady', lobby => {
    backdropAttack.style.display = 'flex'
    backdropAttacking.innerHTML = lobby.game.playerAttacking
    backdropAttacked.innerHTML = ''
    backdropAttackCard.style.backgroundImage = `url(../assets/${lobby.game.cardPlayer.toLowerCase()}.jpg)`
    setTimeout(() => {
        backdropAttack.style.display = ''
        drawCards(lobby)
    },1500) 
})

socket.on('princessReady', lobby => {
drawCards(lobby)
})

socket.on('discardedCardReady', lobby => {
    drawCards(lobby)
})

socket.emit('new-user', room, nickname, number)
socket.on('send-first-message', ( newPlayer, lobby,  status, rooms ) => {
    const index = lobby.players.findIndex(elem => elem.nickname === nickname);
  players = lobby.players.slice(index,lobby.players.length).concat(lobby.players.slice(0,index));
  cards = lobby.cards
  game = {...lobby.game,
isFull:lobby.isFull,
goal:lobby.goal,
numberOfPlayers: lobby.numberOfPlayers,
room:lobby.room   
}

if(game.isFull){
    backdropPlayersWaiting.style.display = 'none'
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


socket.on('resetReady', lobby => {
    console.log("After reset: ")
    const index = lobby.players.findIndex(elem => elem.nickname === nickname);
    players = lobby.players.slice(index,lobby.players.length).concat(lobby.players.slice(0,index));
    cards = lobby.cards
    game = {...lobby.game,
  isFull:lobby.isFull,
  goal:lobby.goal,
  numberOfPlayers: lobby.numberOfPlayers,
  room:lobby.room   
  }
  
  if(game.isFull){
      backdropPlayersWaiting.style.display = 'none'
      if(players[0].hisTurn){
          socket.emit('drawAll',room)
          socket.emit('drawCard', room)
      }
    }
    setTimeout(() => {
        backdropRoundOver.style.display = ''
    },1000)
})

// reset.addEventListener('click', () => {
// })
// socket.on('resetReady', lobby => {
//     console.log("After reset: ")
//     console.log(lobby)
// })

// Game is over
socket.on('gameOver', lobby => {
    console.log("After gameOver: ")
    console.log(lobby)
    alert('gg')
})

socket.on('throwError', error => {
    alert(errorMap.get(error))
    window.history.back();
})

socket.on('roundOver', lobby => {
    console.log('Round over')
    backdropRoundOver.style.display = 'flex'
if(players[0].hisTurn){
    socket.emit('reset', room)

}
})

console.log(window.history)