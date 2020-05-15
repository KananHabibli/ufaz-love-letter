// Express Server
const express = require('express')
const app = express()
var cors = require('cors')

// socket.io
const socketio = require('socket.io')
const server = require('https').createServer(app)
const io = socketio(server)

// Load keys
const keys = require('./config/keys')

// MongoDB database
const mongoose = require('mongoose')

// Database Connection
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.set('useCreateIndex', true);


// Built-in node package for working with file and directory paths
const path = require('path')

// Static public directory
app.use(express.static(path.join(__dirname, 'public')))

// Handlebars
const exphbs = require('express-handlebars')

// Handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars')

const bodyParser = require("body-parser")

// bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const methodOverride = require('method-override')

// Method Override middleware
app.use(methodOverride('_method'))


// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

const port = process.env.PORT || 5000;

app.use(cors()) 

const morgan = require('morgan')
const fs = require('fs')
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})

morgan(':method :host :status :res[content-length] - :response-time ms');

// Routes
const db = require('./routes/db')
app.use(db)

// Models
const Cards = require('./models/Cards')


// Helper functions
const { getUserRooms } = require('./utils/rooms')
const { randomNumber,
        shuffleCards,
        discardCard,
        findCardIndex,
        findPlayerIndex,
        findPlayerByID,
        findLobby,
        findCard } = require('./utils/utils')
const errorMap = require('./utils/errorMap')

// Main route
app.get('/',function(req,res) {
  res.sendFile('index.html');
});

// Global variable to hold all the lobbies
let rooms = []

