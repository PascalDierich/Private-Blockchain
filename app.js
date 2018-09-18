const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./simpleChain');
const currentChain = new Blockchain();

////////////
// Setup
////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));
app.listen(8000, () => console.log('WebService listens on port 8000'));

////////////
// Routing
////////////
app.get('/block/:blockID', getHandler);
app.post('/block', postHandler);

////////////
// Handler
////////////
async function getHandler(req, res) {
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

async function postHandler(req, res) {
    const blockBody = req.body.content;
    if (!blockBody && typeof blockBody === "string") {
        errorHandler(req, res, 'Unable to get block-information');
        return;
    }

    try {
        const block = await currentChain.addBlock(Blockchain.createBlock(blockBody));
        res.send(block);
    } catch (err) {
        console.log('postHandler received error:', err);
        errorHandler(req, res, 'Currently unable to add block');
    }
}

function errorHandler(req, res, errMsg) {
    res.send(errMsg);
}
