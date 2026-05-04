#!/usr/bin/env sh
set -eu

APP_USER="${APP_USER:-app}"
APP_GROUP="$(id -gn "${APP_USER}" 2>/dev/null || echo "${APP_USER}")"

mkdir -p \
    /var/www/bootstrap/cache \
    /var/www/storage/framework/cache \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/testing \
    /var/www/storage/framework/views \
    /var/www/storage/logs

if [ "$(id -u)" = "0" ]; then
    chown -R "${APP_USER}:${APP_GROUP}" /var/www/storage /var/www/bootstrap/cache
fi

chmod -R ug+rwx /var/www/storage /var/www/bootstrap/cache

exec "$@"
