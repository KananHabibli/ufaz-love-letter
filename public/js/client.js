var socket = io('/game');

// Elements
const lobbyName = document.getElementById('lobbyName')
const players   = document.getElementById('players')

let id = location.href.split('/')
id = id[id.length - 1]
alert(id)

let Game
function getGame(id) {
    return fetch('http://localhost:3001/game/findLobby?id=' + id).then(game => {
            return game.json()
        })
}

async function assignGame(){
    Game = await getGame(id);
}

console.log(Game)

// let Game = fetch('http://localhost:3001/game/findLobby?id=' + id).then(game => {
//     return game
// })


document.getElementById('start').addEventListener('click', e => {
    socket.emit('makeGame', () => {
        alert("The game is being created . . . ")
    })
    socket.emit('getUser', () => {
        console.log('Getting User . . .')
    })
    socket.on('sendUser', user => {
        console.log(user)
        socket.emit('join', {lobbyName, user}, error => {
            if(error) alert(error)
        })
    })
})




socket.on('gameCreated', function (data) {
    console.log(data)
});