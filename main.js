// main file to start application.
// use in development only!

const Blockchain = require('./simpleChain');

let myChain = new Blockchain();

(function theLoop (i) {
    setTimeout(function () {
        let blockTest = Blockchain.createBlock("Test Block - " + (i + 1));
        myChain.addBlock(blockTest).then((result) => {
            console.log(result);
            i++;
            if (i < 10) theLoop(i);
            else myChain.validateChain();
        });
    }, 1000);
})(0);
