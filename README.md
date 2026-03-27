# Rock teste full stack

```bash
docker compose up -d --build
```

Laravel
```bash
docker compose exec app composer install

docker compose exec app php artisan key:generate

docker compose exec app php artisan migrate

docker compose exec app php artisan db:seed
```

## Documentation

http://localhost:8000/api/documentation