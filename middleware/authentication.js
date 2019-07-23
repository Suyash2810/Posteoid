const jwt = require('jsonwebtoken');
const {
    User
} = require('../models/user');

var authentication = (request, response, next) => {

    let authToken = request.cookies.authAccessJWT;

    if (!authToken) {
        response.status(401).send("User is not authorized. Token does not exist.");
    } else {

        let token = jwt.verify(authToken, process.env.JWT_SECRET);

        if (!token) {
            response.clearCookie('authAccessJWT');
            response.send("Missing or unauthorized cookie.");
        } else {

            User.findById(
                token._id
            ).then(
                (user) => {
                    if (!user) {
                        response.send("User is not authorized.");
                    } else {
                        request.user = user;
                        response.status(200).send("User is authorized.");
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