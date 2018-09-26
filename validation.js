const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

class ID {
    constructor(address) {
        this.address = address;
        this.timestamp = Date.now();
        this.message = this.address + ":" + this.timestamp + ":StarRegistry";
        this.deadline = ID.getValidationDeadline(this.timestamp);
        this.signatureVerified = false;
    }

    // verifySignature sets the isVerified field to the result of the verification.
    async verifySignature(signature) {
        try {
            this.signatureVerified = await bitcoinMessage.verify(this.message, this.address, signature);
        } catch (err) {
            this.signatureVerified = false;
        }
    }

    isVerified() {
        return this.signatureVerified && (Date.now() < this.deadline);
    }

    static getValidationDeadline(timestamp) {
        return timestamp + 300000; // 5 minutes
    }
}
module.exports = ID;