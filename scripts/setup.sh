#!/bin/bash
# ============================================
# Lihq'et Bookstore — Project Setup Script
# ============================================
# Automates the initial setup for local development.
# Usage: bash scripts/setup.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════╗"
echo "║   📚 Lihq'et Bookstore — Setup Script   ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# -------------------------------------------
# Step 1: Check prerequisites
# -------------------------------------------
echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}  ✗ $1 is not installed. Please install it first.${NC}"
        exit 1
    else
        echo -e "${GREEN}  ✓ $1 found: $($1 --version 2>/dev/null | head -n1)${NC}"
    fi
}

check_command node
check_command npm
check_command mysql

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}  ✗ Node.js 18+ is required. Current: $(node -v)${NC}"
    exit 1
fi

# -------------------------------------------
# Step 2: Environment configuration
# -------------------------------------------
echo -e "\n${YELLOW}[2/5] Setting up environment...${NC}"

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}  ✓ Created .env from .env.example${NC}"
    echo -e "${YELLOW}  ⚠ Please edit .env with your database credentials${NC}"
else
    echo -e "${GREEN}  ✓ .env file already exists${NC}"
fi

# -------------------------------------------
# Step 3: Install backend dependencies
# -------------------------------------------
echo -e "\n${YELLOW}[3/5] Installing backend dependencies...${NC}"
npm install
echo -e "${GREEN}  ✓ Backend dependencies installed${NC}"

# -------------------------------------------
# Step 4: Install frontend dependencies
# -------------------------------------------
echo -e "\n${YELLOW}[4/5] Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..
echo -e "${GREEN}  ✓ Frontend dependencies installed${NC}"

# -------------------------------------------
# Step 5: Database setup
# -------------------------------------------
echo -e "\n${YELLOW}[5/5] Setting up database...${NC}"

# Source .env variables
export $(grep -v '^#' .env | xargs)

if mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}  ✓ MySQL connection successful${NC}"
    
    # Run schema
    mysql -u"$DB_USER" -p"$DB_PASSWORD" < backend/models/bookModel.sql 2>/dev/null
    echo -e "${GREEN}  ✓ Database schema applied${NC}"
    
    # Check if seed data should be loaded
    BOOK_COUNT=$(mysql -u"$DB_USER" -p"$DB_PASSWORD" -D"$DB_NAME" -se "SELECT COUNT(*) FROM books" 2>/dev/null || echo "0")
    if [ "$BOOK_COUNT" = "0" ]; then
        mysql -u"$DB_USER" -p"$DB_PASSWORD" -D"$DB_NAME" < database/seed.sql 2>/dev/null
        echo -e "${GREEN}  ✓ Seed data loaded${NC}"
    else
        echo -e "${GREEN}  ✓ Database already has $BOOK_COUNT books (skipping seed)${NC}"
    fi
else
    echo -e "${YELLOW}  ⚠ Could not connect to MySQL. Please run database setup manually.${NC}"
    echo -e "${YELLOW}    mysql -u root -p < backend/models/bookModel.sql${NC}"
fi

# -------------------------------------------
# Done
# -------------------------------------------
echo -e "\n${CYAN}"
echo "╔══════════════════════════════════════════╗"
echo "║         ✅ Setup Complete!               ║"
echo "╠══════════════════════════════════════════╣"
echo "║                                          ║"
echo "║  Start backend:   npm run dev            ║"
echo "║  Start frontend:  cd frontend && npm     ║"
echo "║                   run dev                ║"
echo "║                                          ║"
echo "║  Or use Docker:   docker-compose up      ║"
echo "║                   --build                ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"
