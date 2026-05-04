docker-build:
	docker compose -f compose.dev.yaml up --build
start:
	docker compose -f compose.dev.yaml up -d

check-ps:
	docker compose -f compose.dev.yaml ps

stop:
	docker compose -f compose.dev.yaml down

logs:
	docker compose -f compose.dev.yaml logs -f

migrate:
	docker compose -f compose.dev.yaml exec workspace php artisan migrate

seed:
	docker compose -f compose.dev.yaml exec workspace php artisan db:seed

fresh:
	docker compose -f compose.dev.yaml exec workspace php artisan migrate:fresh --seed

test:
	docker compose -f compose.dev.yaml exec workspace php artisan test

test-coverage:
	docker compose -f compose.dev.yaml exec workspace php artisan test --coverage

shell:
	docker compose -f compose.dev.yaml exec workspace bash

serve:
	docker compose -f compose.dev.yaml exec workspace php artisan serve --host=0.0.0.0 --port=8000

vite:
	docker compose -f compose.dev.yaml up -d vite

npm-install:
	docker compose -f compose.dev.yaml exec workspace bash -lc 'export NVM_DIR="$$HOME/.nvm" && . "$$NVM_DIR/nvm.sh" && npm install'

build-assets:
	docker compose -f compose.dev.yaml exec workspace bash -lc 'export NVM_DIR="$$HOME/.nvm" && . "$$NVM_DIR/nvm.sh" && npm run build'
log-email:
	docker compose -f compose.dev.yaml exec workspace bash -c "grep 'INFO' storage/logs/laravel.log | tail -10"

schedule:
	docker compose -f compose.dev.yaml exec workspace php artisan schedule:run

schedule-work:
	docker compose -f compose.dev.yaml exec workspace php artisan schedule:work