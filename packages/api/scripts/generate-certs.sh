#!/bin/bash

# Визначаємо директорію скрипта та корінь проекту API
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
API_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Створюємо директорію для сертифікатів в корені API проекту
mkdir -p "$API_ROOT/certs"

# Створюємо конфігураційний файл для OpenSSL
cat > "$API_ROOT/certs/openssl.cnf" << EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = State
L = City
O = Organization
CN = 192.168.0.157

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names
extendedKeyUsage = serverAuth, clientAuth

[alt_names]
DNS.1 = localhost
DNS.2 = 127.0.0.1
DNS.3 = 192.168.0.116
IP.1 = 192.168.0.116
IP.2 = 127.0.0.1
EOF

# Генеруємо приватний ключ
openssl genrsa -out "$API_ROOT/certs/key.pem" 2048

# Генеруємо самопідписаний сертифікат з SAN
openssl req -x509 -new -nodes \
  -key "$API_ROOT/certs/key.pem" \
  -days 365 \
  -out "$API_ROOT/certs/cert.pem" \
  -config "$API_ROOT/certs/openssl.cnf" \
  -extensions v3_req

# Видаляємо тимчасовий конфігураційний файл
rm "$API_ROOT/certs/openssl.cnf"

echo "SSL certificates generated successfully!" 