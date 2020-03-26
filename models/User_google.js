const mongoose  = require('mongoose')
const validator = require('validator')

    const GoogleUserSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value){
                if (!validator.isEmail(value)){
                    throw new Error('Email is not valid')
                }
            }
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


const GoogleUser = mongoose.model('google_user', GoogleUserSchema)

module.exports = GoogleUser