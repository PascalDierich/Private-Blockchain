#!/bin/sh

echo "getBlock: Unable to parse block ID (2)"
echo "--------"
# test: string
curl -X "GET" "http://localhost:8000/block/string"
echo ""
# test: negative number
curl -X "GET" "http://localhost:8000/block/-1"
echo "\n"

echo "getBlock: Genesis Block (1)"
echo "--------"
curl -X "GET" "http://localhost:8000/block/0"
echo "\n"
