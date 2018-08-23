# Private-Blockchain
Project 2 and 3 in Udacitys "Blockchain Developer Nanodegree Program".

### Dependencys
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

GET response example for URL http://localhost:8000/block/0

        HTTP/1.1 200 OK
        content-type: application/json; charset=utf-8
        cache-control: no-cache
        content-length: 179
        accept-ranges: bytes
        Connection: close
        {"hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3","height":0,"body":"First block in the chain - Genesis block","time":"1530311457","previousBlockHash":""}
 
 #### Get post endpoint
 *   Post a new block with data payload option to add data to the block body. 
*   The block body should support a string of text.
*   The response for the endpoint should provide block object is JSON format.

POST response example for URL http://localhost:8000/block

        HTTP/1.1 200 OK
        content-type: application/json; charset=utf-8
        cache-control: no-cache
        content-length: 238
        Connection: close
        {"hash":"ffaffeb2330a12397acc069791323783ef1a1c8aab17ccf2d6788cdab0360b90","height":1,"body":"Testing block with test string data","time":"1531764891","previousBlockHash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"}
