const handlers = require('./httpHandler');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

////////////
// Setup
////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));
app.listen(8000, () => console.log('WebService listens on port 8000'));

////////////
// Routing
////////////
app.get('/block/:blockID', handlers.getBlock);
app.post('/block', handlers.addBlock);
app.post('/requestValidation', handlers.startValidation);
// app.post('messageSignature/validate', validateSignature);
