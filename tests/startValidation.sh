#!/bin/sh

echo "startValidation: Unable to get address (1)"
echo "--------"
# test: empty string
curl -X "POST" "http://localhost:8000/request-validation" \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{"address": "" }'
echo "\n"

echo "startValidation: [success] (1)"
echo "--------"
curl -X "POST" "http://localhost:8000/request-validation" \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{"address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ" }'
echo "\n"
