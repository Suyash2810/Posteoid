require('./configuration/config');

const express = require('express');
const _ = require('lodash');
const path = require('path');
const body_parser = require('body-parser');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const {
    authentication
} = require('./middleware/authentication');

const {
    mongoose
} = require('./mongoose/mongoose');

const {
    Post
} = require('./models/post');

const {
    User
} = require("./models/user");

const {
    ObjectID
} = require('mongodb');

const app = express();
const port = process.env.port || 3000;

app.use(fileUpload());
app.use(express.static(__dirname + '/public'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', authentication, async (request, response) => {

    if (request.user) {
        let data = await Post.find({});
        console.log(data.length);
        response.render('index', data);
    } else {
        response.redirect('/auth/login');
    }

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

app.post("/post/store", (req, res) => {
    const {
        image
    } = req.files

    image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
        // Post.create({
        //     ...req.body,
        //     image: `/posts/${image.name}`
        // }, (error, post) => {
        //     res.redirect('/');
        // });

        let body = {
            ...req.body,
            image: `/posts/${image.name}`
        }
        let post = new Post(body);

        post.save().then(
            (result) => {
                res.status(200).send(result);
            }
        ).catch(
            (error) => {
                res.status(404).send(error);
            }
        );

        res.redirect('/'); //rectify redirect situation.
    })
});

app.get('/post/:id', async (request, response) => {

    let post = await Post.findById(request.params.id);
    response.render('post', {
        post
    });
});

app.get('/auth/register', (request, response) => {

    response.render('register.hbs');
});


app.post('/users/register', (request, response) => {

    let userData = _.pick(request.body, ['username', 'email', 'password']);

    let user = new User(userData);
    user.save().then(
        (result) => {
            return response.redirect('/');
        }
    ).catch(
        (error) => {
            return response.redirect('/auth/register');
        }
    )
});


app.get('/auth/login', (request, response) => {

    response.render('login.hbs');
});


app.post('/users/login', async (request, response) => {

    let body = _.pick(request.body, ['email', 'password']);
    var user = await User.findUserByEmailAndPassword(body.email, body.password);

    console.log(user);
    if (user) {

        let access = 'auth';

        var token = jwt.sign({
            _id: user._id.toHexString(),
            access
        }, process.env.JWT_SECRET).toString();

        console.log(token);

        response.cookie('authAccessJWT', token);

        response.redirect('/');

    } else {
        response.redirect('/auth/login');
    }
});

app.listen(port, () => {
    console.log(`Connected to the server at port: ${port}.`);
});

module.exports = {
    app
}