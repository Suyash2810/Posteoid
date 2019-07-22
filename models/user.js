const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validator: (value) => {
            return validator.isEmail(value);
        }
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function (next) {

    var user = this;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
        });
    });

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}