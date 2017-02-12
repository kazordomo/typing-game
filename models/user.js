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
            if (error) {
                return callback(error);
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            //plain text password, hashed password and a callback function
            bcrypt.compare(password, user.password, (err, result) => {
                if (result === true) {
                    //the callbacks first argument is error. if no error, return error == null
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
}

//arrow-function gives error
UserSchema.pre('save', function(next) {
    //user object and ts data
    let user = this;
    console.log(user);
    //replace the plain text pass with the hash
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        //calls the next middleware in the stack
        next();
    });
});
// add the schema to mongo
let User = mongoose.model('User', UserSchema);
module.exports = User;
