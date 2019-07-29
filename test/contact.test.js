var chai = require('chai');
var expect = chai.expect;
var {
    Contact
} = require('../models/contacts');


describe("Contact Model Test", () => {

    it("should return errors for the contact instance", (done) => {

        var contact = new Contact();

        contact.validate(
            (error) => {
                expect(error.errors.name).to.exist;
                expect(error.errors.email).to.exist;
                expect(error.errors.phone).to.exist;
                expect(error.errors.message).to.exist;
                done();
            }
        );
    });

    it("should not return errors", (done) => {
        var contact = new Contact({
            name: 'woof',
            email: 'wooffoo',
            phone: 45796416587,
            message: 'hello'
        });

        expect(contact).to.have.property('name').to.equal('woof');
        expect(contact).to.have.property('email').to.equal('wooffoo');
        expect(contact).to.have.property('phone').to.equal(45796416587);
        expect(contact).to.have.property('message').to.equal('hello');
        done();
    });
});