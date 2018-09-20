const bitcoinMessage = require('bitcoinjs-message');

function getValidationWindow(timestamp) {
    return 60 * 60 * 24; // TODO:
}

// createMessage returns a message or empty string if param is undefined.
function createMessage(address, timestamp) {
    if (address === undefined || timestamp === undefined) {
        return "";
    }
    return address + ":" + timestamp + ":StarRegistry";
}

// verifySignature returns true if valid.
function verifySignature(message, address, signature) {
    if (signature.length !== 65) { // lib-function throws error in this case.
        return false;
    }
    return bitcoinMessage.verify(message, address, signature)
}

module.exports = {
    getValidationWindow,
    createMessage,
    verifySignature
};