
function getValidationWindow(timestamp) {
    return 60 * 60 * 24; // TODO:
}

function createMessage(address, timestamp) {
    return address + ":" + timestamp + ":StarRegistry";
}

module.exports = {
    getValidationWindow,
    createMessage
};