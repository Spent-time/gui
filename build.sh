#!/usr/bin/env bash

set -e

echo "=========================================================================="
echo "     _________                     __    ___________.__                   "
echo "    /   _____/_____   ____   _____/  |_  \__    ___/|__| _____   ____     "
echo "    \_____  \\____ \_/ __ \ /    \   __\   |    |   |  |/     \_/ __ \    "
echo "    /        \  |_> >  ___/|   |  \  |     |    |   |  |  Y Y  \  ___/    "
echo "   /_______  /   __/ \___  >___|  /__|     |____|   |__|__|_|  /\___  >   "
echo "           \/|__|        \/     \/                           \/     \/    "
echo "                                                                          "
echo " Created by : Cloud Coders                                                "
echo "  Copyright : (c) 2016 - Cloud Coders intl B.V.                           "
echo "    Package : apps                                                        "
echo "    Product : spent-time.com                                              "
echo " Running on : $(date)                                                     "
echo "=========================================================================="
echo ""
echo " Time for the awesome ;0) "
echo ""
echo "=========================================================================="

# run jsdocs
./doc.sh

echo "=========================================================================="

# Base directory for this entire project
BASEDIR=$(cd $(dirname $0) && pwd)

# tarball
TARBALL="spent-time-gui.tar.gz"

# Source directory for unbuilt code
SRCDIR="$BASEDIR/src"

# Directory containing dojo build utilities
TOOLSDIR="$SRCDIR/util/buildscripts"

# Destination directory for built code
DISTDIR="$BASEDIR/../dist/apps"

# Main application package build configuration
PROFILE="$BASEDIR/profiles/app.profile.js"

# Configuration over. Main application start up!

if [ ! -d "$TOOLSDIR" ]; then
	echo "Can't find Dojo build tools -- did you initialise submodules? (git submodule update --init --recursive)"
	exit 1
fi

if [ ! -d node_modules ]; then
	echo "Can't find Node.js dependencies -- did you install them? (npm install)"
	exit 1
fi

echo "Building application with $PROFILE to $DISTDIR."

echo -n "Cleaning old files..."
rm -rf "$DISTDIR"
echo " Done"

echo "Running build tools"
"$TOOLSDIR/build.sh" --bin node --profile "$PROFILE" --releaseDir "$DISTDIR"

#--localeList "de,es,fr,it,ja,nl,pt,ru,zh"

cd "$BASEDIR"

# Copy & minify index.html to dist

echo "Copy index.html"

cat "$SRCDIR/index.html" | \
perl -pe 's/\n/ /g;            # Replace newlines with whitespace' |
perl -pe 's/<\!--.*?-->//g;    # Strip HTML comments' |
perl -pe 's/isDebug: *true,//; # Remove isDebug' |
perl -pe 's/\s+/ /g;           # Collapse whitespace' > "$DISTDIR/index.html"

# copy the favicon
cp "$SRCDIR/favicon.ico" "$DISTDIR/favicon.ico"

# copy pdf.js
cp -r "$SRCDIR/pdfjs-dist" "$DISTDIR/pdfjs-dist"

cd "$DISTDIR"

find . -name "*.consoleStripped.js" -exec rm -rf {} \;
find . -name "*.uncompressed.js" -exec rm -rf {} \;

cd "$BASEDIR/../dist"

tar -czf "$TARBALL" apps

if [ "$1" == "transfer" ]; then

    echo "transfer : $TARBALL to $2"
    scp -i ~/.ssh/spent-time-eu.pem "$TARBALL" "ubuntu@$2:"
fi

# done
echo "Build complete"


