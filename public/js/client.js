var socket = io('/game');

// Elements
const players   = document.getElementById('players')

// Parsing the query string
// Options
const { nickname, room, number } = Qs.parse(location.search, {ignoreQueryPrefix : true})
// alert(nickname + room + number)


socket.on('sendUser', user => {
    console.log(user)
    console.log(lobbyName)
    socket.emit('new-user', room, nickname)
})


socket.emit('new-user', room, nickname, number)

socket.on('send-first-message', ( newPlayer, lobby,  status, rooms) => {
    var text = document.createTextNode(`Status : ${status} `);
    players.appendChild(text);
    text = document.createTextNode(`Player : ${newPlayer.nickname} `);
    players.appendChild(text);
    text = document.createTextNode(`Lobby : ${lobby.room} `);
    players.appendChild(text);
    console.log(rooms)
})


socket.on('allRooms', rooms => {
    alert(rooms)
})

socket.emit('removeUser',room, () => {
    confirm(`${nickname} disconnected`)
})


