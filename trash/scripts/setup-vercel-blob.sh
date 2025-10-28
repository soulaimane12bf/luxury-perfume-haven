#!/bin/bash

echo "🚀 Setting up Vercel Blob Storage for Sliders"
echo "=============================================="
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the backend directory"
    echo "   Run: cd backend && ./setup-vercel-blob.sh"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
fi

# Check if BLOB_READ_WRITE_TOKEN is set
if grep -q "BLOB_READ_WRITE_TOKEN=[REDACTED_VERCEL_BLOB]" .env; then
    echo ""
    echo "⚠️  BLOB_READ_WRITE_TOKEN not configured!"
    echo ""
    echo "📋 Steps to get your Vercel Blob token:"
    echo "   1. Go to https://vercel.com/dashboard"
    echo "   2. Select your project"
    echo "   3. Click 'Storage' → 'Create Database' → 'Blob'"
    echo "   4. Copy the BLOB_READ_WRITE_TOKEN"
    echo "   5. Add it to backend/.env file"
    echo ""
    echo "   Example:"
    echo "   BLOB_READ_WRITE_TOKEN=[REDACTED_VERCEL_BLOB]..."
    echo ""
    read -p "Press Enter to open Vercel Dashboard in browser..." 
    xdg-open "https://vercel.com/dashboard" 2>/dev/null || open "https://vercel.com/dashboard" 2>/dev/null || echo "Please open: https://vercel.com/dashboard"
    exit 1
fi

echo "✅ BLOB_READ_WRITE_TOKEN is configured"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗑️  Cleaning up old sliders with base64 images..."
echo "   This will delete ALL existing sliders from database."
read -p "   Continue? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    node delete-all-sliders.js
    echo ""
    echo "✅ Database cleaned!"
else
    echo "⏭️  Skipped database cleanup"
fi

echo ""
echo "=============================================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Start backend: npm start"
echo "  2. Go to Admin Panel → السلايدر"
echo "  3. Create new sliders with image uploads"
echo ""
echo "Images will now be stored in Vercel Blob Storage"
echo "instead of the database. Much faster! 🚀"
echo ""
