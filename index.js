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

// Session Middleware //secure: true
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'loveLetter',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { }
// }))

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

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

app.use(cors()) 

// Load routes
const auth = require('./routes/auth')
const db = require('./routes/db')
const game = require('./routes/game')

// Use routes
app.use(auth)
app.use(db)
app.use(game)

// const socket = io.connect('http://localhost:3001');
// console.log(io)


app.get('/', (req, res) => {
  res.render('index/home')
})

io.on('connection', function(socket){
  console.log('a user connected', socket.id);
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});