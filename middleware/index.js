function loggedOut(req, res, next) {
    //if the user is logged in, redirect to profile
    if(req.session && req.session.userId) {
        //CHANGE ROUTE
        return res.redirect('/profile');
    } else {
        //if not, return to next middleware
        return next();
    }
}

module.exports.loggedOut = loggedOut;