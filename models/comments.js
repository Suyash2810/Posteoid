var mongoose = require('mongoose');
var moment = require('moment');

var commentSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: moment().format("MMM Do YY").toString()
    }
});


const Comment = mongoose.model("Comment", commentSchema);

module.exports = {
    Comment
}