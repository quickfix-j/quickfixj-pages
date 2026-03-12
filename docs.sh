#!/bin/bash
set -e

# Navigate to the script's directory to ensure relative paths work
cd "$(dirname "$0")"

echo "Checking project dependencies..."

# Gracefully check if node_modules exists and if docusaurus is installed
if [ ! -d "node_modules" ] || [ ! -d "node_modules/@docusaurus" ]; then
    echo "Dependencies are missing. Installing via npm..."
    npm install
else
    echo "Dependencies are already installed. Skipping npm install."
fi

# Allow passing a command to the script, defaulting to "start"
COMMAND=${1:-start}

case "$COMMAND" in
    start|serve)
        echo "Starting local development server on http://localhost:3000..."
        npm run start
        ;;
    build)
        echo "Building static production site..."
        npm run build
        ;;
    preview)
        echo "Building and previewing production site locally..."
        npm run build
        npm run serve
        ;;
    clean)
        echo "Clearing Docusaurus cache..."
        npm run clear
        ;;
    *)
        echo "Unknown command: $COMMAND"
        echo "Available commands: start, serve, build, preview, clean"
        exit 1
        ;;
esac
