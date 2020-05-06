let lobbies = require('../routes/game').lobbies

const getUserRooms = socket => {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.users[socket.id] != null) names.push(name)
      return names
    }, [])
}


module.exports = {
    getUserRooms
}