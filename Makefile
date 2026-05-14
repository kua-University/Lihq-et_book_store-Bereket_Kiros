# ============================================
# Lihq'et Bookstore — Makefile
# ============================================
# Shortcut commands for common development tasks.
# Usage: make [command]

.PHONY: setup dev build docker-up docker-down backup healthcheck help

# --- Development ---

setup: ## Install all dependencies and setup environment
	bash scripts/setup.sh

dev: ## Start backend and frontend in development mode
	npm run dev & cd frontend && npm run dev

build: ## Build frontend for production
	cd frontend && npm run build

# --- Docker ---

docker-up: ## Start all services using Docker Compose
	docker-compose up --build -d

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## Follow Docker logs
	docker-compose logs -f

# --- Database ---

backup: ## Create a timestamped database backup
	bash scripts/db-backup.sh backup

restore: ## Restore the most recent database backup
	bash scripts/db-backup.sh restore

seed: ## Load sample data into the database
	mysql -u $$(grep DB_USER .env | cut -d '=' -f2) -p$$(grep DB_PASSWORD .env | cut -d '=' -f2) $$(grep DB_NAME .env | cut -d '=' -f2) < database/seed.sql

# --- Maintenance ---

healthcheck: ## Check the health of all services
	bash scripts/healthcheck.sh

clean: ## Remove node_modules and build artifacts
	rm -rf node_modules frontend/node_modules frontend/dist

# --- Help ---

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
