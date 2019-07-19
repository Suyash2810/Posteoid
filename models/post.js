const mongoose = require('mongoose');

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
        require: true
    }
});

const Post = new mongoose.model('Post', postSchema);

module.exports = {
    Post
}