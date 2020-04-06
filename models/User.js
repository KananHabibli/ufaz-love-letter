const mongoose  = require('mongoose')
const validator = require('validator')
const bcrypt    = require('bcrypt')

const UserSchema = new mongoose.Schema({
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
    password: {
        type: String,
        trim: true,
        minlength: 7,
        validate(value){
            if ( validator.contains('password',value)){
                throw new Error('Password can not contain the word password')
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

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
  }


const User = mongoose.model('users', UserSchema)

module.exports = User