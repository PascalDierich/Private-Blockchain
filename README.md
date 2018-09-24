# Private-Blockchain
Project 2, 3 and 4 in Udacitys "Blockchain Developer Nanodegree Program".

### Dependencys
* Node.js Framework (currently 8.11.+)
```
"dependencies": {
    "bitcoinjs-lib": "^4.0.2",
    "bitcoinjs-message": "^2.0.0",
    "body-parser": "^1.18.3",
    "crypto-js": "^3.1.9-1",
    "express": "^4.16.3",
    "hashmap": "^2.3.0",
    "level": "^4.0.0"
  }
```

### Methods

#### Return block with blockID
* Method: ``` GET /block/:blockID ```
* Example: ``` curl -X "GET" "http://localhost:8000/block/0" ```
* Response: ``` {"hash":"86e3a...,"height":0,"body":"First block in the chain - Genesis block","time":"1537804911","previousBlockHash":""}```
* Note: Usable without validation!

#### Start to validate your own address
* Method: ``` POST /requestValidation```
* Example: ``` curl -X "POST" "http://localhost:8000/request-validation" \
               -H 'Content-Type: application/json; charset=utf-8' \
               -d $'{"address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ" }'```
* Response: ``` {"address":"142BD...","timestamp":1537806137134,"message":"142BD...:1537806137134:StarRegistry","validationWindow":1537809737134}```

#### Validate your signature
* Method: ``` POST /message-signature/validate```
* Example: ``` curl -X "POST" "http://localhost:8000/message-signature/validate" \
               -H 'Content-Type: application/json; charset=utf-8' \
               -d $'{"address": "1FRjG..." , "signature": "H/m5L..." }'```
* Response: ``` {"registerStar": true, "status": { "address": "1FRjG...", "requestTimestamp": "1537806137134", "message": "1FRjG...:1537806137134:StarRegistry", "validationWindow": "1537806137134", "messageSignature": true``` 
* Note: Start validation before calling this method!

#### Add a your own Star to the blockchain
* Method: ``` POST /block```
* Example: ``` curl -X "POST" "http://localhost:8000/block" \
               -H 'Content-Type: application/json; charset=utf-8' \
               -d $'{
               "address": "ADDRESS",
               "star": {
               "dec": "-26° 29'\'' 24.9",
               "ra": "16h 29m 1.0s",
               "story": "Star story"
               }
               }' ```
* Response: Returns the added block
* Note: Your address must be validated at this point!
               
#### Get all blocks added by address
* Method: ``` GET /stars/address/:address```
* Example: ``` curl "http://localhost:8000/stars/address/142BD..."```
* Response: Array containing all blocks added by given address
* Note: Usable without validation!

#### Get Block with hash
* Method ``` GET /stars/hash/:hash```
* Example: ``` curl "http://localhost:8000/stars/hash/a59e9..."```
* Response: Array containing the corresponding block
* Note: Usable without validation!
