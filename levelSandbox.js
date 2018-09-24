/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
    return new Promise((resolve, reject) => {
        db.put(key, value, function(err) {
            if (err) reject(err);
            resolve(value);
        });
    });
}
module.exports.addLevelDBData = addLevelDBData;

// Get data from levelDB with key
function getLevelDBData(key){
    return new Promise((resolve, reject) => {
        db.get(key, function(err, value) {
            if (err) reject(err);
            resolve(value);
        })
    });
}
module.exports.getLevelDBData = getLevelDBData;

function getBlockWithHash(hash) {
    return new Promise((resolve, reject) => {
        db.createReadStream().on('data', (data) => {
            const block = JSON.parse(data.value);
            if (block.hash === hash) {
                return resolve(block);
            }
        }).on('error', (error) => {
            return reject(error);
        }).on('close', () => {
            return reject("No block found.");
        });
    });
}
module.exports.getBlockWithHash = getBlockWithHash;

function getBlocksForAddress(address) {
    const blocks = [];

    return new Promise((resolve, reject) => {
        db.createReadStream().on('data', (data) => {
            const block = JSON.parse(data.value);
            // check Genesis block
            if (block.height === 0) {
                return;
            }
            if (block.body.address === address) {
                blocks.push(block);
            }
        }).on('error', (error) => {
            return reject(error);
        }).on('close', () => {
            if (blocks.length === 0) {
                reject("No block found.");
            } else {
                return resolve(blocks);
            }
        });
    });
}
module.exports.getBlocksForAddress = getBlocksForAddress;

// Add data to levelDB with value
// function addDataToLevelDB(value) {
//     return new Promise((resolve, reject) => {
//         let i = 0;
//         db.createReadStream().on('data', function() {
//             i++;
//         }).on('error', function(err) {
//             reject(err);
//         }).on('close', function() {
//             addLevelDBData(i, value)
//                 .catch((err) => {
//                     reject(err);
//                 }).then((key) => {
//                     resolve(i);
//             })
//         })
//     });
// }
// module.exports.addDataToLevelDB = addDataToLevelDB;

function getAmountEntries() {
    return new Promise((resolve, reject) => {
        let i = 0;
        db.createReadStream().on('data', function() {
            i++;
        }).on('error', function(err) {
            reject(err);
        }).on('close', function() {
            resolve(i);
        });
    });
}
module.exports.getAmountEntries = getAmountEntries;
/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/


(function theLoop (i) {
  setTimeout(function () {
    // addDataToLevelDB(i, 'Testing data');
    if (--i) theLoop(i);
  }, 100);
})(10);
