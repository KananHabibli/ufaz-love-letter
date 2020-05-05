const users = []
 
// addUser, removeUser, getUser, getUsersInRoom


const addUser = ({ id, username, room }) => {
    // Validate the data
    if(!username || !room){
        return {
            error: 'Username and lobbyName are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find(user => {
        return user.username === username && user.lobbyName === lobbyName
    })

    // Validate username
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    user.lobbyName = lobbyName
    user.socketID = id
    users.push(user)
    return user 
}

const getUser = id => {
    const user = users.find(user => user.socketID === id)
    return user
}

const getUsersInRoom = lobbyName =>  users.filter(user => user.lobbyName === lobbyName)


module.exports = {
    addUser,
    getUser,
    getUsersInRoom
}