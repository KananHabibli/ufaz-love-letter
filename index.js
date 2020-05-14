// Express Server
const express = require('express')
const app = express()
var cors = require('cors')

// socket.io
const socketio = require('socket.io')
const server = require('http').createServer(app)
const io = socketio(server)
const nsp = io.of('/game')

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

const port = process.env.PORT || 4000;

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
nsp.on('connection', function(socket){
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
        isProtected: false
    }
    let status
    // Looking for the lobby
    let lobby = findLobby(rooms, room)
    // Checking whether the lobby to-be-created has already been created or not
    if(lobby && number !== null){
      nsp.to(socket.id).emit('throwError', 101)
      return
    }
    // Checking if lobby exist or not
    if(lobby){
      let index = rooms.indexOf(lobby)
      // Checking if lobby is full or not
      if(rooms[index].isFull == false){
        // Checking if the nickname of the player is in use or not
        if(rooms[index].players.some(player => player.nickname === nickname)){
          nsp.to(socket.id).emit('throwError', 200)
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
          nsp.to(room).emit('send-first-message', newPlayer, lobby,  status, rooms)
        }
      } else {
        nsp.to(socket.id).emit('throwError', 100)
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
    nsp.to(room).emit('send-first-message', newPlayer, lobby,  status, rooms)
    } else {
      nsp.to(socket.id).emit('throwError', 102)
    }
  })


  socket.on('drawCard', (room) => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    player.cardsOnHand.push(lobby.cards.gameCards[0])
    lobby.cards.gameCards.splice(0, 1)
    nsp.to(room).emit('drawnCardReady', player, lobby)
  })


  socket.on('discardCard', (room, card) => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    // card   = findCard(player.cardsOnHand, card)
    player = discardCard(player, player.cardsOnHand[0])
    nsp.to(room).emit('discardedCardReady', player)
  })


  socket.on('guard', (room, playerAttacking, guess, playerAttacked) => {
    // If guess is right
    let result
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
    nsp.to(socket.id).emit('guardReady', playerAttacking, playerAttacked, result)
  })


  socket.on('priest', playerAttacked => {
    nsp.to(socket.id).emit('priestReady', playerAttacked.cardsOnHand[0])
  })


  socket.on('handmaid', room => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    let card = findCard(player.cardsOnHand, "HandMaid")
    player.isProtected = true
    player = discardedCard(player, card)
    nsp.to(socket.id).emit('handmaidReady', player)
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
    nsp.to(room).emit("baronReady", player, playerAttacked, result)
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
    nsp.to(room).emit('princeReady', cardDiscarding, playerAttacked, result)
  })


  socket.on('king', (room, playerAttacked) => {
    let lobby  = findLobby(rooms, room)
    let player = findPlayerByID(lobby, socket.id)
    let otherCard = player.cardsOnHand.find(card => card.card !== "King")
    player.cardsOnHand[1] = playerAttacked.cardsOnHand[0]
    playerAttacked.cardsOnHand[0] = otherCard
    player = discardCard(player, findCard(player.cardsOnHand, "King"))
    nsp.to(socket.id).to(playerAttacked.id).emit('kingReady', player, playerAttacked)
  })


  nsp.emit('allRooms', rooms)
  socket.on('getPlayers', lobbyName => {
    const players = getUsersInRoom(lobbyName)
    nsp.emit('players', players)
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