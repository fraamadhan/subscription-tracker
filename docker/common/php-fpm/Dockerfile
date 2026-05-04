FROM php:8.4-fpm AS production

ARG UID=1000
ARG GID=1000

RUN apt-get update && apt-get install -y --no-install-recommends \
    $PHPIZE_DEPS \
    git \
    unzip \
    libicu-dev \
    libpq-dev \
    libzip-dev \
    libxml2-dev \
    && docker-php-ext-install -j"$(nproc)" \
    bcmath \
    intl \
    pdo_mysql \
    pdo_pgsql \
    pgsql \
    zip \
    soap \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN if getent group "${GID}" >/dev/null; then \
      group_name="$(getent group "${GID}" | cut -d: -f1)"; \
    else \
      groupadd -g "${GID}" app; \
      group_name="app"; \
    fi \
    && useradd -m -u "${UID}" -g "${GID}" -s /bin/bash app \
    && sed -ri "s/^user = .*/user = app/" /usr/local/etc/php-fpm.d/www.conf \
    && sed -ri "s/^group = .*/group = ${group_name}/" /usr/local/etc/php-fpm.d/www.conf \
    && sed -ri "s|^listen = .*|listen = 9000|" /usr/local/etc/php-fpm.d/www.conf \
    && sed -ri "s/^;clear_env = no/clear_env = no/" /usr/local/etc/php-fpm.d/www.conf

WORKDIR /var/www

COPY ./docker/development/php-fm/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

EXPOSE 9000
CMD ["php-fpm"]

FROM production AS development

ARG XDEBUG_ENABLED=true
ARG XDEBUG_MODE=develop,coverage,debug,profile
ARG XDEBUG_HOST=host.docker.internal
ARG XDEBUG_IDE_KEY=DOCKER
ARG XDEBUG_LOG=/dev/stdout
ARG XDEBUG_LOG_LEVEL=0

RUN if [ "${XDEBUG_ENABLED}" = "true" ]; then \
      pecl install xdebug && \
      docker-php-ext-enable xdebug && \
      { \
        echo "xdebug.mode=${XDEBUG_MODE}"; \
        echo "xdebug.idekey=${XDEBUG_IDE_KEY}"; \
        echo "xdebug.log=${XDEBUG_LOG}"; \
        echo "xdebug.log_level=${XDEBUG_LOG_LEVEL}"; \
        echo "xdebug.client_host=${XDEBUG_HOST}"; \
        echo "xdebug.start_with_request=yes"; \
      } > /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
    fi
