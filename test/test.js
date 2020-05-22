const { randomNumber,
        shuffleCards,
        discardCard,
        findCardIndex,
        findPlayerIndex,
        findPlayerByID,
        findPlayerByName,
        findLobby,
        findCard,
        findCredentials,
        findOwner,
        nextPlayer,
        roundWinner,
        checkCondition,
        checkDiscard,
        checkScores } = require('../utils/utils')
const chai = require('chai') 
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style

describe('Testing utility functions', async function () {
    let lobby = {
        cards: {
            gameCards:[
                {
                    card: "Countess",
                    description: "If a player holds both this card and either the King or Prince card, this card must be played immediately.",
                    strength: 7,
                    _id: "5e6a499968ffad15f470c9e3"
                },
                {
                    card: "King",
                    description: "Player trades hands with any other player.",
                    strength: 6,
                    _id: "5e6a499968ffad15f470c9e2"
                },
                {
                    card: "Prince",
                    description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated",
                    strength: 5,
                    _id: "5e6a499968ffad15f470c9e1"
                },
                {
                    card: "Guard",
                    description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                    strength: 1,
                    _id: "5e6a499968ffad15f470c9d6"
                },
                {
                    card: "Baron",
                    description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                    strength: 3,
                    _id: "5e6a499968ffad15f470c9dd"
                },
                {
                    card: "Guard",
                    description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                    strength: 1,
                    _id: "5e6a499968ffad15f470c9d8"
                },
                {
                    card: "Prince",
                    description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated",
                    strength: 5,
                    _id: "5e6a499968ffad15f470c9e0"
                },
                {
                    card: "Priest",
                    description: "Player is allowed to see another player's hand.",
                    strength: 2,
                    _id: "5e6a499968ffad15f470c9da"
                },
                {
                    card: "Handmaid",
                    description: "Player cannot be affected by any other player's card until the next turn",
                    strength: 4,
                    _id: "5e6a499968ffad15f470c9df"
                },
                {
                    card: "Guard",
                    description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                    strength: 1,
                    _id: "5e6a499968ffad15f470c9d9"
                }
            ],
            discardedCards: [
                {
                    card: "Handmaid",
                    description: "Player cannot be affected by any other player's card until the next turn",
                    strength: 4,
                    _id: "5e6a499968ffad15f470c9de"
                },
                {
                    card: "Princess",
                    description: "If a player plays this card for any reason, they are eliminated from the round.",
                    strength: 8,
                    _id: "5e6a499968ffad15f470c9e4"
                }, 
                {
                    card: "Guard",
                    description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                    strength: 1,
                    _id: "5e6a499968ffad15f470c9d7"
                }
            ],
            distinctCards: [
                {
                    card: "Priest",
                    description: "Player is allowed to see another player's hand.",
                    strength: 2,
                    _id: "5e6a499968ffad15f470c9da"
                },
                {
                    card: "Baron",
                    description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                    strength: 3,
                    _id: "5e6a499968ffad15f470c9dc"
                },
                {
                    card: "Handmaid",
                    description: "Player cannot be affected by any other player's card until the next turn",
                    strength: 4,
                    _id: "5e6a499968ffad15f470c9de"
                },
                {
                    card: "Prince",
                    description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated",
                    strength: 5,
                    _id: "5e6a499968ffad15f470c9e0"
                },
                {
                    card: "King",
                    description: "Player trades hands with any other player.",
                    strength: 6,
                    _id: "5e6a499968ffad15f470c9e2"
                },{
                    card: "Countess",
                    description: "If a player holds both this card and either the King or Prince card, this card must be played immediately.",
                    strength: 7,
                    _id: "5e6a499968ffad15f470c9e3"
                },
                {
                    card: "Princess",
                    description: "If a player plays this card for any reason, they are eliminated from the round.",
                    strength: 8,
                    _id: "5e6a499968ffad15f470c9e4"
                }

            ]
        },
        currentRound: 1,
        game: {playerAttacking: "", playerAttacked: "", cardPlayer: ""},
        goal: 7,
        isFull: false,
        numberOfPlayers: "2",
        numberOfPlayersInRound: 2,
        players: [{
            cardsDiscarded: [],
            cardsOnHand: [{
                card: "Guard",
                description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                strength: 1,
                _id: "5e6a499968ffad15f470c9d5"
            },
            {
                card: "Baron",
                description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                strength: 3,
                _id: "5e6a499968ffad15f470c9dc"
            }],
            hisTurn: true,
            id: "BC8Yv0g60rskRajUAAAA",
            isDoingMove: false,
            isOutOfRound: false,
            isOwner: true,
            isProtected: false,
            nickname: "ExMeliodas",
            roundsWon: 0
        },
        {
            cardsDiscarded: [],
            cardsOnHand: [{
                _id: "5e6a499968ffad15f470c9db",
                card: "Priest",
                strength: 2,
                description: "Player is allowed to see another player's hand."
                }
            ],
            hisTurn: false,
            id: "ebg8hV4s0di4IsDUAAAB",
            isDoingMove: false,
            isOutOfRound: false,
            isOwner: false,
            isProtected: false,
            nickname: "Ban",
            roundsWon: 0
        }
    ],
        room: "Love Letter"
    }
    it("should return card index in the player's hand ", function () {
        let cardIndex = findCardIndex(lobby.cards.gameCards, "Countess")
        let expectedOutput = 0
        assert.equal(cardIndex, expectedOutput)
    })

    it("should return card itself in the player's hand ", function () {
        let card = findCard(lobby.players[0].cardsOnHand, "Guard")
        let expectedOutput = {
            card: "Guard",
            description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
            strength: 1,
            _id: "5e6a499968ffad15f470c9d5"
        }
        assert.deepEqual(card, expectedOutput)
    })

    it("should return player index in the lobby ", function () {
        let playerIndex = findPlayerIndex("ExMeliodas",lobby.players)
        let expectedOutput = 0
        assert.deepEqual(playerIndex, expectedOutput)
    })

    it("should find player by ID in the lobby ", function () {
        let player = findPlayerByID(lobby, "ebg8hV4s0di4IsDUAAAB")
        let expectedOutput = {
            cardsDiscarded: [],
            cardsOnHand: [{
                _id: "5e6a499968ffad15f470c9db",
                card: "Priest",
                strength: 2,
                description: "Player is allowed to see another player's hand."
                }
            ],
            hisTurn: false,
            id: "ebg8hV4s0di4IsDUAAAB",
            isDoingMove: false,
            isOutOfRound: false,
            isOwner: false,
            isProtected: false,
            nickname: "Ban",
            roundsWon: 0
        }
        assert.deepEqual(player, expectedOutput)
    })
    it("should return a boolean whether it find a boolean or not", function(){
        let result = checkScores(lobby)
        let expectedOutput = false
        assert.equal(result, expectedOutput)
    })

    it("should find player by ID in the lobby ", function () {
        let player = discardCard({
            cardsDiscarded: [],
            cardsOnHand: [{
                card: "Guard",
                description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                strength: 1,
                _id: "5e6a499968ffad15f470c9d5"
            },
            {
                card: "Baron",
                description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                strength: 3,
                _id: "5e6a499968ffad15f470c9dc"
            }],
            hisTurn: true,
            id: "BC8Yv0g60rskRajUAAAA",
            isDoingMove: false,
            isOutOfRound: false,
            isOwner: true,
            isProtected: false,
            nickname: "ExMeliodas",
            roundsWon: 0
        }, {
            card: "Baron",
            description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
            strength: 3,
            _id: "5e6a499968ffad15f470c9dc"
        })
        let expectedOutput = {
            cardsDiscarded: [{
                card: "Baron",
                description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                strength: 3,
                _id: "5e6a499968ffad15f470c9dc"
            }],
            cardsOnHand: [{
                card: "Guard",
                description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                strength: 1,
                _id: "5e6a499968ffad15f470c9d5"
            }],
            hisTurn: true,
            id: "BC8Yv0g60rskRajUAAAA",
            isDoingMove: false,
            isOutOfRound: false,
            isOwner: true,
            isProtected: false,
            nickname: "ExMeliodas",
            roundsWon: 0
        }
        assert.deepEqual(player, expectedOutput)
    })

    it("should find player by nickname in the lobby ", function () {
        let player = findPlayerByName(lobby, "Ban")
        let expectedOutput = {
            cardsDiscarded: [],
            cardsOnHand: [{
                _id: "5e6a499968ffad15f470c9db",
                card: "Priest",
                strength: 2,
                description: "Player is allowed to see another player's hand."
                }
            ],
            hisTurn: false,
            id: "ebg8hV4s0di4IsDUAAAB",
            isDoingMove: false,
            isOutOfRound: false,
            isOwner: false,
            isProtected: false,
            nickname: "Ban",
            roundsWon: 0
        }
        assert.deepEqual(player, expectedOutput)
    })
    it("should return the player who will start the next round first", function () {
        let player = findOwner(lobby.players)
        let expectedOutput = {
            cardsDiscarded: [],
            cardsOnHand: [{
                card: "Guard",
                description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                strength: 1,
                _id: "5e6a499968ffad15f470c9d5"
            },
            {
                card: "Baron",
                description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                strength: 3,
                _id: "5e6a499968ffad15f470c9dc"
            }],
            hisTurn: true,
            id: "BC8Yv0g60rskRajUAAAA",
            isDoingMove: false,
            isOutOfRound: false,
            isOwner: true,
            isProtected: false,
            nickname: "ExMeliodas",
            roundsWon: 0
        }
        assert.deepEqual(player, expectedOutput)
    })
    it("should return the next player in the round", function () {
        let result = nextPlayer(lobby, {
            cardsDiscarded: [],
            cardsOnHand: [{
                card: "Guard",
                description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                strength: 1,
                _id: "5e6a499968ffad15f470c9d5"
            },
            {
                card: "Baron",
                description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                strength: 3,
                _id: "5e6a499968ffad15f470c9dc"
            }],
            hisTurn: true,
            id: "BC8Yv0g60rskRajUAAAA",
            isDoingMove: false,
            isOutOfRound: false,
            isOwner: true,
            isProtected: false,
            nickname: "ExMeliodas",
            roundsWon: 0
        })
        let expectOutput = {
            nextLobby: {
                cards: {
                    gameCards:[
                        {
                            card: "King",
                            description: "Player trades hands with any other player.",
                            strength: 6,
                            _id: "5e6a499968ffad15f470c9e2"
                        },
                        {
                            card: "Prince",
                            description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated",
                            strength: 5,
                            _id: "5e6a499968ffad15f470c9e1"
                        },
                        {
                            card: "Guard",
                            description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                            strength: 1,
                            _id: "5e6a499968ffad15f470c9d6"
                        },
                        {
                            card: "Baron",
                            description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                            strength: 3,
                            _id: "5e6a499968ffad15f470c9dd"
                        },
                        {
                            card: "Guard",
                            description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                            strength: 1,
                            _id: "5e6a499968ffad15f470c9d8"
                        },
                        {
                            card: "Prince",
                            description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated",
                            strength: 5,
                            _id: "5e6a499968ffad15f470c9e0"
                        },
                        {
                            card: "Priest",
                            description: "Player is allowed to see another player's hand.",
                            strength: 2,
                            _id: "5e6a499968ffad15f470c9da"
                        },
                        {
                            card: "Handmaid",
                            description: "Player cannot be affected by any other player's card until the next turn",
                            strength: 4,
                            _id: "5e6a499968ffad15f470c9df"
                        },
                        {
                            card: "Guard",
                            description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                            strength: 1,
                            _id: "5e6a499968ffad15f470c9d9"
                        }
                    ],
                    discardedCards: [
                        {
                            card: "Handmaid",
                            description: "Player cannot be affected by any other player's card until the next turn",
                            strength: 4,
                            _id: "5e6a499968ffad15f470c9de"
                        },
                        {
                            card: "Princess",
                            description: "If a player plays this card for any reason, they are eliminated from the round.",
                            strength: 8,
                            _id: "5e6a499968ffad15f470c9e4"
                        }, 
                        {
                            card: "Guard",
                            description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                            strength: 1,
                            _id: "5e6a499968ffad15f470c9d7"
                        }
                    ],
                    distinctCards: [
                        {
                            card: "Priest",
                            description: "Player is allowed to see another player's hand.",
                            strength: 2,
                            _id: "5e6a499968ffad15f470c9da"
                        },
                        {
                            card: "Baron",
                            description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                            strength: 3,
                            _id: "5e6a499968ffad15f470c9dc"
                        },
                        {
                            card: "Handmaid",
                            description: "Player cannot be affected by any other player's card until the next turn",
                            strength: 4,
                            _id: "5e6a499968ffad15f470c9de"
                        },
                        {
                            card: "Prince",
                            description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated",
                            strength: 5,
                            _id: "5e6a499968ffad15f470c9e0"
                        },
                        {
                            card: "King",
                            description: "Player trades hands with any other player.",
                            strength: 6,
                            _id: "5e6a499968ffad15f470c9e2"
                        },{
                            card: "Countess",
                            description: "If a player holds both this card and either the King or Prince card, this card must be played immediately.",
                            strength: 7,
                            _id: "5e6a499968ffad15f470c9e3"
                        },
                        {
                            card: "Princess",
                            description: "If a player plays this card for any reason, they are eliminated from the round.",
                            strength: 8,
                            _id: "5e6a499968ffad15f470c9e4"
                        }
        
                    ]
                },
                currentRound: 1,
                game: {playerAttacking: "", playerAttacked: "", cardPlayer: ""},
                goal: 7,
                isFull: false,
                numberOfPlayers: "2",
                numberOfPlayersInRound: 2,
                players: [{
                    cardsDiscarded: [],
                    cardsOnHand: [{
                        card: "Guard",
                        description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                        strength: 1,
                        _id: "5e6a499968ffad15f470c9d5"
                    },
                    {
                        card: "Baron",
                        description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                        strength: 3,
                        _id: "5e6a499968ffad15f470c9dc"
                    }],
                    hisTurn: true,
                    id: "BC8Yv0g60rskRajUAAAA",
                    isDoingMove: false,
                    isOutOfRound: false,
                    isOwner: true,
                    isProtected: false,
                    nickname: "ExMeliodas",
                    roundsWon: 0
                },
                {
                    cardsDiscarded: [],
                    cardsOnHand: [{
                        _id: "5e6a499968ffad15f470c9db",
                        card: "Priest",
                        strength: 2,
                        description: "Player is allowed to see another player's hand."
                        },
                        {
                            card: "Countess",
                            description: "If a player holds both this card and either the King or Prince card, this card must be played immediately.",
                            strength: 7,
                            _id: "5e6a499968ffad15f470c9e3"
                        }
                    ],
                    hisTurn: true,
                    id: "ebg8hV4s0di4IsDUAAAB",
                    isDoingMove: false,
                    isOutOfRound: false,
                    isOwner: false,
                    isProtected: false,
                    nickname: "Ban",
                    roundsWon: 0
                }
            ],
                room: "Love Letter"
            },
            nextIndex: 1,
            result: "Round is on"
        }
        assert.deepEqual(result, expectOutput)
    })
        it("should return the round winner", function () {
            let result = roundWinner(lobby)
            let expectOutput = {
                lobby: {
                    cards: {
                        gameCards:[
                            {
                                card: "King",
                                description: "Player trades hands with any other player.",
                                strength: 6,
                                _id: "5e6a499968ffad15f470c9e2"
                            },
                            {
                                card: "Prince",
                                description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated",
                                strength: 5,
                                _id: "5e6a499968ffad15f470c9e1"
                            },
                            {
                                card: "Guard",
                                description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                                strength: 1,
                                _id: "5e6a499968ffad15f470c9d6"
                            },
                            {
                                card: "Baron",
                                description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                                strength: 3,
                                _id: "5e6a499968ffad15f470c9dd"
                            },
                            {
                                card: "Guard",
                                description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                                strength: 1,
                                _id: "5e6a499968ffad15f470c9d8"
                            },
                            {
                                card: "Prince",
                                description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated",
                                strength: 5,
                                _id: "5e6a499968ffad15f470c9e0"
                            },
                            {
                                card: "Priest",
                                description: "Player is allowed to see another player's hand.",
                                strength: 2,
                                _id: "5e6a499968ffad15f470c9da"
                            },
                            {
                                card: "Handmaid",
                                description: "Player cannot be affected by any other player's card until the next turn",
                                strength: 4,
                                _id: "5e6a499968ffad15f470c9df"
                            },
                            {
                                card: "Guard",
                                description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                                strength: 1,
                                _id: "5e6a499968ffad15f470c9d9"
                            }
                        ],
                        discardedCards: [
                            {
                                card: "Handmaid",
                                description: "Player cannot be affected by any other player's card until the next turn",
                                strength: 4,
                                _id: "5e6a499968ffad15f470c9de"
                            },
                            {
                                card: "Princess",
                                description: "If a player plays this card for any reason, they are eliminated from the round.",
                                strength: 8,
                                _id: "5e6a499968ffad15f470c9e4"
                            }, 
                            {
                                card: "Guard",
                                description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                                strength: 1,
                                _id: "5e6a499968ffad15f470c9d7"
                            }
                        ],
                        distinctCards: [
                            {
                                card: "Priest",
                                description: "Player is allowed to see another player's hand.",
                                strength: 2,
                                _id: "5e6a499968ffad15f470c9da"
                            },
                            {
                                card: "Baron",
                                description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                                strength: 3,
                                _id: "5e6a499968ffad15f470c9dc"
                            },
                            {
                                card: "Handmaid",
                                description: "Player cannot be affected by any other player's card until the next turn",
                                strength: 4,
                                _id: "5e6a499968ffad15f470c9de"
                            },
                            {
                                card: "Prince",
                                description: "Player can choose any player (including themselves) to discard their hand and draw a new one. If the discarded card is the Princess, the discarding player is eliminated",
                                strength: 5,
                                _id: "5e6a499968ffad15f470c9e0"
                            },
                            {
                                card: "King",
                                description: "Player trades hands with any other player.",
                                strength: 6,
                                _id: "5e6a499968ffad15f470c9e2"
                            },{
                                card: "Countess",
                                description: "If a player holds both this card and either the King or Prince card, this card must be played immediately.",
                                strength: 7,
                                _id: "5e6a499968ffad15f470c9e3"
                            },
                            {
                                card: "Princess",
                                description: "If a player plays this card for any reason, they are eliminated from the round.",
                                strength: 8,
                                _id: "5e6a499968ffad15f470c9e4"
                            }
            
                        ]
                    },
                    currentRound: 1,
                    game: {playerAttacking: "", playerAttacked: "", cardPlayer: ""},
                    goal: 7,
                    isFull: false,
                    numberOfPlayers: "2",
                    numberOfPlayersInRound: 2,
                    players: [{
                        cardsDiscarded: [],
                        cardsOnHand: [{
                            card: "Guard",
                            description: "Player designates another player and names a type of card. If that player's hand matches the type of card specified, that player is eliminated from the round. However, Guard cannot be named as the type of card.",
                            strength: 1,
                            _id: "5e6a499968ffad15f470c9d5"
                        },
                        {
                            card: "Baron",
                            description: "Player will choose another player and privately compare hands. The player with the lower-strength hand is eliminated from the round.",
                            strength: 3,
                            _id: "5e6a499968ffad15f470c9dc"
                        }],
                        hisTurn: true,
                        id: "BC8Yv0g60rskRajUAAAA",
                        isDoingMove: false,
                        isOutOfRound: false,
                        isOwner: false,
                        isProtected: false,
                        nickname: "ExMeliodas",
                        roundsWon: 0
                    },
                    {
                        cardsDiscarded: [],
                        cardsOnHand: [{
                            _id: "5e6a499968ffad15f470c9db",
                            card: "Priest",
                            strength: 2,
                            description: "Player is allowed to see another player's hand."
                            },

                            {
                                card: "Countess",
                                description: "If a player holds both this card and either the King or Prince card, this card must be played immediately.",
                                strength: 7,
                                _id: "5e6a499968ffad15f470c9e3"
                            },
                        ],
                        hisTurn: true,
                        id: "ebg8hV4s0di4IsDUAAAB",
                        isDoingMove: false,
                        isOutOfRound: false,
                        isOwner: true,
                        isProtected: false,
                        nickname: "Ban",
                        roundsWon: 1
                    }
                ],
                    room: "Love Letter"
                },
                winner : {
                    cardsDiscarded: [],
                    cardsOnHand: [{
                        _id: "5e6a499968ffad15f470c9db",
                        card: "Priest",
                        strength: 2,
                        description: "Player is allowed to see another player's hand."
                        },

                        {
                            card: "Countess",
                            description: "If a player holds both this card and either the King or Prince card, this card must be played immediately.",
                            strength: 7,
                            _id: "5e6a499968ffad15f470c9e3"
                        }
                    ],
                    hisTurn: true,
                    id: "ebg8hV4s0di4IsDUAAAB",
                    isDoingMove: false,
                    isOutOfRound: false,
                    isOwner: true,
                    isProtected: false,
                    nickname: "Ban",
                    roundsWon: 1
                }
            }
        assert.deepEqual(result, expectOutput)
    })
})