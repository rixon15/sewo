FROM php:8.4-apache
# Or your preferred PHP version (e.g., 8.2, 8.3)

# Install necessary extensions
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    postgresql-client \
    libpq-dev \
    zip \
    unzip \
    git

RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN #docker-php-ext-install -j$(awk '/^MemTotal:/{print int($2 / 1024)}' /proc/meminfo) gd pdo pdo_mysql
RUN docker-php-ext-configure pgsql --with-pgsql=/usr/include/postgresql/14 # Adjust if your postgresql version is different
RUN docker-php-ext-install pgsql
RUN docker-php-ext-install pdo_pgsql

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copy application code *SECOND*
COPY . .

# Set working directory
WORKDIR /var/www/html

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


# Install project dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader



# Set file permissions (important!)
RUN chown -R www-data:www-data storage
RUN chmod -R 755 storage
RUN chmod -R 755 bootstrap/cache


# Expose port
EXPOSE 80

# Set environment variables (if needed)
# ENV APP_KEY=base64:some_random_key  # Generate a real key later!
