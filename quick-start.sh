#!/bin/bash

# E-commerce Guardian - Quick Start Script

set -e

echo "🚀 E-commerce Guardian Quick Start"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Choose an option:"
echo "1. Start the backend server (Maven)"
echo "2. Run Playwright tests"
echo "3. Start monitoring daemon"
echo "4. Run complete test suite"
echo "5. View monitoring stats"
echo "6. Generate monitoring report"
echo "7. Exit"
echo ""
read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo ""
        echo "🎯 Starting backend server..."
        mvn spring-boot:run
        ;;
    2)
        echo ""
        echo "🧪 Running Playwright tests..."
        npm test
        ;;
    3)
        echo ""
        echo "👁️  Starting monitoring daemon..."
        npm run daemon
        ;;
    4)
        echo ""
        echo "🏃 Running complete test suite..."
        node e2e-guardian.js
        ;;
    5)
        echo ""
        echo "📊 Viewing monitoring stats..."
        node daemon-ctl.js stats
        ;;
    6)
        echo ""
        echo "📝 Generating monitoring report..."
        node daemon-ctl.js report
        ;;
    7)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
