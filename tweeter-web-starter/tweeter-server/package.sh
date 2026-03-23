#!/bin/bash
# Packages tweeter-server for Lambda deployment

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Build shared and server
echo "Building tweeter-shared..."
cd "$ROOT_DIR/tweeter-shared"
npm run build

echo "Building tweeter-server..."
cd "$SCRIPT_DIR"
npm run build

# Create a staging directory
rm -rf staging
mkdir -p staging

# Copy compiled server code (exclude node_modules that tsc may have copied)
rsync -a --exclude='node_modules' dist/ staging/

# Copy tweeter-shared with its compiled output
mkdir -p staging/node_modules/tweeter-shared
# Copy package.json but remove "type": "module" so Lambda's CommonJS require() works
sed '/"type": "module"/d' "$ROOT_DIR/tweeter-shared/package.json" > staging/node_modules/tweeter-shared/package.json
cp -r "$ROOT_DIR/tweeter-shared/dist" staging/node_modules/tweeter-shared/

# Copy tweeter-shared's runtime dependencies (uuid, date-fns) from hoisted root node_modules
cp -r "$ROOT_DIR/node_modules/uuid" staging/node_modules/
cp -r "$ROOT_DIR/node_modules/date-fns" staging/node_modules/

# Create the zip
rm -f tweeter-server.zip
cd staging
zip -r ../tweeter-server.zip .
cd ..

# Clean up
rm -rf staging

echo ""
echo "Created tweeter-server.zip - upload this to your Lambda functions."
