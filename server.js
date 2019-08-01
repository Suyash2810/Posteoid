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
    Contact
} = require('./models/contacts');

const {
    ObjectID
} = require('mongodb');

var Message = require('js-message');

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
        response.render('index', data);
    } else {
        response.redirect('/index');
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

app.get('/post/new', authentication, (request, response) => {
    if (request.user) {
        response.render('create');
    } else {
        response.redirect('/auth/login');
    }
});

app.post("/post/store", authentication, (request, response) => {
    if (request.user) {

        // const {
        //     image
        // } = request.files

        // image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {

        //     let body = {
        //         ...request.body,
        //         image: `/posts/${image.name}`
        //     }
        //     let post = new Post(body);

        //     post.save().then(
        //         (result) => {
        //             response.status(200).send(result);
        //         }
        //     ).catch(
        //         (error) => {
        //             response.status(404).send(error);
        //         }
        //     );

        //     response.redirect('/'); //rectify redirect situation.
        // })

        if (request.files) {

            const {
                image
            } = request.files

            image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {

                let body = {
                    ...request.body,
                    creator_id: request.user._id.toString(),
                    image: `/posts/${image.name}`
                }
                let post = new Post(body);

                post.save().then(
                    (result) => {
                        response.status(200).send(result);
                    }
                ).catch(
                    (error) => {
                        response.status(404).send(error);
                    }
                );

                response.redirect('/');
            })
        } else {

            let body = {
                ...request.body,
                creator_id: request.user._id.toString()
            }
            let post = new Post(body);

            post.save().then(
                (result) => {
                    response.status(200).send(result);
                }
            ).catch(
                (error) => {
                    response.status(404).send(error);
                }
            );

            response.redirect('/');
        }
    } else {
        response.redirect('/auth/login');
    }
});

app.get('/post/:id', authentication, async (request, response) => {

    if (request.user) {
        let post = await Post.findById(request.params.id);
        response.render('post', {
            post
        });
    } else {
        response.redirect('/auth/login');
    }

});

app.get('/auth/register', (request, response) => {

    // let data = request.flash('signUpErrors');
    if (request.cookies.authAccessJWT) {
        response.redirect('/');
    } else {
        let errorData = request.cookies.errors;

        let errobj = {};
        if (errorData) {
            Object.keys(errorData).forEach(
                (key) => {
                    errobj[key] = errorData[key];
                }
            );
        }


        response.render('register.hbs', {
            errobj
        });
    }
});


app.post('/users/register', (request, response) => {

    let userData = _.pick(request.body, ['username', 'email', 'password']);

    let user = new User(userData);
    user.save().then(
        (result) => {
            return response.redirect('/auth/login');
        }
    ).catch(
        (error) => {

            if (error) {
                // console.log(Object.keys(error.errors));
                let errObj = {};
                Object.keys(error.errors).forEach(
                    (key) => {
                        errObj[key] = error.errors[key].message;
                    }
                );

                var registrationErrors = Object.keys(error.errors).map(key => error.errors[key].message);

                var errorMessage = new Message;
                errorMessage.type = 'message or event type';
                errorMessage.data.errors = registrationErrors;
                console.log("\n " + errorMessage.JSON);

                response.cookie('errors', errObj);
            }
            return response.redirect('/auth/register');
        }
    )
});


app.get('/auth/login', (request, response) => {

    if (request.cookies.authAccessJWT) {
        response.redirect('/');
    } else {
        response.render('login.hbs');
    }
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

app.get('/user/logout', (request, response) => {

    response.clearCookie('authAccessJWT');
    response.redirect('/auth/login');
});

app.post('/contact/add', async (request, response) => {

    let body = _.pick(request.body, ['name', 'email', 'phone', 'message']);
    var contact = new Contact(body);

    let result = await contact.save();
    if (!result) {
        response.redirect('/contact');
    }
    response.redirect('/index');
});

app.get('/delete/:id', authentication, async (request, response) => {

    let id = request.params.id;

    if (request.user) {
        let userId = request.user._id.toString();
        let post = await Post.findById(id);
        let postCreatorId = post.creator_id.toString();
        let matchCheck = _.isEqual(userId, postCreatorId);
        // console.log(typeof (userId) + " ----- " + typeof (id));

        if (matchCheck) {
            Post.findByIdAndRemove(id).then(
                (result) => {
                    response.redirect('/');
                }
            ).catch(
                (err) => {
                    if (err) {
                        response.redirect(`/post/${id}`);
                    }
                }
            )
        } else {
            response.redirect(`/post/${id}`);
        }
    } else {
        response.redirect(`/post/${id}`);
    }

});

app.listen(port, () => {
    console.log(`Connected to the server at port: ${port}.`);
});

module.exports = {
    app
}