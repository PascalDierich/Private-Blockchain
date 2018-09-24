#!/bin/sh

echo "addBlock: Unable to parse address (1)"
echo "--------"
# test: empty string
curl -X "POST" "http://localhost:8000/block" \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{"address": ""}'
echo "\n"

echo "addBlock: Please validate before submitting a new star (1)"
echo "--------"
curl -X "POST" "http://localhost:8000/block" \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{
"address": "ADDRESS",
"star": {
"dec": "-26° 29'\'' 24.9",
"ra": "16h 29m 1.0s",
"story": "Star story"
}
}'
