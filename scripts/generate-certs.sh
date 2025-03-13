#!/bin/bash

# Створюємо директорії для сертифікатів
mkdir -p packages/web/certs
mkdir -p packages/api/certs

# Генеруємо приватний ключ
openssl genrsa -out packages/web/certs/key.pem 2048

# Генеруємо CSR (Certificate Signing Request)
openssl req -new -key packages/web/certs/key.pem -out packages/web/certs/cert.csr -subj "/CN=localhost"

# Генеруємо самопідписаний сертифікат
openssl x509 -req -days 365 -in packages/web/certs/cert.csr -signkey packages/web/certs/key.pem -out packages/web/certs/cert.pem

# Видаляємо CSR файл, він більше не потрібен
rm packages/web/certs/cert.csr

# Копіюємо сертифікати в директорію api
cp packages/web/certs/key.pem packages/api/certs/
cp packages/web/certs/cert.pem packages/api/certs/

echo "Сертифікати згенеровано успішно!"
echo "Розташування:"
echo "- Приватний ключ: packages/web/certs/key.pem, packages/api/certs/key.pem"
echo "- Сертифікат: packages/web/certs/cert.pem, packages/api/certs/cert.pem" 