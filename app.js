const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./simpleChain');
const currentChain = new Blockchain();

////////////
// Setup
////////////
app.use(bodyParser.json());
app.listen(8000, () => console.log('WebService listens on port 8000'));

////////////
// Routing
////////////
app.get('/block/:blockID', getHandler);
app.post('/block', postHandler);

////////////
// Handler
////////////
function getHandler(req, res) {
    const blockID = parseInt(req.params.blockID, 10);
    if (isNaN(blockID)) {
        errorHandler(req, res, "Unable to parse block ID");
        return;
    }

    currentChain.getBlock(blockID)
        .then((block) => {
            res.send(block);
        })
        .catch((err) => {
            console.log('getHandler received error:', err);
            errorHandler(req, res, "Currently unable to get block #"+blockID);
        });
}

function postHandler(req, res) {
    const blockBody = req.body.body;
    if (typeof blockBody === "undefined") {
        errorHandler(req, res, "Unable to get block-information");
        return;
    }

    currentChain.addBlock(Blockchain.createBlock(blockBody))
        .then((block) => {
            res.send(block);
        })
        .catch((err) => {
            console.log('postHandler received error:', err);
            errorHandler(req, res, "Currently unable to add block");
        })
}

function errorHandler(req, res, errMsg) {
    res.send(errMsg);
}
