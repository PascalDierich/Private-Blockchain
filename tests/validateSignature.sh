#!/bin/sh

echo "validateSignature: Validation failed (2)"
echo "--------"
#
# test: address not found in map.
curl -X "POST" "http://localhost:8000/message-signature/validate" \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{"address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ" , "signature": "" }'
echo "\n" 
#
# add address to internal map
curl -X "POST" "http://localhost:8000/request-validation" \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{"address": "142BDCeSGbXjWKaAnYXbMpZ6s" }'
echo ""
#
# test: validation failed.
curl -X "POST" "http://localhost:8000/message-signature/validate" \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{"address": "142BDCeSGbXjWKaAnYXbMpZ6s" , "signature": "" }'
echo "\n"

# echo "validateSignature: [success] (1)"
# echo "--------"
#
# add address to internal map
# curl -X "POST" "http://localhost:8000/request-validation" \
# -H 'Content-Type: application/json; charset=utf-8' \
# -d $'{"address": "ADDRESS" }'
# echo ""
#
# sleep for 2 second.
# sleep 2
#
# test: validation failed.
# curl -X "POST" "http://localhost:8000/message-signature/validate" \
# -H 'Content-Type: application/json; charset=utf-8' \
# -d $'{"address": "ADDRESS" , "signature": "ADDRESS:TIMESTAMP:STARREGISTRY" }'
# echo "\n" 
