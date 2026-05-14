#!/bin/bash
# ============================================
# Lihq'et Bookstore — Database Backup Script
# ============================================
# Creates timestamped MySQL backups and manages rotation.
# Usage: bash scripts/db-backup.sh [backup|restore|list]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"
MAX_BACKUPS=10
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-""}
DB_NAME=${DB_NAME:-lihqet_books}

ACTION=${1:-backup}

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════╗"
echo "║  📚 Lihq'et Bookstore — DB Backup       ║"
echo "╠══════════════════════════════════════════╣"
echo "║  Action:   $(printf '%-29s' "$ACTION")║"
echo "║  Database: $(printf '%-29s' "$DB_NAME")║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# -------------------------------------------
# Backup
# -------------------------------------------
do_backup() {
    BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"
    
    echo -e "${YELLOW}Creating backup...${NC}"
    
    mysqldump \
        -h "$DB_HOST" \
        -P "$DB_PORT" \
        -u "$DB_USER" \
        -p"$DB_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        --add-drop-table \
        "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null
    
    # Compress the backup
    gzip "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}  ✓ Backup created: $BACKUP_FILE ($BACKUP_SIZE)${NC}"
    
    # Rotate old backups (keep only MAX_BACKUPS)
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/*.sql.gz 2>/dev/null | wc -l)
    if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
        EXCESS=$((BACKUP_COUNT - MAX_BACKUPS))
        echo -e "${YELLOW}  Rotating: removing $EXCESS old backup(s)...${NC}"
        ls -1t "$BACKUP_DIR"/*.sql.gz | tail -n "$EXCESS" | xargs rm -f
        echo -e "${GREEN}  ✓ Rotation complete${NC}"
    fi
}

# -------------------------------------------
# Restore
# -------------------------------------------
do_restore() {
    RESTORE_FILE=$2
    
    if [ -z "$RESTORE_FILE" ]; then
        # Use most recent backup
        RESTORE_FILE=$(ls -1t "$BACKUP_DIR"/*.sql.gz 2>/dev/null | head -n1)
        if [ -z "$RESTORE_FILE" ]; then
            echo -e "${RED}  ✗ No backup files found in $BACKUP_DIR${NC}"
            exit 1
        fi
        echo -e "${YELLOW}  Using most recent backup: $RESTORE_FILE${NC}"
    fi
    
    if [ ! -f "$RESTORE_FILE" ]; then
        echo -e "${RED}  ✗ File not found: $RESTORE_FILE${NC}"
        exit 1
    fi
    
    echo -e "${RED}  ⚠ WARNING: This will overwrite the current database!${NC}"
    read -p "  Are you sure? (y/N): " CONFIRM
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
        echo -e "${YELLOW}  Cancelled.${NC}"
        exit 0
    fi
    
    echo -e "${YELLOW}  Restoring from: $RESTORE_FILE${NC}"
    
    gunzip -c "$RESTORE_FILE" | mysql \
        -h "$DB_HOST" \
        -P "$DB_PORT" \
        -u "$DB_USER" \
        -p"$DB_PASSWORD" \
        "$DB_NAME" 2>/dev/null
    
    echo -e "${GREEN}  ✓ Database restored successfully${NC}"
}

# -------------------------------------------
# List backups
# -------------------------------------------
do_list() {
    echo -e "${YELLOW}Available backups:${NC}"
    echo ""
    
    if [ ! "$(ls -A "$BACKUP_DIR"/*.sql.gz 2>/dev/null)" ]; then
        echo -e "  ${YELLOW}No backups found.${NC}"
        return
    fi
    
    printf "  %-4s %-40s %s\n" "#" "Filename" "Size"
    printf "  %-4s %-40s %s\n" "---" "$(printf '%0.s-' {1..40})" "------"
    
    INDEX=1
    for f in $(ls -1t "$BACKUP_DIR"/*.sql.gz 2>/dev/null); do
        SIZE=$(du -h "$f" | cut -f1)
        BASENAME=$(basename "$f")
        printf "  ${GREEN}%-4s${NC} %-40s %s\n" "$INDEX" "$BASENAME" "$SIZE"
        INDEX=$((INDEX + 1))
    done
    echo ""
}

# -------------------------------------------
# Docker backup (from Docker container)
# -------------------------------------------
do_docker_backup() {
    echo -e "${YELLOW}Creating backup from Docker container...${NC}"
    
    BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_docker_${TIMESTAMP}.sql"
    
    docker exec lihqet-db mysqldump \
        -u root \
        -p"${DB_PASSWORD}" \
        --single-transaction \
        "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null
    
    gzip "$BACKUP_FILE"
    echo -e "${GREEN}  ✓ Docker backup created: ${BACKUP_FILE}.gz${NC}"
}

# -------------------------------------------
# Route to the correct action
# -------------------------------------------
case "$ACTION" in
    backup)
        do_backup
        ;;
    restore)
        do_restore "$@"
        ;;
    list)
        do_list
        ;;
    docker-backup)
        do_docker_backup
        ;;
    *)
        echo -e "${RED}Unknown action: $ACTION${NC}"
        echo "Usage: bash scripts/db-backup.sh [backup|restore|list|docker-backup]"
        exit 1
        ;;
esac
