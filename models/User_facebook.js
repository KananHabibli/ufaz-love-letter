const mongoose  = require('mongoose')

const FacebookUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    image: {
        type: String
    },
    bio: {
        type: String
    },
    gamesWon: {
        type: Number
    },
    gamesLost: {
        type: Number
    }
    },
    {
        timestamps: true
    }
)

const FacebookUser = mongoose.model('facebook_user', FacebookUserSchema)

module.exports = FacebookUser