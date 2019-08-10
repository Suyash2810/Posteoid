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
    Comment
} = require('./models/comments');

const {
    ObjectID
} = require('mongodb');

const fs = require('fs');

var Message = require('js-message');
const cheerio = require('cheerio');
const request = require('request');
const pdfMakePrinter = require('pdfmake/src/printer');
const striptags = require('striptags');

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
        response.clearCookie('deleteError');
        response.clearCookie('editError');
        response.clearCookie('updateError');
        response.clearCookie('updateSuccess');
        response.clearCookie('commentDelete');
        response.render('index', data);
    } else {
        response.redirect('/index');
    }

});

app.get('/index', (request, response) => {
    response.clearCookie('loginErr');
    response.clearCookie('errors');
    response.clearCookie('logoutMessage');
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

        let delobj = request.cookies.deleteError;
        let editobj = request.cookies.editError;
        let updateObj = request.cookies.updateError;
        let successUpdateObj = request.cookies.updateSuccess;

        let editObj = {};
        let DelObj = {};
        let updateError = {};
        let successObj = {};

        if (delobj) {
            Object.keys(delobj).forEach(
                (key) => {
                    DelObj[key] = delobj[key];
                }
            );
        }

        if (editobj) {
            Object.keys(editobj).forEach((key) => {
                editObj[key] = editobj[key];
            })
        }

        if (updateObj) {
            Object.keys(updateObj).forEach((key) => {
                updateError[key] = updateObj[key];
            })
        }

        if (successUpdateObj) {
            Object.keys(successUpdateObj).forEach(
                (key) => {
                    successObj[key] = successUpdateObj[key];
                }
            )
        }

        let comments = await Comment.find({
            post_id: request.params.id
        })

        let commentobj = request.cookies.commentDelete;
        let commentObj = {}

        if (commentobj) {

            Object.keys(commentobj).forEach(
                key => {
                    commentObj[key] = commentobj[key]
                }
            )
        }

        response.render('post', {
            post,
            DelObj,
            editObj,
            updateError,
            successObj,
            comments,
            commentObj
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
            let log = result.username + " -- " + result.email + " registered at time: " + new Date().toString() + "\n";
            fs.appendFileSync('./logs/register.log', log);
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
        let errData = {};
        let errObj = request.cookies.loginErr;

        if (errObj) {
            Object.keys(errObj).forEach(key => {
                errData[key] = errObj[key];
            });
        }

        let logoutobj = request.cookies.logoutMessage;
        let logoutObj = {};

        if (logoutobj) {

            Object.keys(logoutobj).forEach(
                key => {
                    logoutObj[key] = logoutobj[key]
                }
            )
        }

        response.render('login.hbs', {
            errData,
            logoutObj
        });
    }
});


app.post('/users/login', (request, response) => {

    let body = _.pick(request.body, ['email', 'password']);
    User.findUserByEmailAndPassword(body.email, body.password).then(
        (user) => {
            let access = 'auth';

            var token = jwt.sign({
                _id: user._id.toHexString(),
                access
            }, process.env.JWT_SECRET).toString();


            response.cookie('authAccessJWT', token);

            let log = "\n" + user.username + " -- " + user.email + " logged in at time : " + new Date().toString();
            fs.appendFileSync('./logs/login.log', log);
            response.clearCookie('loginErr');
            response.redirect('/');
        }
    ).catch(
        (error) => {
            let errObj = {
                err: "The email or password entered is incorrect."
            }

            response.cookie('loginErr', errObj);

            response.redirect('/auth/login');
        }
    );
});

app.get('/user/logout', (request, response) => {

    response.clearCookie('authAccessJWT');

    let logoutMessage = {
        success: "You have been successfully logged out."
    }

    response.cookie('logoutMessage', logoutMessage);

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

app.get('/delete/confirm/:id', (request, response) => {

    let id = request.params.id;

    if (!ObjectID.isValid(id)) {

        response.redirect('/');
    }

    let ids = {
        postId: id
    }

    response.render('deletePost.hbs', {
        ids
    });
});


app.get('/delete/:id', authentication, async (request, response) => {

    let id = request.params.id;

    if (!ObjectID.isValid(id)) {

        response.redirect('/');
    }

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
                        let delError = {
                            err: "The post can only be deleted by the creator."
                        }

                        response.cookie('deleteError', delError);

                        response.redirect(`/post/${id}`);
                    }
                }
            )
        } else {
            let delError = {
                err: "The post can only be deleted by the creator."
            }

            response.cookie('deleteError', delError);

            response.redirect(`/post/${id}`);
        }
    } else {
        response.redirect(`/post/${id}`);
    }

});

