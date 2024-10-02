ifneq (,$(wildcard ./.env))
    include .env
    export
    ENV_FILE_PARAM = --env-file .env
endif

ifeq ($(OS),Windows_NT)
    DOCKER_COMPOSE := docker-compose
else
    DOCKER_COMPOSE := docker compose
endif

build:
	$(DOCKER_COMPOSE) up --build -d --remove-orphans

up:
	$(DOCKER_COMPOSE) up

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs

migrate:
	$(DOCKER_COMPOSE) exec facilities-api python3 manage.py migrate --noinput

makemigrations:
	$(DOCKER_COMPOSE) exec facilities-api python3 manage.py makemigrations

superuser:
	$(DOCKER_COMPOSE) exec facilities-api python3 manage.py createsuperuser

down-v:
	$(DOCKER_COMPOSE) down -v

shell:
	$(DOCKER_COMPOSE) exec facilities-api python3 manage.py shell