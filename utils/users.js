let lobbies = require('../routes/game').lobbies

const getUserRooms = socket => {
    return Object.entries(lobbies).reduce((names, [name, lobby]) => {
      if (lobbies.users[socket.id] != null) names.push(name)
      return names
    }, [])
}


module.exports = {
    getUserRooms
}