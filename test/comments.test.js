const chai = require('chai');
const expect = chai.expect;
const {
    Comment
} = require('../models/comments');
//5d417677a9ce191f68718916
describe("Comments Model", () => {

    it("should create the instance with errors", (done) => {

        let comment = new Comment();

        comment.validate(
            (error) => {
                expect(error.errors.name).to.exist;
                expect(error.errors.content).to.exist;
                expect(error.errors.post_id).to.exist;
                expect(error.errors.user_id).to.exist;
                done();
            }
        );
    });

    it("should create the comments instance without any errors.", (done) => {
        let comment = new Comment({
            name: "Renold",
            content: "Good post. Keep it up.",
            post_id: "5d417677a9ce191f68718916",
            user_id: "5d417677a9ce191f68718916"
        });

        expect(comment).to.have.property('name').to.equal('Renold');
        expect(comment).to.have.property('content').to.equal('Good post. Keep it up.');
        expect(comment).to.have.property('post_id').to.equal('5d417677a9ce191f68718916');
        expect(comment).to.have.property('user_id').to.equal('5d417677a9ce191f68718916');
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
                expect(error.errors.post_id).to.exist;
                expect(error.errors.user_id).to.exist;
            }
        );

        done();
    });

});