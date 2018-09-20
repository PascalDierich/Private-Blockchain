
function getValidationWindow(timestamp) {
    return 60 * 60 * 24; // TODO:
}

function createMessage(address, timestamp) {
    // TODO: add params != undefined check
    return address + ":" + timestamp + ":StarRegistry";
}

// verifySignature returns true if valid.
function verifySignature(message, address, signature) {
    return bitcoinMessage.verify(message, address, signature);
}

module.exports = {
    getValidationWindow,
    createMessage,
    verifySignature
};