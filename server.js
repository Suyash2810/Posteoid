const express = require('express');
const _ = require('lodash');
const path = require('path');
const body_parser = require('body-parser');
const hbs = require('hbs');

const {
    mongoose
} = require('./mongoose/mongoose');

const {
    Post
} = require('./models/post');

const {
    ObjectID
} = require('mongodb');

const app = express();
const port = process.env.port || 3000;

app.use(express.static(__dirname + '/public'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}))

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', async (request, response) => {
    let data = await Post.find({});
    response.render('index', data);
});

app.get('/index', (request, response) => {
    response.sendFile(path.resolve(__dirname + '/pages/index.html'));
});

app.get('/about', (request, response) => {

    response.sendFile(path.resolve(__dirname + '/pages/about.html'));
});

app.get('/contact', (request, response) => {

    response.sendFile(path.resolve(__dirname + '/pages/contact.html'));
});

app.get('/post', (request, response) => {

    response.sendFile(path.resolve(__dirname + '/pages/post.html'));
});

app.get('/post/new', (request, response) => {
    response.render('create');
});

app.post('/post/store', (request, response) => {

    console.log(request.body);
    let body = _.pick(request.body, ['title', 'description', 'content']);
    let post = new Post(body);

    post.save().then(
            (result) => {
                console.log(result);
            },
            (error) => {
                response.status(404).send(error);
            }
        )
        .catch(
            (error) => {
                console.log(error);
                response.status(404).send(error);
            }
        );

    response.redirect('/');
});

app.listen(port, () => {
    console.log(`Connected to the server at port: ${port}.`);
});