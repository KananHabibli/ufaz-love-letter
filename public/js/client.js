var socket = io();

let players = []

// Elements

// console.log(location.href)
let id = location.href.split("/")
id = id[id.length-1]
// alert(id)

// const findGame = async id => {
//     var game = await fetch(`http://ufaz-love-letter/lobby/${id}`) 
//     return game.json()
// }

fetch(`https://ufaz-love-letter.herokuapp.com/lobby/game/${id}`).then(data => {
    document.getElementById("game").innerHTML = data.json()
    console.log(data)
})

// let game = findGame(id)
socket.emit('join', (user, error) => {
    if(error) alert(error)
})