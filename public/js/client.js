var socket = io('/game');

// Elements
const lobbyName = document.getElementById('lobbyName').textContent
const players   = document.getElementById('players')

// console.log(lobbyName)

// let id = location.href.split('/')
// id = id[id.length - 1]
// alert(id)

// let Game
// function getGame(id) {
//     return fetch('http://localhost:3001/game/findLobby?id=' + id).then(game => {
//             return game.json()
//         })
// }

// async function assignGame(){
//     Game = await getGame(id);
// }

// console.log(Game)




// document.getElementById('start').addEventListener('click', e => {
    socket.emit('makeGame', () => {
        alert("The game is being created . . . ")
    })
    socket.emit('getUser', () => {
        console.log('Getting User . . .')
    })
    socket.on('sendUser', user => {
        console.log(user)
        socket.emit('new-user', lobbyName, user)
    })
// })


socket.on('send-message', user => {
    var text = document.createTextNode(`${user.user.username} is here`);
    players.appendChild(text);
})


socket.on('user-disconnected', user => {
    confirm(`${user.user.username} disconnected`)
  })


socket.on('gameCreated', function (data) {
    console.log(data)
});