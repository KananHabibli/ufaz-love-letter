var socket = io();

let players = []

// Elements

// console.log(location.href)

socket.emit('join', (user, error) => {
    if(error) alert(error)
})