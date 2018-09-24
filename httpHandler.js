const Blockchain = require('./simpleChain');
const currentChain = new Blockchain();
const HashMap = require('hashmap');
const addressMap = new HashMap(); // Cache: addressMap[address] -> ID
const validationProcess = require('./validation');

// TODO: elements stays forever in addressMap if no call to addBlock happens after validation process.

// startValidation adds a new created ID to the addressMap and responses
// the message to validate with a deadline.
// Handles: POST /requestValidation
// Expects: JSON -> { address }
async function startValidation(req, res) {
    const address = req.body.address;
    if (!address && typeof address === "string") {
        console.log('parsing address failed. req.body=%s', req.body);
        errorHandler(req, res, 'Unable to parse address');
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
// Handles: POST /message-signature/validate
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

// addBlock adds a new star to the blockchain, if address is verified.
// Handles: POST /block
// Expects: JSON -> { address, star: { dec, ra, story } }
async function addBlock(req, res) {
    const address = req.body.address;
    if (!address && typeof address === "string") {
        console.log('parsing address failed. req.body=%s', req.body);
        errorHandler(req, res, 'Unable to parse address');
        return;
    }

    const star = req.body.star;
    // TODO: check star-object

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
        console.log('getBlock received error:', err);
        errorHandler(req, res, 'Currently unable to get block #%s', blockID);
    }
}

// getBlockForAddress returns all blocks added by this address.
// Handles: GET /stars/address/:address
async function getBlocksForAddress(req, res) {
    const address = req.params.address;
    if (!address && typeof address === "string") {
        errorHandler(req, res, 'Unable to parse address');
        return;
    }

    try {
        const blocks = await currentChain.getBlocksAddedBy(address);
        res.send(blocks);
    } catch (err) {
        console.log('getBlocksForAddress received error:', err);
        errorHandler(req, res, 'Currently unable to get blocks added by '+ address);
    }
}

// getBlockWithHash returns the block with requested hash.
// Handles: GET /stars/hash/:hash
async function getBlockWithHash(req, res) {
    const hash = req.params.hash;
    if (!hash && typeof hash === "string") {
        errorHandler(req, res, 'Unable to parse hash');
        return;
    }

    try {
        const block = await currentChain.getBlockWithHash(hash);
        res.send(block);
    } catch (err) {
        console.log('getBlockWithHash received error:', err);
        errorHandler(req, res, 'Currently unable to get block with hash '+ hash);
    }
}

function errorHandler(req, res, errMsg) {
    res.send(errMsg);
}

module.exports = {
    addBlock,
    getBlock,
    startValidation,
    validateSignature,
    getBlocksForAddress,
    getBlockWithHash
};