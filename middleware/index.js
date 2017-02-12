function loggedOut(req, res, next) {
    //if the user is logged in, redirect to game
    if(req.session && req.session.userId) {
        return res.redirect('/game');
    } else {
        //if not, return to next middleware
        return next();
    }
}

module.exports.loggedOut = loggedOut;