const mongoose = require('mongoose');
const moment = require('moment');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    creator_id: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: String,
        default: moment().format("MMM Do YY").toString()
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = {
    Post
}