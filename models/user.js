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
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.statics.authenticate = (email, password, callback) => {
    User.findOne({ email: email })
        .exec((error, user) => {
            if(error) {
                return callback(error);
            } else if(!user) {
                let err = new Error('User not found');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if(result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
};

// Hash password before saving to db with pre-save-hook
// Before mongo saves to db, this function will run
UserSchema.pre('save', (next) => {
    let user = thisM
    //replace the plain text pass with the hash
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

// Add the scehma to mongo
let User = mongoose.model('User', UserSchema);
module.exports = User;