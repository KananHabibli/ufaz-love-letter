var socket = io('/game');

// Elements
const lobbyName = document.getElementById('lobbyName').textContent
const players   = document.getElementById('players')

console.log(lobbyName)
socket.emit('makeGame', () => {
    alert("The game is being created . . . ")
})
socket.emit('getUser', () => {
    console.log('Getting User . . .')
})
socket.on('sendUser', user => {
    console.log(user)
    console.log(lobbyName)
    socket.emit('new-user', lobbyName, user)
})


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