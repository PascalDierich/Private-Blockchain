# Private-Blockchain
Project 2 and 3 in Udacitys "Blockchain Developer Nanodegree Program".

### Dependencys
* Node.js Framework
```
"dependencies": {
    "body-parser": "^1.18.3",
    "crypto-js": "^3.1.9-1",
    "express": "^4.16.3",
    "level": "^4.0.0"
}
```

### Methods
#### Get block endpoint
*  Configure GET request using URL path with a block height parameter.
   *   URL path should resemble: http://localhost:8000/block/0
   *   '0' within the URL path is the block height. 
*   The response for the endpoint should provide block object is JSON format.

GET request example for URL http://localhost:8000/block/0
```
curl localhost:8000/block/0
```

GET response example for URL http://localhost:8000/block/0
```
{"hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3","height":0,"body":"First block in the chain - Genesis block","time":"1530311457","previousBlockHash":""}
```
 
 #### Get post endpoint
 *   Post a new block with data payload option to add data to the block body.
*   The block body should support a string of text (set content=text).
*   The response for the endpoint should provide block object is JSON format.

POST request example for URL http://localhost:8000/block
```
curl -X POST \
    -d 'content=Description of new block' \
    localhost:8000/block
```

POST response example for URL http://localhost:8000/block
```
{"hash":"ffaffeb2330a12397acc069791323783ef1a1c8aab17ccf2d6788cdab0360b90","height":1,"body":"Description of new block","time":"1531764891","previousBlockHash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"}
```