const socket = io();
//Error map about accessibility of lobby
let errorMap = new Map();
errorMap.set(100, "Lobby is full!");
errorMap.set(101, "Lobby has already been created!")
errorMap.set(102, "Lobby doesn't exist")
errorMap.set(103, "Everybody must be ready")
errorMap.set(200, "This nickname is already in use in this lobby!");


//Game state
let players = []
let game = {}
let cards = {}

//Lobby information
const nickname = new URLSearchParams(location.search).get('nickname')
const room = new URLSearchParams(location.search).get('room')
const number = new URLSearchParams(location.search).get('number')


let enemyNodes = []
let enemyCardsOnHand = []
let enemyCardsDiscarded = []

//DOM Elements for manipulating game into HTML
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
const backdropRoundOverWinner = document.querySelector('.backdrop-roundOver_winner')
const backdropAttacking = document.querySelector('.backdrop-attacking_container-playerAttacking')
const backdropAttacked = document.querySelector('.backdrop-attacking_container-playerAttacked')
const backdropAttackCard = document.querySelector('.backdrop-attacking_container-cardPlayed')
const backdropRoundOverTitle = document.querySelector('.backdrop-roundOver_title')
const gameMessage = document.querySelector('.game-message')
const gameMessageButton = document.querySelector('.game-message button')
const gameMessageMessage = document.querySelector('.game-message_message')

//This function will be used every time any card is used. It changes dom according to new state.

gameMessageButton.addEventListener('click', () => {
    gameMessage.style.transform = ''
})

