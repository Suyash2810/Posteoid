const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const passwordValidator = require('password-validator');

var passwordSchema = new passwordValidator();

passwordSchema
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

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
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: 'Email is not valid.'
        }
    },
    password: {
        type: String,
        required: true,
        maxlength: 12,
        minlength: 6,
        validate: {
            validator: (value) => {
                return validator.isUppercase(value);
            },
            message: 'Password is not having an uppercase letter.'
        },
        validate: {
            validator: (value) => {
                return passwordSchema.validate(value);
            },
            message: "Password must have a lowercase letter and a digit with no whitespaces."
        }
    },
    image: {
        type: String
    }
});

userSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    var obj = _.pick(userObject, ['_id', 'email']);

    return obj;
}

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {

        bcrypt.genSalt(10, (err, salt) => {

            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });

    } else {
        next();
    }
});

userSchema.statics.findUserByEmailAndPassword = function (email, password) {

    var User = this;

    return User.findOne({
        email
    }).then(
        (user) => {
            if (!user) {
                return Promise.reject("User could not be found. Invalid Data.");
            } else {

                return new Promise(
                    (resolve, reject) => {
                        bcrypt.compare(password, user.password, (err, result) => {
                            if (result) {
                                resolve(user);
                            } else {
                                reject(err);
                            }
                        })
                    }
                )
            }
        }
    ).catch(
        (err) => {
            return Promise.reject(err);
        }
    )
}

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}