// TCP connection
io.on('connection', function(socket){
  console.log('a user connected', socket.id);
  // Adding player to the lobby
  socket.on('new-user', async (room, nickname, number) => {
    // Player object
    let newPlayer = {
        id: socket.id,
        nickname,
        cardsOnHand:[],
        cardsDiscarded:[],
        hisTurn: false,
        isDoingMove: false,
        isOutOfRound: false,
        isProtected: false,
        isOwner: false,
        roundsWon: 0
    }
    let status
    // Looking for the lobby
    let lobby = findLobby(rooms, room)
    // Checking whether the lobby to-be-created has already been created or not
    if(lobby && number !== null){
      io.to(socket.id).emit('throwError', 101)
      return
    }
    // Checking if lobby exist or not
    if(lobby){
      let index = rooms.indexOf(lobby)
      // Checking if lobby is full or not
      if(rooms[index].isFull == false){
        // Checking if the nickname of the player is in use or not
        if(rooms[index].players.some(player => player.nickname === nickname)){
          io.to(socket.id).emit('throwError', 200)
        } else {
          rooms[index].players.push(newPlayer)
          lobby = rooms[index]
          status = "existed"
          socket.join(room)
          // Checking with final addition if lobby is fulled or not
          if(rooms[index].players.length == parseInt(rooms[index].numberOfPlayers)){
            rooms[index].isFull = true
          }
          // Returning a response with data of a lobby and a player
          io.to(room).emit('send-first-message', newPlayer, lobby,  status, rooms)
        }
      } else {
        io.to(socket.id).emit('throwError', 100)
      }
      // Checking if the user is trying to create the lobby or joining it 
    }else if(number !== null) {
      let deck = await Cards.find({})
      let mymap = new Map();
      let distinctCards = deck.filter(el => { 
          const val = mymap.get(el.strength); 
          if(val) { 
              if(el.id < val) { 
                  mymap.delete(el.strength); 
                  mymap.set(el.strength, el.id); 
                  return true; 
              } else { 
                  return false; 
              } 
          } 
          mymap.set(el.strength, el.id); 
          return true; 
      });
      let discardedCards = []
      let goal
      deck = shuffleCards(deck)
      // Getting cards ready for 4-player game
      if(number == 4){
          goal = 4
          let rand = randomNumber(deck.length)
          discardedCards.push(deck[rand])
          deck.splice(rand, 1)
      // Getting cards ready for 3-player game
      }else if(number == 3){
          goal = 5
          let rand = randomNumber(deck.length)
          discardedCards.push(deck[rand])
          deck.splice(rand, 1)
      // Getting cards ready for 2-player game
      }else if(number == 2){
          goal = 7
          for(let i = 0; i < 3; i++){
              let rand = randomNumber(deck.length)
              discardedCards.push(deck[rand])
              deck.splice(rand, 1)
          }
      }
      newPlayer.hisTurn = true
      newPlayer.isOwner = true
      // Creating new lobby
      let newRoom = {
          room,
          goal,
          isFull: false,
          numberOfPlayers: number,
          players: [newPlayer],
          game: {
              playerAttacking:"",
              playerAttacked:"",
              cardPlayer:{}
          },
          cards:{
              gameCards: deck,
              discardedCards,
              distinctCards,
          }
      }
    lobby = newRoom
    status = "new"
    rooms.push(newRoom)
    socket.join(room)
    io.to(room).emit('send-first-message', newPlayer, lobby,  status, rooms)
    } else {
      io.to(socket.id).emit('throwError', 102)
    }
  })


  socket.on('drawCard', room => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    let cardDrawing = lobby.cards.gameCards[0]
    player.cardsOnHand.push(cardDrawing)
    lobby.cards.gameCards.splice(0, 1)
    if(player.cardsOnHand.length == 2){
      if((cardDrawing.card === 'King' || cardDrawing.card === 'Prince') && player.cardsOnHand[0].card === 'Countess'){
        player = discardCard(player, player.cardsOnHand[0])
        player.hisTurn = false
      }
      if(cardDrawing.card === 'Countess' && (player.cardsOnHand[0].card === 'King' || player.cardsOnHand[0].card === 'Prince')){
        player = discardCard(player, player.cardsOnHand[1])
        player.hisTurn = false
      }
    }
    io.to(room).emit('drawnCardReady', player, lobby)
  })

  socket.on('drawAll', room => {
    let lobby  = findLobby(rooms, room)
    if(lobby.players.length == parseInt(lobby.numberOfPlayers)){
      for(let i = 0; i <= lobby.players.length - 1; i++){
        lobby.players[i].cardsOnHand.push(lobby.cards.gameCards[0])
        lobby.cards.gameCards.splice(0, 1)
      }
      io.to(room).emit('drawAllReady', lobby)
    } else {
      io.to(room).emit('throwError', 103)
    }
  })


  socket.on('discardCard', (room, card) => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    let discardcard  = findCard(player.cardsOnHand, card)
    player = discardCard(player, discardcard)
    io.to(room).emit('discardedCardReady', player)
  })


  socket.on('guard', (room, guess, playerAttacked) => {
    let lobby  = findLobby(rooms, room)
    let playerAttacking = findPlayerByID(lobby, socket.id)
    // If guess is right
    let result
    console.log(playerAttacked)
    if(playerAttacked.cardsOnHand[0].card === guess){
      // playerAttacked is out of round
      playerAttacked.isOutOfRound = false
      // playerAttacked's card discarded
      playerAttacked = discardCard(playerAttacked, playerAttacked.cardsOnHand[0])
      result = "Your guess is right"
    } else {
      result = "Your guess is wrong"
    }
    let card = findCard(playerAttacking.cardsOnHand, "Guard")
    playerAttacking = discardCard(playerAttacking, card)
    playerAttacking.hisTurn = false
    // let index =  findPlayerIndex(playerAttacking.nickname, lobby.players)
    // console.log(index)
    io.to(socket.id).emit('guardReady', playerAttacking, playerAttacked, result)
  })


  socket.on('priest', playerAttacked => {
    io.to(socket.id).emit('priestReady', playerAttacked.cardsOnHand[0])
  })


  socket.on('handmaid', room => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    let card = findCard(player.cardsOnHand, "HandMaid")
    player.isProtected = true
    player = discardedCard(player, card)
    io.to(socket.id).emit('handmaidReady', player)
  })


  socket.on('baron', (room, playerAttacked) => {
    let result
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    let otherCard = player.cardsOnHand.find(card => card.card !== "Baron")
    if(otherCard.strength > playerAttacked.cardsOnHand[0].strength){
      result = "Attacking player won"
      playerAttacked.isOutOfRound = true
      playerAttacking = discardCard(playerAttacking, playerAttacking.cardsOnHand[0])
    } else {
      result = "Attacked player won"
      player.isOutOfRound = true
      player = discardCard(player, otherCard)
    }
    let card = findCard(player.cardsOnHand, "Baron")
    player = discardCard(player, card)
    io.to(room).emit("baronReady", player, playerAttacked, result)
  } )


  socket.on('prince', (room, playerAttacked) => {
    let lobby  = findLobby(rooms, room)
    let cardDiscarding = playerAttacked.cardsOnHand[0]
    playerAttacked = discardCard(playerAttacked, cardDiscarding)
    let result
    if(cardDiscarding.card === 'Princess'){
      playerAttacked.isOutOfRound = true
      result = `${playerAttacked.nickname} is out of round`
    } else {
      playerAttacked.cardsOnHand.push(lobby.cards.gameCards[0])
      lobby.cards.gameCards.splice(0, 1)
      result = `${playerAttacked.nickname} is still in this round`
    }
    io.to(room).emit('princeReady', cardDiscarding, playerAttacked, result)
  })


  socket.on('king', (room, playerAttacked) => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    let otherCard = player.cardsOnHand.find(card => card.card !== "King")
    player.cardsOnHand[1] = playerAttacked.cardsOnHand[0]
    playerAttacked.cardsOnHand[0] = otherCard
    player = discardCard(player, findCard(player.cardsOnHand, "King"))
    io.to(socket.id).to(playerAttacked.id).emit('kingReady', player, playerAttacked)
  })


  socket.on('countess', room => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    let card = findCard(player.cardsOnHand, "Countess")
    player = discardCard(player, card) 
    player.hisTurn = false
    // Next player's turn
    io.to(room).emit('countessReady', player)
  })


  socket.on('princess', room => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    for (let i = 0; i < player.cardsOnHand.length; i++) {
      player = discardCard(player, player.cardsOnHand[i])
    }
    let result = `${player.nickname} is out of round because of discarding of Princess`
    player.isOutOfRound = true
    player.hisTurn = false
    io.to(room).emit('princessReady', player, result)
  })

  io.emit('allRooms', rooms)
  socket.on('getPlayers', lobbyName => {
    const players = getUsersInRoom(lobbyName)
    io.emit('players', players)
  })

 

socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`)
    // socket.emit('getRommData')

    //   socket.on('removeUser', room => {
    //     let lobby = rooms.filter(roomValue => roomValue.room == room);
    //     var socket = lobby.players.filter(player => player.id == socket.id)
    //     lobby.players.pop(lobby.players.indexOf(player))
    //   })
   });
});




server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});