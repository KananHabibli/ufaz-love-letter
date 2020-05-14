// JS Map for errors
let errorMap = new Map();

// 100s for lobby errors
errorMap.set(100, "Lobby is full!");
errorMap.set(101, "Lobby has already been created!")
errorMap.set(102, "Lobby doesn't exist")
errorMap.set(103, "Everybody must be ready")

// 200s for player errors
errorMap.set(200, "This nickname is already in use in this lobby!");

module.exports = errorMap