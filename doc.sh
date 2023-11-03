#!/usr/bin/env bash

set -e

SRCDIR=src/apps
DOCSDIR=../dist/docs
CONF=profiles/jsdoc-conf.json

echo "Documenting application in $DOCSDIR."

echo -n "Cleaning old files..."
rm -rf "$DOCSDIR"
echo " Done"

if [ ! -d node_modules ]; then
	echo "Can't find Node.js dependencies -- did you install them? (npm install)"
	exit 1
fi

./node_modules/.bin/jsdoc "$SRCDIR" -r -d "$DOCSDIR" -c "$CONF"


echo "file:/"$(pwd)"/dist/docs/index.html"
echo "Docs complete"
