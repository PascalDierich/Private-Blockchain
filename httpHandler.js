const Blockchain = require('./simpleChain');
const currentChain = new Blockchain();
const time = new Date();
const HashMap = require('hashmap');
const addressMap = new HashMap(); // Cache: addressMap[address]timestamp
const validationUtils = require('./validationUtils');

// startValidation saves the address with a timestamp
// and responses a message to sign.
// Handles: POST /requestValidation
// Expects: res.body -> address=[wallet address]
async function startValidation(req, res) {
    const address = req.body.address;
    if (!address && typeof address === "string") {
        errorHandler(req, res, 'Unable to get address');
        return;
    }

    const timestamp = time.getTime();
    addressMap.set(address, timestamp);
    const validationWindow = validationUtils.getValidationWindow(timestamp);
    const message = validationUtils.createMessage(address, timestamp);

    const resMessage = {
        address: address,
        timestamp: timestamp,
        message: message,
        validationWindow: validationWindow
    };
    res.send(resMessage);
}

// getBlock returns the requested block.
// Handles: GET /block/:blockID
async function getBlock(req, res) {
    const blockID = parseInt(req.params.blockID, 10);
    if (isNaN(blockID)) {
        errorHandler(req, res, "Unable to parse block ID");
        return;
    }

    try {
        const block = await currentChain.getBlock(blockID);
        res.send(block);
    } catch (err) {
        console.log('getHandler received error:', err);
        errorHandler(req, res, 'Currently unable to get block #{}', blockID);
    }
}

// addBlock adds a new block to the blockchain.
// Handles: POST /block
// Expects: res.body -> content=[blockContent]
async function addBlock(req, res) {
    const blockContent= req.body.content;
    if (!blockContent && typeof blockContent === "string") {
        errorHandler(req, res, 'Unable to get block-information');
        return;
    }

    try {
        const block = await currentChain.addBlock(Blockchain.createBlock(blockContent));
        res.send(block);
    } catch (err) {
        console.log('postHandler received error:', err);
        errorHandler(req, res, 'Currently unable to add block');
    }
}

function errorHandler(req, res, errMsg) {
    res.send(errMsg);
}

module.exports = {
    addBlock,
    getBlock,
    startValidation
};