const drawCards = (lobby) => {
    gameMessage.style.transform = ''
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

        //Action listener when player clicks his own card
        myCard.addEventListener('click', function(){
            enemyNodes.forEach((enemyNode,enemyNodeInd) => {
                let newEnemyNode = enemyNode.cloneNode(true)
                Enemies.replaceChild(newEnemyNode, enemyNode)
                enemyNodes.splice(enemyNodeInd,1,newEnemyNode)
    newEnemyNode.classList.add('hoverElem')
            })
                        if(player.hisTurn){
                   if(!player.isOutOfRound){
                                
                    let allPlayersProtected = players.slice(1).every((elem) => elem.isProtected || elem.isOutOfRound)
                    if(allPlayersProtected){
                        if(crdOnhd.strength === 8){
                            socket.emit('princess', room)
                        }else{
                            socket.emit('discardCard', room, crdOnhd.card)
                        }
                    }else{
if(crdOnhd.strength === 1){
            enemyNodes.forEach((enemyNode, enemyInd) => {
            enemyNode.addEventListener('click', function(){
            if(players[enemyInd + 1].isProtected){
                gameMessage.style.transform = 'translateY(0)'
gameMessageMessage.innerHTML = 'This player is protected'
            }else if(players[enemyInd + 1].isOutOfRound){
                gameMessage.style.transform = 'translateY(0)'
                gameMessageMessage.innerHTML = 'This player is out of round'
            }
            
            else{
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
            enemyNodes.forEach((enemyNode, ind) => {
            enemyNode.addEventListener('click', function(){
            if(players[ind + 1].isProtected){
gameMessage.style.transform = 'translateY(0)'
gameMessageMessage.innerHTML = 'This player is protected'
            }
            else if(players[ind + 1].isOutOfRound){
                gameMessage.style.transform = 'translateY(0)'
                gameMessageMessage.innerHTML = 'This player is out of round'
            }
            else{
            socket.emit('priest',room, players[ind + 1])
                     }
            })
            }) 
            }else if(crdOnhd.strength === 3){
            enemyNodes.forEach((enemyNode, ind) => {
            enemyNode.addEventListener('click', function(){
            if(players[ind + 1].isProtected){
                gameMessage.style.transform = 'translateY(0)'
                gameMessageMessage.innerHTML = 'This player is protected'
              }
              else if(players[ind + 1].isOutOfRound){
                gameMessage.style.transform = 'translateY(0)'
                gameMessageMessage.innerHTML = 'This player is out of round'
            }
              else{
            socket.emit('baron', room, players[ind + 1])
                     }
            })
            }) 
            }else if(crdOnhd.strength === 4){
            socket.emit('handmaid', room)
            }
            else if(crdOnhd.strength === 5){
            if(player.cardsOnHand[0].card !== player.cardsOnHand[1].card){
            const index = player.cardsOnHand.findIndex((elem) => elem.card !== crdOnhd.card)
            if(player.cardsOnHand[index].strength === 7){
                gameMessage.style.transform = 'translateY(0)'
                gameMessageMessage.innerHTML = 'You should discard countess'
                        }else{
                enemyNodes.forEach((enemyNode, ind) => {
                  enemyNode.addEventListener('click', function(){ 
                    if(players[ind + 1].isProtected){
                        gameMessage.style.transform = 'translateY(0)'
                        gameMessageMessage.innerHTML = 'This player is protected'
                      }else if(players[ind + 1].isOutOfRound){
                        gameMessage.style.transform = 'translateY(0)'
                        gameMessageMessage.innerHTML = 'This player is out of round'
                    }
                      
                      else{
                        socket.emit('prince', room, players[ind + 1])
                    }
                })
                }) 
            }
            }else{
            enemyNodes.forEach((enemyNode, ind) => {
              enemyNode.addEventListener('click', function(){
 enemyNode.addEventListener('click', function(){ 
                    if(players[ind + 1].isProtected){
                        gameMessage.style.transform = 'translateY(0)'
                        gameMessageMessage.innerHTML = 'This player is protected'
                      }
                      else if(players[ind + 1].isOutOfRound){
                        gameMessage.style.transform = 'translateY(0)'
                        gameMessageMessage.innerHTML = 'This player is out of round'
                    }
                      else{
                        socket.emit('prince', room, players[ind + 1])
                    }
                })            })
            }) 
            }                    
            }
            else if(crdOnhd.strength === 6){
            if(player.cardsOnHand[0].card !== player.cardsOnHand[1].card){
            const index = player.cardsOnHand.findIndex((elem) => elem.card !== crdOnhd.card)
            if(player.cardsOnHand[index].strength === 7){
                gameMessage.style.transform = 'translateY(0)'
                gameMessageMessage.innerHTML = 'You should discard countess'
                        }else{
            enemyNodes.forEach((enemyNode, ind) => {
              enemyNode.addEventListener('click', function(){
                if(players[ind + 1].isProtected){
                    gameMessage.style.transform = 'translateY(0)'
                    gameMessageMessage.innerHTML = 'This player is protected'
                                         }
                                         else if(players[ind + 1].isOutOfRound){
                                            gameMessage.style.transform = 'translateY(0)'
                                            gameMessageMessage.innerHTML = 'This player is out of round'
                                        }
                                         else{
                  socket.emit('king', room, players[ind + 1])
                         }
            })
            }) 
            }
            }else{
            enemyNodes.forEach((enemyNode, ind) => {
            enemyNode.addEventListener('click', function(){
            if(players[ind + 1].isProtected){
                gameMessage.style.transform = 'translateY(0)'
                gameMessageMessage.innerHTML = 'This player is protected'
                                 }
                                 else if(players[ind + 1].isOutOfRound){
                                    gameMessage.style.transform = 'translateY(0)'
                                    gameMessageMessage.innerHTML = 'This player is out of round'
                                }
                                 else{
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
                    gameMessage.style.transform = 'translateY(0)'
                    gameMessageMessage.innerHTML = 'You are out of round'
                                   }
                        }else{
                            gameMessage.style.transform = 'translateY(0)'
                            gameMessageMessage.innerHTML = 'It is not your turn'
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

//Socket responses about cards

socket.on('drawnCardReady', lobby => {
    drawCards(lobby)
})


socket.on('baronReady',function(lobbyCondition) {
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
    drawCards(lobby)
   }
   )

socket.on('handmaidReady', lobby => {
    backdropAttack.style.display = 'flex'
    backdropAttacking.innerHTML = lobby.game.playerAttacking
    backdropAttacked.innerHTML =  ''
    backdropAttackCard.style.backgroundImage = `url(../assets/${lobby.game.cardPlayer.toLowerCase()}.jpg)`
    setTimeout(() => {
        backdropAttack.style.display = ''
        drawCards(lobby)
    },1500) })

   socket.on('guardReady', (lobbyCondition, matched) => {
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
        gameMessage.style.transform = 'translateY(0)'
       gameMessageMessage.innerHTML = `This player has ${card.card}`
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





//Socket responses about whole game
socket.on('gameOver', (lobby, winner) => {
    gameMessage.style.transform = ''
    backdropRoundOver.style.display = 'flex'
    backdropRoundOverTitle.innerHTML = 'Game Over'
    backdropRoundOverWinner.innerHTML = `${winner.nickname} is winner.!!!`
setTimeout(() => {
    window.history.back();
},10000)
})

socket.on('throwError', error => {
    gameMessage.style.transform = 'translateY(0)'
gameMessageMessage.innerHTML = errorMap.get(error)
setTimeout(() => {
    window.history.back();
},1400)
                    })

socket.on('roundOver', (lobby,winner) => {
    gameMessage.style.transform = ''

    backdropRoundOver.style.display = 'flex'
    backdropRoundOverWinner.innerHTML = `${winner.nickname} wins this round.`
if(players[0].hisTurn){
    socket.emit('reset', room)

}
})

socket.emit('new-user', room, nickname, number)
socket.on('send-first-message', ( newPlayer, lobby,  status, rooms ) => {
    console.log(lobby)
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
    gameMessage.style.transform = ''
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