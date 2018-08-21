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
