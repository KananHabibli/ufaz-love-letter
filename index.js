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

const port = process.env.PORT || 3001;

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

const { getUserRooms } = require('./utils/rooms')
const { randomNumber } = require('./utils/utils')

app.get('/',function(req,res) {
    res.sendFile('index.html');
  });


// JS Map for errors
// 100s for lobby errors
// 200s for player errors
let errorMap = new Map();
errorMap.set(100, "Lobby is full!");
errorMap.set(101, "Lobby has already created!")
errorMap.set(102, "Lobby doesn't exist")
errorMap.set(200, "This nickname is already in use in this lobby!");
let rooms = []

nsp.on('connection', function(socket){
  console.log('a user connected', socket.id);
  nsp.emit('allRooms', rooms)
  socket.on('new-user', async (room, nickname, number) => {
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
    let lobby = rooms.find(roomValue => roomValue.room == room)
    if(lobby && number !== null){
      socket.emit('throwError', errorMap.get(101))
    }
    if(lobby){
        let index = rooms.indexOf(lobby)
        if(rooms[index].isFull == false){
          rooms[index].players.push(newPlayer)
          lobby = rooms[index]
          status = "existed"
          socket.join(room)
          if(rooms[index].players.length == parseInt(rooms[index].numberOfPlayers)){
            rooms[index].isFull = true
          }
          nsp.emit('send-first-message', newPlayer, lobby,  status, rooms)
        } else {
          nsp.emit('throwError', errorMap.get(102))
        }
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
      if(number == 4){
          goal = 4
          let rand = randomNumber(deck.length)
          discardedCards.push(deck[rand])
          deck.splice(rand, 1)
      }else if(number == 3){
          goal = 5
          let rand = randomNumber(deck.length)
          discardedCards.push(deck[rand])
          deck.splice(rand, 1)
      }else if(number == 2){
          goal = 7
          for(let i = 0; i < 3; i++){
              let rand = randomNumber(deck.length)
              discardedCards.push(deck[rand])
              deck.splice(rand, 1)
          }
      }
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
    nsp.emit('send-first-message', newPlayer, lobby,  status, rooms)
    } else {
      nsp.emit('throwError', errorMap.get(102))
    }
  })
  socket.on('getPlayers', lobbyName => {
    const players = getUsersInRoom(lobbyName)
    nsp.emit('players', players)
  })

  socket.on('disconnect', () => {
      socket.on('removeUser', room => {
        let lobby = rooms.filter(roomValue => roomValue.room == room);
        var socket = lobby.players.filter(player => player.id == socket.id)
        lobby.players.pop(lobby.players.indexOf(player))
      })
   });
});




server.listen(port, () => {
  console.log(`Server is up on ${port}`);
  fs.writeFile(__dirname + '/start.log', 'started', (err, result) => {
    if(err) console.log('error', err);
  });
});