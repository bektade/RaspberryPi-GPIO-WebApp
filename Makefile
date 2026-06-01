.DEFAULT_GOAL := help
SHELL         := /bin/bash

PORT         ?= 8080
API_PORT     ?= 5000
WEB_PORT     ?= 3000
DOCKER_USER  ?= becktkh
TAG          ?= latest
VENV         := .venv
PYTHON       := $(VENV)/bin/python
PIP          := $(VENV)/bin/pip
COMPOSE      := docker compose
COMPOSE_HUB  := $(COMPOSE) -f docker-compose.hub.yml
IMAGE        := $(DOCKER_USER)/rp-gpio:$(TAG)

export DOCKER_USER TAG PORT

.PHONY: help install dev api web test build up down restart logs ps url check clean
.PHONY: hub-up hub-down hub-pull publish login push tag-images

help: ## Show commands
	@printf "\n  \033[1mGPIO Control\033[0m — Next.js + Flask\n\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
	@printf "\n  UI   → http://localhost:$(PORT)\n"
	@printf "  API  → http://localhost:$(API_PORT)/api/gpio\n"
	@printf "  Hub  → $(IMAGE)\n\n"

install: $(VENV)/bin/python ## Install Python deps
	$(PIP) install -q -r requirements.txt
	@if uname -m | grep -qE 'aarch64|armv7l'; then \
		$(PIP) install -q lgpio 2>/dev/null || true; \
	fi

$(VENV)/bin/python:
	python3 -m venv $(VENV)

dev: ## Run API + Next.js dev servers
	@printf "  API :$(API_PORT)  Web :$(WEB_PORT)\n"
	@trap 'kill 0' EXIT; \
	API_URL=http://127.0.0.1:$(API_PORT) $(PYTHON) app.py & \
	cd frontend && npm run dev -- -p $(WEB_PORT)

api: install ## Run Flask API only
	$(PYTHON) app.py

web: ## Run Next.js dev server
	cd frontend && API_URL=http://127.0.0.1:$(API_PORT) npm run dev -- -p $(WEB_PORT)

test: ## Smoke-test API
	@($(PYTHON) -c "\
from app import app; \
c = app.test_client(); \
assert c.get('/api/gpio?gpiostateall=').status_code == 200; \
assert c.get('/health').status_code == 200; \
print('  \033[32m✓\033[0m API checks passed')" 2>/dev/null) \
	|| (python3 -c "\
from app import app; \
c = app.test_client(); \
assert c.get('/api/gpio?gpiostateall=').status_code == 200; \
assert c.get('/health').status_code == 200; \
print('  \033[32m✓\033[0m API checks passed')")

build: ## Build Docker images
	$(COMPOSE) build

up: ## Start stack (build locally if needed)
	PORT=$(PORT) $(COMPOSE) up -d --build
	@$(MAKE) --no-print-directory url

hub-pull: ## Pull pre-built images from Docker Hub
	$(COMPOSE_HUB) pull

hub-up: ## Pull images and start (no local build)
	$(COMPOSE_HUB) pull
	PORT=$(PORT) $(COMPOSE_HUB) up -d
	@$(MAKE) --no-print-directory url

hub-down: ## Stop pull-only stack
	$(COMPOSE_HUB) down

login: ## Log in to Docker Hub (required before publish)
	docker login

publish: build ## Build and push image to Docker Hub
	$(COMPOSE) push
	@printf "  \033[32m✓\033[0m pushed $(IMAGE)\n"

push: publish ## Alias for publish

down: ## Stop stack
	$(COMPOSE) down
	$(COMPOSE_HUB) down 2>/dev/null || true

restart: down up ## Restart stack

logs: ## Tail all logs
	$(COMPOSE) logs -f

ps: ## Show container status
	@$(COMPOSE) ps

url: ## Print LAN URL
	@host=$$(hostname -I 2>/dev/null | awk '{print $$1}'); \
	printf "  \033[32m→\033[0m http://$${host:-localhost}:$(PORT)\n"

check: ## Verify GPIO group (native API)
	@if groups | grep -q '\bgpio\b'; then \
		printf "  \033[32m✓\033[0m user in gpio group\n"; \
	else \
		printf "  \033[33m!\033[0m add user: sudo usermod -aG gpio $$USER\n"; \
	fi

clean: ## Remove venv and caches
	rm -rf $(VENV) __pycache__ frontend/node_modules frontend/.next

clean-all: down clean ## Full teardown
	$(COMPOSE) down --rmi local -v 2>/dev/null || true
