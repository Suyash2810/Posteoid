var mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');


var ContactSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isEmail(value);
        }
    },
    phone: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        default: moment().format('MMM Do YY').toString()
    }
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = {
    Contact
}