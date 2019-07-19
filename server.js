const express = require('express');
const _ = require('lodash');
const path = require('path');
const body_parser = require('body-parser');
const hbs = require('hbs');

// const {
//     mongoose
// } = require('./mongoose/mongoose');

// const {
//     Post
// } = require('./models/post');

const {
    ObjectID
} = require('mongodb');

const app = express();
const port = process.env.port || 3000;

app.use(express.static(__dirname + '/public'));
app.use(body_parser.json());

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', (request, response) => {

    response.render('index');
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
})

app.listen(port, () => {
    console.log(`Connected to the server at port: ${port}.`);
});