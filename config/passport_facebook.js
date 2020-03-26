const FacebookStrategy = require('passport-facebook').Strategy
const keys = require('./keys')
const User = require('../models/User_facebook')

module.exports = function(passport){
    passport.use(
        new FacebookStrategy(
          {
            clientID: keys.facebookClientID,
            clientSecret: keys.facebookClientSecret,
            callbackURL: '/auth/facebook/callback'
          },
          function(accessToken, refreshToken, profile, done) {
            console.log(profile)
            const newUser = {
              username: profile.displayName,
              image: "/public/Images/profile.jpeg",
              bio: "",
              gamesWon: 0,
              gamesLost: 0
            };
            // Check for existing user
            User.findOne({
              username: profile.displayName
          }).then(user => {
              if(user){
                  // Return user
                  done(null,user)
              } else {
                  // Create user
                  new User(newUser).save()
                      .then(user => done(null,user))
              }
          })
          }
        )
      )
}