app.get('/post/pdf/:id', async (req, res) => {

    let id = req.params.id;

    if (!ObjectID.isValid(id)) {

        response.redirect('/');
    }

    let post = await Post.findById(id);

    function generatePdf(docDefinition, callback) {
        try {
            const fontDescriptors = {
                Roboto: {
                    normal: 'public/fonts/Roboto-Regular.ttf',
                    bold: 'public/fonts/Roboto-Medium.ttf',
                    italics: 'public/fonts/Roboto-Italic.ttf',
                    bolditalics: 'public/fonts/Roboto-MediumItalic.ttf'
                }
            };

            const printer = new pdfMakePrinter(fontDescriptors);
            const doc = printer.createPdfKitDocument(docDefinition);

            let chunks = [];

            doc.on('data', (chunk) => {
                chunks.push(chunk);
            });

            doc.on('end', () => {
                callback(Buffer.concat(chunks));
            });

            doc.end();

        } catch (err) {
            throw (err);
        }
    };


    const docDefinition = {
        content: [{
                image: `public${post.image}`,
                width: 600,
                height: 300,
                style: 'image'
            },
            {
                text: post.title,
                style: 'title'
            },
            {
                text: `By - ${post.username}`,
                style: 'username'
            },
            {
                text: post.description,
                style: 'description'
            },
            {
                text: striptags(post.content.replace(/(&rsquo;)*/g, "").replace(/(&nbsp;)*/g, "")),
                style: 'content'
            }
        ],

        styles: {
            image: {
                margin: 0,
                marginTop: 0,
                alignment: 'center'
            },
            title: {
                marginTop: 20,
                fontSize: 22,
                bold: true,
                alignment: 'center'
            },
            username: {
                marginTop: 5,
                fontSize: 15,
                alignment: 'center'
            },
            description: {
                marginTop: 50,
                fontSize: 16,
                bold: false,
                alignment: 'center'
            },
            content: {
                marginTop: 70,
                alignment: 'center',
                color: 'grey',
                fontSize: 14
            }
        }
    };

    generatePdf(docDefinition, (result) => {
        res.setHeader('Content-Type', 'application/pdf');
        res.send(result);
    });


});

app.get('/about/pdf', async (req, res) => {

    await request('http://localhost:3000/about', (err, response, html) => {

        if (!err) {

            var $ = cheerio.load(html);
            // Scraping the page.

            var heading, subHeading, para1, para2, para3;

            var jsonData = {
                heading: "",
                subHeading: "",
                para1: "",
                para2: "",
                para3: ""
            }


            $('.page-heading').filter(function () {

                var data = $(this);

                heading = data.children().first().text();

                jsonData.heading = heading;

                subHeading = data.children().last().text();
                jsonData.subHeading = subHeading;
            });

            $('#about_content').filter(function () {

                let data = $(this);

                para1 = data.children().eq(0).text();
                para2 = data.children().eq(1).text();
                para3 = data.children().eq(2).text();

                jsonData.para1 = para1;
                jsonData.para2 = para2;
                jsonData.para3 = para3;
            });

            function generatePdf(docDefinition, callback) {
                try {
                    const fontDescriptors = {
                        Roboto: {
                            normal: 'public/fonts/Roboto-Regular.ttf',
                            bold: 'public/fonts/Roboto-Medium.ttf',
                            italics: 'public/fonts/Roboto-Italic.ttf',
                            bolditalics: 'public/fonts/Roboto-MediumItalic.ttf'
                        }
                    };

                    const printer = new pdfMakePrinter(fontDescriptors);
                    const doc = printer.createPdfKitDocument(docDefinition);

                    let chunks = [];

                    doc.on('data', (chunk) => {
                        chunks.push(chunk);
                    });

                    doc.on('end', () => {
                        callback(Buffer.concat(chunks));
                    });

                    doc.end();

                } catch (err) {
                    throw (err);
                }
            };


            const docDefinition = {
                content: [{
                        text: jsonData.heading,
                        style: 'title'
                    },
                    {
                        text: jsonData.subHeading,
                        style: 'subHeading'
                    },
                    {
                        text: striptags(jsonData.para1),
                        style: 'para1'
                    },
                    {
                        text: striptags(jsonData.para2),
                        style: 'para2'
                    },
                    {
                        text: striptags(jsonData.para3),
                        style: 'para3'
                    }
                ],

                styles: {
                    title: {
                        marginTop: 20,
                        fontSize: 28,
                        bold: true,
                        alignment: 'center'
                    },
                    subHeading: {
                        marginTop: 5,
                        fontSize: 20,
                        alignment: 'center'
                    },
                    para1: {
                        marginTop: 30,
                        alignment: 'justify',
                        color: 'grey',
                        fontSize: 14
                    },
                    para2: {
                        marginTop: 30,
                        alignment: 'justify',
                        color: 'grey',
                        fontSize: 14
                    },
                    para3: {
                        marginTop: 30,
                        alignment: 'justify',
                        color: 'grey',
                        fontSize: 14
                    }
                }
            };

            generatePdf(docDefinition, (result) => {
                res.setHeader('Content-Type', 'application/pdf');
                res.send(result);
            });

        } else {
            res.redirect('/about');
        }

    });
});

