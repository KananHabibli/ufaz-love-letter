var socket = io('/game');

// Elements
const players  = document.getElementById('players')

// Parsing the query string
const { nickname, room, number } = Qs.parse(location.search, {ignoreQueryPrefix : true})

console.log(number)

socket.emit('new-user', room, nickname, number)

socket.on('send-first-message', ( newPlayer, lobby,  status, rooms) => {
    var tag = document.createElement("p");
    var text = document.createTextNode(`Status : ${status} Player : ${newPlayer.nickname} Lobby : ${lobby.room} `);
    tag.appendChild(text);
    players.appendChild(tag)
    console.log(rooms)
})


socket.on('throwError', error => {
    alert(error)
})

// socket.on('allRooms', rooms => console.log(rooms))


socket.emit('removeUser',room, () => {
    confirm(`${nickname} disconnected`)
})


