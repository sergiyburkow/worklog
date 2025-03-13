#!/bin/bash

# Створюємо директорію для сертифікатів
mkdir -p ../certs

# Генеруємо приватний ключ
openssl genrsa -out certs/key.pem 2048

# Генеруємо самопідписаний сертифікат
openssl req -x509 -new -nodes \
  -key ../certs/key.pem \
  -days 365 \
  -out ../certs/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "SSL certificates generated successfully!" 