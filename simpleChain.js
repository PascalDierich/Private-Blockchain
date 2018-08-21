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
            if (h < 1) {
                // Add Genesis Block
                this.addBlock(new Block("First block in the chain - Genesis block"))
                    .then((genesisBlock) => {
                        console.log('Added Genesis Block:');
                        console.log(genesisBlock)
                    }).catch((err) => {
                        console.log('Unable to add Genesis Block!', err);
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
            this.getBlockHeight().then((h) => {
                newBlock.height = h+1;
                // UTC timestamp
                newBlock.time = new Date().getTime().toString().slice(0, -3);
                // previous block hash
                if (newBlock.height > 1) {
                    this.getBlock(newBlock.height-1).then((block) => {
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
                } else {
                    // Block hash with SHA256 using newBlock and converting to a string
                    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                    // Adding block object to chain
                    db.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString())
                        .catch((err) => {
                            reject(err);
                        }).then((block) => {
                            resolve(block);
                    });
                }
            }).catch((err) => {
                reject('Unable to get block height! => block not added.', err);
            });
        });
    }

    // Get block height
    getBlockHeight(){
        return new Promise((resolve, reject) => {
            db.getAmountEntries().then((height) => {
                resolve(height);
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

    // validate block
    validateBlock(blockHeight){
        return new Promise((resolve, reject) => {
            this.getBlock(blockHeight).then((block) => {
                let blockHash = block.hash;
                block.hash = '';
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                if (blockHash === validBlockHash) {
                    resolve();
                } else {
                    console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
                    reject();
                }
            }).catch((err) => {
                console.log('Unable to get block #'+blockHeight+'.\n=>', err);
                reject();
            })
        });
    }

    // Validate blockchain
    validateChain(){
        let errorLog = [];
        this.getBlockHeight().then((height) => {
            // Genesis Block is Block #1!
            for (let i = 1; i < height; i++) {
                this.validateBlock(i).then(() => {
                    // compare block hash link
                    this.getBlock(i).then((b1) => {
                        this.getBlock(i+1).then((b2) => {
                            if (b1 !== b2.previousBlockHash) {
                                errorLog.push(i);
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    }).catch((err) => {
                        console.log(err);
                    })
                }).catch(() => {
                    errorLog.push(i);
                })
            }
            if (errorLog.length>0) {
                console.log('Block errors = ' + errorLog.length);
                console.log('Blocks: '+errorLog);
            } else {
                console.log('No errors detected');
            }
        }).catch((err) => {
            console.log(err);
            console.log('=== Validation failed! ===');
        });
    }
}
module.exports = Blockchain;
