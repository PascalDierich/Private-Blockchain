#!/bin/sh

echo "addBlock: Unable to get block-information (1)"
echo "--------"
# test: empty string
curl -X "POST" "http://localhost:8000/block" \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{"content": ""}'
echo "\n"

echo "addBlock: [success] (1)"
echo "--------"
curl -X "POST" "http://localhost:8000/block" \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{"content": "normal content..."}'
echo "\n"

echo "addBlock: [success] (1)"
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
