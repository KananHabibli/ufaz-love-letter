// Express Server
const express = require('express')
const app = express()
var cors = require('cors')

// socket.io
const socketio = require('socket.io')
const server = require('http').createServer(app)
const io = socketio(server)

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

// Models
// require('./models/Cards')
require('./models/User')
require('./models/User_google')

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


app.get('/', (req, res) => {
  // console.log(req.session)
  res.render('index/home')
})

app.get('/session', (req, res) => {
  res.json(req.session)
})

io.on('connection', function(socket){
  console.log('a user connected', socket.id);
  socket.emit('join', (game, error) => {
    
})
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});


server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});