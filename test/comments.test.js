const chai = require('chai');
const expect = chai.expect;
const {
    Comment
} = require('../models/comments');

describe("Comments Model", () => {

    it("should create the instance with errors", (done) => {

        let comment = new Comment();

        comment.validate(
            (error) => {
                expect(error.errors.name).to.exist;
                expect(error.errors.content).to.exist;
                done();
            }
        );
    });

    it("should create the comments instance without any errors.", (done) => {
        let comment = new Comment({
            name: "Renold",
            content: "Good post. Keep it up."
        });

        expect(comment).to.have.property('name').to.equal('Renold');
        expect(comment).to.have.property('content').to.equal('Good post. Keep it up.');
        done();
    });

    it("shouldn\'t create the comments instance for incomplete data .", (done) => {
        let comment = new Comment({
            name: "Renold"
        });

        comment.validate(
            (error) => {
                expect(error.errors.name).to.not.exist;
                expect(error.errors.content).to.exist;

            }
        );

        done();
    });

});