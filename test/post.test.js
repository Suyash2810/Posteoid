var chai = require('chai');
var expect = chai.expect;
var {
    Post
} = require('../models/post');

describe("Post Model test", () => {


    it("should create the post instance with errors", (done) => {
        var post = new Post();

        post.validate(
            (error) => {
                expect(error.errors.title).to.exist;
                expect(error.errors.description).to.exist;
                expect(error.errors.username).to.exist;
                expect(error.errors.content).to.exist;
                expect(error.errors.creator_id).to.exist;
                done();
            }
        );
    });

    it("should not return errors for property not set as required.", (done) => {
        var post = new Post();

        post.validate(
            (error) => {
                expect(error.errors.image).to.not.exist;
                done();
            }
        );
    });

    it("should not return errors.", () => {
        var post = new Post({
            title: 'Foo',
            description: 'Foofoo',
            content: 'foofoofoo',
            username: 'fofo',
            creator_id: 'sample_id'
        });

        expect(post).to.have.property('title').to.equal('Foo');
        expect(post).to.have.property('description').to.equal('Foofoo');
        expect(post).to.have.property('content').to.equal('foofoofoo');
        expect(post).to.have.property('username').to.equal('fofo');
        expect(post).to.have.property('creator_id').to.equal('sample_id');
        expect(post).to.have.property('views').to.equal(0);
        expect(post).to.have.property('pdfDownloads').to.equal(0);
    });

});