const randomNumber = size => {
    return Math.floor(Math.random() * size)
}

const shuffleCards = deck => {
    var size = deck.length, temp, index;

    // While there are elements in the array
    for(let i = size - 1; i >= 0; i--) {
        // Pick a random index
        index = randomNumber(i);
        // And swap the last element with it
        temp = deck[i];
        deck[i] = deck[index];
        deck[index] = temp;
    }
    return deck;
}

module.exports = {
    randomNumber,
    shuffleCards
}