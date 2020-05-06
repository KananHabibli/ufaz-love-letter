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

// Map global promises
mongoose.promise = global.Promise

// Database Connection
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.set('useCreateIndex', true);

// Session
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

// Session Middleware //secure: true
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  store: new MongoStore({ 
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60 }),
  secret: 'loveLetter',
  resave: false,
  saveUninitialized: false
}))

// Built-in node package for working with file and directory paths
const path = require('path')

// Static public directory
app.use(express.static(path.join(__dirname, 'public')))

// Passportjs
const passport = require('passport')

// Passport Config
require('./config/passport_google')(passport)
require('./config/passport_facebook')(passport)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

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

// Models
// require('./models/Cards')
require('./models/User')
require('./models/User_google')
const Cards = require('./models/Cards')
const Game = require('./models/Game')
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


// Load routes
const auth = require('./routes/auth')
const db = require('./routes/db')
const game = require('./routes/game')

// Use routes
app.use(auth)
app.use(db)
app.use(game)

let userData
app.get('/', (req, res) => {
  userData = req.session
  console.log(lobbies)
  res.render('index/home')
})

app.get('/session', (req, res) => {
  res.json(req.session)
})

let lobbies = {}

app.post('/createLobby', (req, res) => {
    if(!req.body.lobbyName || !req.body.number){
        res.json({message: "You haven't entered lobby name"})
    }

    if (lobbies[req.body.lobbyName] != null) {
        return res.redirect('/')
    }

    lobbies[req.body.lobbyName] = { users: {} }
    console.log(lobbies)
    let number = req.body.number

    Cards.find({}).then(deck => {
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
        let discardedCards= []
        let goal
        if(number == 4){
            goal = 4
        }else if(number == 3){
            goal = 5
        }else if(number == 2){
            goal = 7
            for(let i = 0; i < 3; i++){
                let rand = randomNumber(deck.length)
                discardedCards.push(deck[rand])
                deck.splice(rand, 1)
            }
        }
        let newGame = new Game({
            lobbyName: req.body.lobbyName,
            lobbyPassword: req.body.lobbyPassword,
            players:[{
                ...req.session,
                turn: true,
                outOfRound: false,
                roundsWon: 0,
                currentCards: [],
                discardedCards: []}],
            distinctCards,
            discardedCards,
            theWholeDeck: deck,
            goal
        })

        newGame.save().then(game => {
            res.redirect(`/game/lobby/${game.id}`)
        }).catch(e => {
            res.json({
                message: "There has been an error while creating the game lobby!!" + e
            })
        })
    }).catch(e => {
        res.json({
            message: "The deck can't be fetched!!" + e
        })
    })
})

app.get('/joinLobby', (req, res) => {
    res.render('index/joinLobby')
})

app.post('/joinLobby', async (req, res) => {
    if(req.body.lobbyName){
        const lobbyName = req.body.lobbyName
        const lobbyPassword = req.body.lobbyPassword
        let game = await Game.findOne({lobbyPassword, lobbyName})
        game.players.push({
            ...req.session,
            turn: false,
            outOfRound: false,
            roundsWon: 0,
            currentCards: [],
            discardedCards: []})
        game.save().then(game => {
            res.redirect(`/game/lobby/${game.id}`)
        }).catch(e => {
            return res.json({
                message: "There has been a problem while joining the lobby"
            })
        })
    } else {
        res.json({
            message: "Please enter a lobby name"
        })
    }
})

app.get("/game/lobby/:id", (req, res) => {
    Game.findOne({
        _id: req.params.id
    }).then(game => {
        res.render('index/lobby', {
            lobbyName: game.lobbyName
        })
    })
})

app.get('/game/findLobby', (req, res) => {
    if(!req.query.id){
        return res.json({
            message: 'Query string should be added!!!'
        })
    }
    let id = req.query.id
    Game.findOne({_id: id}).then(game => {
        res.json(game)
    })

})


const { getUserRooms } = require('./utils/users')

nsp.on('connection', function(socket){
  console.log('a user connected', socket.id);
  
  socket.on('getUser', function(){
    nsp.emit('sendUser', userData)
  })
  socket.on('new-user', (lobby, user) => {
    console.log(lobby)
    socket.join(lobby)
    lobbies[lobby].users[socket.id] = user
    socket.emit('send-message', user)
  })
  socket.on('getPlayers', lobbyName => {
    const players = getUsersInRoom(lobbyName)
    nsp.emit('players', players)
  })

  socket.on('disconnect', () => {
    // getUserRooms(socket).forEach(lobby => {
    //   socket.to(lobby).broadcast.emit('user-disconnected', lobbies[lobby].users[socket.id])
    //   delete lobbies[lobby].users[socket.id]
    // })
    console.log('A user disconnected')
   });
});




server.listen(port, () => {
  console.log(`Server is up on ${port}`);
  fs.writeFile(__dirname + '/start.log', 'started', (err, result) => {
    if(err) console.log('error', err);
  });
});