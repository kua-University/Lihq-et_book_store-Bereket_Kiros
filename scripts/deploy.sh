#!/bin/bash
# ============================================
# Lihq'et Bookstore — Deployment Script
# ============================================
# Handles production deployment for various platforms.
# Usage: bash scripts/deploy.sh [platform]
#
# Supported platforms:
#   docker   - Deploy using Docker Compose
#   railway  - Deploy to Railway
#   render   - Deploy to Render
#   vercel   - Deploy frontend to Vercel
#   netlify  - Deploy frontend to Netlify

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PLATFORM=${1:-docker}

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════╗"
echo "║  📚 Lihq'et Bookstore — Deploy Script   ║"
echo "╠══════════════════════════════════════════╣"
echo "║  Platform: $(printf '%-29s' "$PLATFORM")║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# -------------------------------------------
# Build frontend for production
# -------------------------------------------
build_frontend() {
    echo -e "${YELLOW}Building frontend for production...${NC}"
    cd frontend
    npm ci
    npm run build
    cd ..
    echo -e "${GREEN}  ✓ Frontend built successfully${NC}"
}

# -------------------------------------------
# Docker Deployment
# -------------------------------------------
deploy_docker() {
    echo -e "${YELLOW}Deploying with Docker Compose...${NC}"
    
    # Check Docker is available
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}  ✗ Docker is not installed${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}  ✗ Docker Compose is not installed${NC}"
        exit 1
    fi
    
    # Check for .env file
    if [ ! -f .env ]; then
        echo -e "${RED}  ✗ .env file not found. Run: cp .env.example .env${NC}"
        exit 1
    fi
    
    # Build and start services
    echo -e "${YELLOW}  Building and starting containers...${NC}"
    docker-compose down 2>/dev/null || true
    docker-compose up --build -d
    
    # Wait for services to be healthy
    echo -e "${YELLOW}  Waiting for services to be healthy...${NC}"
    sleep 10
    
    # Verify deployment
    if curl -s http://localhost:3000/api/books > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Backend API is responding${NC}"
    else
        echo -e "${YELLOW}  ⚠ Backend may still be starting up${NC}"
    fi
    
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Frontend is responding${NC}"
    else
        echo -e "${YELLOW}  ⚠ Frontend may still be starting up${NC}"
    fi
    
    echo -e "\n${GREEN}  Deployment complete!${NC}"
    echo -e "  Frontend: ${CYAN}http://localhost:5173${NC}"
    echo -e "  Backend:  ${CYAN}http://localhost:3000/api/books${NC}"
    echo -e "  Logs:     ${CYAN}docker-compose logs -f${NC}"
}

# -------------------------------------------
# Railway Deployment
# -------------------------------------------
deploy_railway() {
    echo -e "${YELLOW}Deploying to Railway...${NC}"
    
    if ! command -v railway &> /dev/null; then
        echo -e "${RED}  ✗ Railway CLI not installed. Run: npm install -g @railway/cli${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}  Linking project...${NC}"
    railway link
    
    echo -e "${YELLOW}  Deploying...${NC}"
    railway up --detach
    
    echo -e "${GREEN}  ✓ Deployment triggered! Check status: railway status${NC}"
}

# -------------------------------------------
# Render Deployment
# -------------------------------------------
deploy_render() {
    echo -e "${YELLOW}Deploying to Render...${NC}"
    echo -e "${CYAN}  Render deploys automatically from your Git repository.${NC}"
    echo -e "${CYAN}  Steps:${NC}"
    echo -e "  1. Push code to GitHub"
    echo -e "  2. Go to https://render.com/deploy"
    echo -e "  3. Connect your repository"
    echo -e "  4. Render will detect render.yaml automatically"
    echo -e ""
    echo -e "${YELLOW}  Pushing to Git now...${NC}"
    
    git add -A
    git commit -m "deploy: update for Render deployment" --allow-empty
    git push origin main 2>/dev/null || git push origin master
    
    echo -e "${GREEN}  ✓ Code pushed. Render will deploy automatically.${NC}"
}

# -------------------------------------------
# Vercel Deployment (Frontend only)
# -------------------------------------------
deploy_vercel() {
    echo -e "${YELLOW}Deploying frontend to Vercel...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}  Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    cd frontend
    
    echo -e "${YELLOW}  Building and deploying...${NC}"
    vercel --prod
    
    cd ..
    echo -e "${GREEN}  ✓ Frontend deployed to Vercel!${NC}"
    echo -e "${YELLOW}  ⚠ Remember to set VITE_API_URL in Vercel project settings${NC}"
}

# -------------------------------------------
# Netlify Deployment (Frontend only)
# -------------------------------------------
deploy_netlify() {
    echo -e "${YELLOW}Deploying frontend to Netlify...${NC}"
    
    if ! command -v netlify &> /dev/null; then
        echo -e "${YELLOW}  Installing Netlify CLI...${NC}"
        npm install -g netlify-cli
    fi
    
    build_frontend
    
    cd frontend
    netlify deploy --prod --dir=dist
    cd ..
    
    echo -e "${GREEN}  ✓ Frontend deployed to Netlify!${NC}"
    echo -e "${YELLOW}  ⚠ Remember to set VITE_API_URL in Netlify environment variables${NC}"
}

# -------------------------------------------
# Route to the correct deployment function
# -------------------------------------------
case "$PLATFORM" in
    docker)
        deploy_docker
        ;;
    railway)
        deploy_railway
        ;;
    render)
        deploy_render
        ;;
    vercel)
        deploy_vercel
        ;;
    netlify)
        deploy_netlify
        ;;
    *)
        echo -e "${RED}Unknown platform: $PLATFORM${NC}"
        echo -e "Usage: bash scripts/deploy.sh [docker|railway|render|vercel|netlify]"
        exit 1
        ;;
esac
