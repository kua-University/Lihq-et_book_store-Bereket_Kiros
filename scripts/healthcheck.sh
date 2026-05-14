#!/bin/bash
# ============================================
# Lihq'et Bookstore — Health Check Script
# ============================================
# Usage: bash scripts/healthcheck.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

BACKEND_URL=${BACKEND_URL:-http://localhost:3000}
FRONTEND_URL=${FRONTEND_URL:-http://localhost:5173}

HEALTHY=0
TOTAL=0

echo -e "${CYAN}╔══════════════════════════════════════════╗"
echo -e "║  📚 Lihq'et Bookstore — Health Check     ║"
echo -e "╚══════════════════════════════════════════╝${NC}"

check_service() {
    local name="$1"
    local check_cmd="$2"
    TOTAL=$((TOTAL + 1))
    if eval "$check_cmd" > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} $name ${GREEN}HEALTHY${NC}"
        HEALTHY=$((HEALTHY + 1))
    else
        echo -e "  ${RED}✗${NC} $name ${RED}UNHEALTHY${NC}"
    fi
}

echo -e "\n${YELLOW}Checking services...${NC}\n"
check_service "Backend API      ($BACKEND_URL)" "curl -sf --max-time 5 $BACKEND_URL/api/books"
check_service "Frontend         ($FRONTEND_URL)" "curl -sf --max-time 5 $FRONTEND_URL"

if command -v docker &> /dev/null; then
    echo -e "\n${YELLOW}Docker containers:${NC}\n"
    for CONTAINER in lihqet-frontend lihqet-backend lihqet-db; do
        TOTAL=$((TOTAL + 1))
        if docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null | grep -q true; then
            echo -e "  ${GREEN}✓${NC} $CONTAINER ${GREEN}running${NC}"
            HEALTHY=$((HEALTHY + 1))
        else
            echo -e "  ${RED}✗${NC} $CONTAINER ${RED}not running${NC}"
        fi
    done
fi

echo ""
if [ "$HEALTHY" -eq "$TOTAL" ]; then
    echo -e "${GREEN}All $TOTAL services healthy ✓${NC}"
    exit 0
else
    echo -e "${RED}$((TOTAL - HEALTHY)) of $TOTAL services unhealthy ✗${NC}"
    exit 1
fi
