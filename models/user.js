const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema setup
let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 15
    },
    password: {
        type: String,
        required: true
    },
    gamesPlayed: {
        type: Number
    },
    wrongWords: {
        type: Number
    },
    perfectGames: {
        type: Number
    }
});

UserSchema.statics.authenticate = (email, password, callback) => {
    User.findOne({ email })
        .exec((error, user) => {
            if (error)
                return error;
            else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return err;
            }
            //plain text password, hashed password and a callback function
            bcrypt.compare(password, user.password, (err, result) => {
                if (result === false)
                    return err;
                else
                    return callback();
            });
        });
}

UserSchema.pre('save', function(next) {
    let user = this;
    //replace the plain text pass with the hash
    //should not hardcode salt
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err)
            return next(err);

        user.password = hash;
        next();
    });
});
// add the schema to mongo
let User = mongoose.model('User', UserSchema);
module.exports = User;
