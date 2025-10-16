#!/bin/bash

# Banner for npm start
cat << "EOF"

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🌟 LUXURY PERFUME HAVEN - FIRST TIME SETUP 🌟        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📋 This will:
   ✓ Install & configure MySQL
   ✓ Create database 'perfume_haven'
   ✓ Install all dependencies
   ✓ Seed initial data (products, categories, reviews)
   ✓ Create admin user (admin/admin123)
   ✓ Start frontend (port 8080) & backend (port 5000)

⏱️  Estimated time: 3-5 minutes

Press CTRL+C to cancel, or wait to continue...

EOF

sleep 3
