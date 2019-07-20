const {
    Post
} = require('../../models/post');

let posts = [{
        title: "A day in the life of a Fashionista",
        description: "Slaying the life",
        content: "Later honey!"
    },
    {
        title: "Eliot",
        description: "An imaginary person.",
        content: "Love."
    }

];

const populatePosts = (done) => {
    Post.remove({}).then(() => {
        return Post.insertMany(posts)
    }).then(() => done());
}

module.exports = {
    posts,
    populatePosts
}