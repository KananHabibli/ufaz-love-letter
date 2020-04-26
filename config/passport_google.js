const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('./keys')
const User = require('../models/User_google')
const sendEmail = require('../mails/mail')

module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            const image = profile.photos[0].value
            const newUser = {
                username: profile.displayName,
                email: profile.emails[0].value,
                image,
                bio: "",
                gamesWon: 0,
                gamesLost: 0
            }
            // Check for existing user
            User.findOne({
                email: profile.emails[0].value
            }).then(user => {
                if(user){
                    // Return user
                    done(null,user)
                } else {
                    // Create user
                    new User(newUser).save()
                        .then(user =>{
                            sendEmail(user)
                            done(null,user)
                        })
                }
            })
        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user)
    })
      
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(user => done(null,user))
    })
}