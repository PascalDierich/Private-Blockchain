/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

// import {addLevelDBData, getAmountEntries, getLevelDBData} from "./levelSandbox";
const db = require('./levelSandbox');
const SHA256 = require('crypto-js/sha256');

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
    constructor(data){
        this.hash = "",
        this.height = 0,
        this.body = data,
        this.time = 0,
        this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
    constructor(){
        this.getBlockHeight().then((h) => {
            if (h < 0) {
                // create Genesis block
                let genesisBlock = new Block("First block in the chain - Genesis block");
                genesisBlock.previousBlockHash = "";
                genesisBlock.height = 0;
                genesisBlock.time = new Date().getTime().toString().slice(0, -3);
                genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();

                // add Genesis block to chain
                db.addLevelDBData(0, JSON.stringify(genesisBlock).toString())
                    .then((genesisBlock) => {
                        console.log('Added Genesis Block:');
                        console.log(genesisBlock);
                    }).catch((err) => {
                        console.log('Unable to add Genesis block!', err);
                });
            }
        }).catch((err) => {
            console.log('Unable to add Genesis Block!', err);
        });
    }

    // Returns a new block
    static createBlock(description) {
        return new Block(description)
    }

    // Add new block
    addBlock(newBlock) {
        return new Promise((resolve, reject) => {
            // Block height
            this.getBlockHeight().then((height) => {
                newBlock.height = height+1;
                // UTC timestamp
                newBlock.time = new Date().getTime().toString().slice(0, -3);
                // previous block hash
                this.getBlock(height).then((block) => {
                    newBlock.previousBlockHash = block.hash;
                    // Block hash with SHA256 using newBlock and converting to a string
                    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                    // Adding block object to chain
                    db.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString())
                        .catch((err) => {
                            reject(err);
                        }).then((block) => {
                            resolve(block);
                        });
                }).catch((err) => {
                    reject('Unable to get previous block! => block not added.', err);
                });
            }).catch((err) => {
                reject('Unable to get block height! => block not added.', err);
            });
        });
    }

    // Get block height
    getBlockHeight(){
        return new Promise((resolve, reject) => {
            db.getAmountEntries().then((height) => {
                resolve(height-1);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    // get block
    getBlock(blockHeight){
        return new Promise((resolve, reject) => {
            db.getLevelDBData(blockHeight).then((value) => {
                resolve(JSON.parse(value));
            }).catch((err) => {
                reject(err);
            });
        });
    }

    // validate the whole Blockchain and return corresponding error log
    async validateChain() {
        let errorLog = [];
        try {
            const blockHeight = await this.getBlockHeight();
            let errorLogBuf = await this.validateBlockConnectivity(blockHeight);
            errorLog.concat(errorLogBuf);
            errorLogBuf = await this.validateEachBlock(blockHeight);
            errorLog.concat(errorLogBuf);
        } catch (err) {
            console.log('validateChain:', err);
        }
        return errorLog;
    }

    // validate block connectivity and return corresponding error log
    async validateBlockConnectivity(blockHeight) {
        let errorLog = [];
        for (let i = 0; i < blockHeight; i++) {
            try {
                let currentBlock = await this.getBlock(i);
                let nextBlock = await this.getBlock(i+1);
                if (currentBlock.hash !== nextBlock.previousBlockHash) {
                    errorLog.push(i);
                }
            } catch (err) {
                console.log('validateBlockConnectivity: Unable to receive each block.', err);
            }
        }
        return errorLog;
    }

    // validate each block and return the corresponding error log
    async validateEachBlock(blockHeight) {
        let errorLog = [];
        for (let i = 0; i <= blockHeight; i++) {
            try {
                await this.validateBlock(blockHeight);
            } catch (err) {
                console.log('validateEachBlock: ', err);
                errorLog.push(i);
            }
        }
        return errorLog;
    }

    // validate block
    validateBlock(blockHeight){
        return new Promise((resolve, reject) => {
            this.getBlock(blockHeight).then((block) => {
                let blockHash = block.hash;
                block.hash = '';
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                if (blockHash === validBlockHash) {
                    resolve(true);
                } else {
                    reject('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
                }
            }).catch((err) => {
                console.log('validateBlock: Unable to get block #'+blockHeight);
                reject(err);
            })
        });
    }
}
module.exports = Blockchain;