app.get('/edit/:id', authentication, async (request, response) => {
    let id = request.params.id;

    if (!ObjectID.isValid(id)) {

        response.redirect('/');
    }

    let postId = {
        id
    };

    let post = await Post.findById(id);

    response.clearCookie('editError');
    response.clearCookie('deleteError');
    response.clearCookie('updateSuccess');
    response.clearCookie('updateError');
    response.clearCookie('commentDelete');

    if (request.user) {
        response.render('edit.hbs', {
            postId,
            post
        });
    } else {
        response.redirect('/auth/login');
    }
});

app.post('/edit/post/:id', authentication, async (request, response) => {

    let id = request.params.id;

    if (!ObjectID.isValid(id)) {

        response.redirect('/');
    }

    if (request.user) {
        let userId = request.user._id.toString();
        let post = await Post.findById(id);
        let postCreatorId = post.creator_id.toString();
        let matchCheck = _.isEqual(userId, postCreatorId);
        // console.log(request.body);
        if (matchCheck) {

            // The updation has to be done here.
            let body = _.pick(request.body, ['username', 'title', 'description', 'content']);
            let toUpdateData = {};

            Object.keys(body).forEach(
                (key) => {
                    if (!(_.isEmpty(body[key]))) {
                        toUpdateData[key] = body[key];
                    }
                }
            )


            Post.findOneAndUpdate({
                _id: id,
                creator_id: postCreatorId
            }, {
                $set: toUpdateData
            }, {
                new: true
            }).then(
                (result) => {
                    if (!result) {
                        let errorObj = {
                            err: "The post could not be updated."
                        }

                        response.cookie('updateError', errorObj);

                        response.redirect(`/post/${id}`);
                    } else {
                        let successObj = {
                            success: "The post has been updated successfully."
                        }

                        response.cookie('updateSuccess', successObj);

                        response.redirect(`/post/${id}`);
                    }
                }
            ).catch(
                (error) => {
                    response.redirect('/');
                }
            );

        } else {

            let errorData = {
                err: "The data can only be edited by the creator of the respective post."
            };

            response.cookie('editError', errorData);

            response.redirect(`/post/${id}`);
        }



    } else {
        response.redirect('/index');
    }

});

app.post('/post/comment/:id', authentication, (request, response) => {

    if (request.user) {
        let post_id = request.params.id;
        let content = _.pick(request.body, ['content']).content;
        let name = request.user.username;
        let user_id = request.user._id;

        let body = {
            name,
            content,
            post_id,
            user_id
        }


        let comment = new Comment(body);

        comment.save().then(
            (comment) => {
                response.redirect(`/post/${post_id}`);
            }
        ).catch(
            err => {
                response.redirect(`/post/${request.params.id}`);
            }
        )

    }
});

app.get('/delete/comment/:id', authentication, async (request, response) => {

    if (request.user) {
        let id = request.params.id;
        let comment = await Comment.findById(id);
        let post_id = comment.post_id;
        let user_id = comment.user_id.toString();
        let reUserId = request.user._id.toString();
        let matchCheck = _.isEqual(user_id, reUserId);

        if (matchCheck) {
            let ids = {
                id: id,
                postId: post_id
            };

            response.render('confirmation.hbs', {
                ids
            });
        } else {
            response.redirect(`/post/${post_id}`);
            //Display the error message also.
        }
    } else {
        response.redirect('/');
    }

});

app.get('/delete/comment/confirm/:id', async (request, response) => {

    let comment_id = request.params.id;
    let comment = await Comment.findById(comment_id);
    let post_id = comment.post_id;

    let result = await Comment.findByIdAndRemove(comment_id);

    if (result) {
        let delObj = {
            success: "Comment has been successfully deleted."
        }
        response.cookie('commentDelete', delObj);

        response.redirect(`/post/${post_id}`);
    }

})

app.listen(port, () => {
    console.log(`Connected to the server at port: ${port}.`);
});

module.exports = {
    app
}