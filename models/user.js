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

/*  REGULAR
 ------------------------------------------------------------*/
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({ email: email })
        .exec(function (error, user) {
            if (error) {
                return callback(error);
            } else if ( !user ) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            //plain text password, hashed password and a callback function
            bcrypt.compare(password, user.password, function(err, result) {
                if (result === true) {
                    //the callbacks first argument is error. if no error, return error == null
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
}

UserSchema.pre('save', function(next) {
    //user object and ts data
    var user = this;
    console.log(user);
    //replace the plain text pass with the hash
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        //calls the next middleware in the stack
        next();
    });
});
// add the schema to mongo
var User = mongoose.model('User', UserSchema);
module.exports = User;


/*  ES6, THROWS ERROR. FIX PL0X
 ------------------------------------------------------------*/

// UserSchema.statics.authenticate = function(email, password, callback) {
//     User.findOne({ email: email })
//         .exec(function (error, user) {
//             if (error) {
//                 return callback(error);
//             } else if ( !user ) {
//                 var err = new Error('User not found.');
//                 err.status = 401;
//                 return callback(err);
//             }
//             //plain text password, hashed password and a callback function
//             bcrypt.compare(password, user.password, function(err, result) {
//                 if (result === true) {
//                     //the callbacks first argument is error. if no error, return error == null
//                     return callback(null, user);
//                 } else {
//                     return callback();
//                 }
//             });
//         });
// }
//
// // Hash password before saving to db with pre-save-hook
// // Before mongo saves to db, this function will run
// UserSchema.pre('save', (next) => {
//     let user = this;
//     console.log(user);
//     //replace the plain text pass with the hash
//     bcrypt.hash(user.password, 10, (err, hash) => {
//         if(err) {
//             return next(err);
//         }
//         user.password = hash;
//         next();
//     });
// });
//
// // Add the scehma to mongo
// let User = mongoose.model('User', UserSchema);
// module.exports = User;