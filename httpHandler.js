const Blockchain = require('./simpleChain');
const currentChain = new Blockchain();
const HashMap = require('hashmap');
const addressMap = new HashMap(); // Cache: addressMap[address] -> ID
const validationProcess = require('./validation');

// TODO: remove elements from addressMap after process.
// IDEA: remove elements after call to addBlock (only allowed to add one block per validation)
// else remove element after Deadline.

// startValidation adds a new created ID to the addressMap and responses
// the message to validate with a deadline.
// Handles: POST /requestValidation
// Expects: JSON -> { address }
async function startValidation(req, res) {
    const address = req.body.address;
    if (!address && typeof address === "string") {
        console.log('parsing address failed. req.body=%s', req.body);
        errorHandler(req, res, 'Unable to get address');
        return;
    }

    const customer = new validationProcess(address);
    addressMap.set(address, customer);

    const resMessage = {
        "address": customer.address,
        "timestamp": customer.timestamp,
        "message": customer.message,
        "validationWindow": customer.deadline
    };
    res.send(resMessage);
}

// validateSignature validates the signature and responses a status.
// Handles: POST /messageSignature/validate
// Expects: JSON -> { address, signature }
async function validateSignature(req, res) {
    const address = req.body.address;
    const signature = req.body.signature;

    const customer = addressMap.get(address);
    if (customer === undefined) {
        console.log('ID not found in map. address=%s signature=%s', address, signature);
        errorHandler(req, res, 'Validation failed.');
        return;
    }

    console.log(customer);
    await customer.verifySignature(signature);
    if (!customer.isVerified()) {
        console.log('validation failed. ID=%s signature=%s', customer, signature);
        errorHandler(req, res, 'Validation failed.');
        return;
    }

    const status = {
        "registerStar": true,
        "status": {
            "address": customer.address,
            "requestTimestamp": customer.timestamp,
            "message": customer.message,
            "validationWindow": customer.deadline,
            "messageSignature": true
        }
    };
    res.send(status);
}

// getBlock returns the requested block.
// Handles: GET /block/:blockID
async function getBlock(req, res) {
    const blockID = parseInt(req.params.blockID, 10);
    if (isNaN(blockID) || blockID < 0) {
        errorHandler(req, res, 'Unable to parse block ID');
        return;
    }

    try {
        const block = await currentChain.getBlock(blockID);
        res.send(block);
    } catch (err) {
        console.log('getHandler received error:', err);
        errorHandler(req, res, 'Currently unable to get block #%s', blockID);
    }
}

// addBlock adds a new star to the blockchain, if address is verified.
// Handles: POST /block
// Expects: JSON -> { address, star: { dec, ra, story } }
async function addBlock(req, res) {
    const address = req.body.address;
    const star = req.body.star;

    const customer = addressMap.get(address);
    if (customer === undefined) {
        console.log('ID not found in map. address=%s', address);
        errorHandler(req, res, 'Please validate before submitting a new star.');
        return;
    }
    addressMap.delete(address);
    if (!customer.isVerified()) {
        console.log('ID not verified. ID=%s', customer);
        errorHandler(req, res, 'Please validate before submitting a new star.');
        return;
    }

    // TODO: check star-object
    const blockContent = {
        "address": address,
        "star": JSON.stringify(star)
    };
    try {
        const block = await currentChain.addBlock(Blockchain.createBlock(blockContent));
        res.send(block);
    } catch (err) {
        console.log('postHandler received error:', err);
        errorHandler(req, res, 'Currently unable to add star');
    }
}

function errorHandler(req, res, errMsg) {
    res.send(errMsg);
}

module.exports = {
    addBlock,
    getBlock,
    startValidation,
    validateSignature
};