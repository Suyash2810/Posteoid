const chai = require('chai');
const expect = chai.expect;
const {
    User
} = require('../models/user');

describe("User model test.", () => {

    it("should create the user instance with errors", (done) => {
        var user = new User();

        user.validate(
            (err) => {
                expect(err.errors.username).to.exist;
                expect(err.errors.email).to.exist;
                expect(err.errors.password).to.exist;
                done();
            }
        )
    });

    it("should create the user instance", () => {
        var user = new User({
            username: "Henry",
            email: "henry@gmail.com",
            password: "foofoo"
        });

        expect(user).to.have.property('username').to.equal('Henry');
        expect(user).to.have.property('email').to.equal('henry@gmail.com');
        expect(user).to.have.property('password').to.equal('foofoo');
    });
});