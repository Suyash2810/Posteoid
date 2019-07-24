const jwt = require('jsonwebtoken');
const {
    User
} = require('../models/user');

var authentication = (request, response, next) => {

    let authToken = request.cookies.authAccessJWT;
    console.log(authToken);

    if (!authToken) {
        // response.status(401).send(new Error("User is not authorized. Token does not exist."));
        // request.error = new Error("User is not authorized. Token does not exist.");
        response.redirect('/auth/login');
        next();
    } else {

        let token = jwt.verify(authToken, process.env.JWT_SECRET);

        if (!token) {
            response.clearCookie('authAccessJWT');
            // response.send(new Error("Missing or unauthorized cookie."));
            // request.error = new Error("Missing or unauthorized cookie.");
            response.redirect('/auth/login');
            next();
        } else {

            User.findById(
                token._id
            ).then(
                (user) => {
                    if (!user) {
                        // response.send(new Error("User is not authorized."));
                        // request.error = new Error("User is not authorized.");
                        response.redirect('/auth/login');
                    } else {
                        request.user = user;
                        next();
                    }
                }
            )

        }
    }
}

module.exports = {
    authentication
}