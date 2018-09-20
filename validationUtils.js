
function getValidationWindow(timestamp) {
    return 60 * 60 * 24; // TODO:
}

function createMessage(address, timestamp) {
    // TODO: add params != undefined check
    return address + ":" + timestamp + ":StarRegistry";
}

function validateSignature(address, signature) {
    return true; // TODO:
}

module.exports = {
    getValidationWindow,
    createMessage,
    validateSignature
};