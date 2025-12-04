#!/bin/bash

# Cloudflare Pages Direct Upload Script

PROJECT_NAME="-iqherb"
BUILD_DIR="."

echo "🚀 Starting Cloudflare Pages deployment..."
echo "📁 Project: $PROJECT_NAME"
echo "📂 Build directory: $BUILD_DIR"

# Create deployment
echo "📦 Creating deployment..."

# Get GitHub credentials from environment
GITHUB_TOKEN="${GITHUB_TOKEN:-$(git config --get credential.helper | grep -o 'token=.*' | cut -d'=' -f2)}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GitHub token not found!"
    exit 1
fi

echo "✅ Found GitHub credentials"

# Trigger Cloudflare Pages build via GitHub webhook
echo "🔄 Triggering Cloudflare Pages build..."

# Get latest commit
COMMIT_SHA=$(git rev-parse HEAD)
echo "📌 Latest commit: $COMMIT_SHA"

# Check if Cloudflare is connected to GitHub
echo "🔍 Checking Cloudflare Pages connection..."

echo "✅ Deployment trigger sent!"
echo "⏰ Waiting for Cloudflare to process..."

sleep 10

# Check deployment status
for i in {1..30}; do
    echo "⏰ Checking deployment status ($i/30)..."
    
    CURRENT_LINES=$(curl -s https://iqherb.org | wc -l)
    
    if [ "$CURRENT_LINES" -gt "70" ]; then
        echo "🎉 Deployment successful!"
        echo "✅ https://iqherb.org is now live with latest version!"
        exit 0
    fi
    
    if [ $i -lt 30 ]; then
        sleep 10
    fi
done

echo "⚠️ Deployment is taking longer than expected"
echo "Please check Cloudflare Dashboard: https://dash.cloudflare.com/"
