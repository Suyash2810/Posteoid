const supertest = require('supertest');
const expect = require('expect');
const mongodb = require('mongodb');

const {
    app
} = require('../server');

const {
    Post
} = require('../models/post');

const {
    posts,
    populatePosts
} = require('./seed/post.seed');

beforeEach(
    populatePosts
);

describe("POST /post/store", () => {

    it("should get the saved post", (done) => {
        let data = {
            title: "Sound of the whales",
            description: "A deep down theory.",
            content: "Read online."
        }

        supertest(app)
            .post('/post/store')
            .send(data)
            .expect(200)
            .expect(
                (result) => {
                    expect(result.body.title).toBe(data.title);
                    expect(result.body.description).toBe(data.description);
                    expect(result.body.content).toBe(data.content);
                }
            )
            .end(
                (err, result) => {

                    if (err) {
                        return done(err);
                    }

                    let title = data.title;

                    Post.find({
                        title
                    }).then(
                        (post) => {
                            expect(post[0].title).toBe(data.title);
                            expect(post[0].description).toBe(data.description);
                            expect(post[0].content).toBe(data.content);
                            done();
                        }
                    ).catch(
                        (error) => {
                            done(error);
                        }
                    )
                }
            );
    });
});