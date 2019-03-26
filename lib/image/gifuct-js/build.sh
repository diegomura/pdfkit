#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

mkdir -p dist
mkdir -p tmp

npm install
node_modules/.bin/babel src -q -d tmp
node_modules/.bin/browserify --standalone gifuct tmp/gif.js -o tmp/gifuct.js
node_modules/.bin/uglifyjs tmp/gifuct.js -o dist/gif.js --beautify
node_modules/.bin/uglifyjs dist/gif.js -o dist/gif.min.js --compress --mangle --source-map "filename=dist/gif.min.js.map" 

rm -rf tmp
