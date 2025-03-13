#!/bin/bash

# Створюємо директорію для сертифікатів
mkdir -p certs

# Створюємо конфігураційний файл для OpenSSL
cat > certs/openssl.cnf << EOF
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
DNS.3 = 192.168.0.157
IP.1 = 192.168.0.157
IP.2 = 127.0.0.1
EOF

# Генеруємо приватний ключ
openssl genrsa -out certs/key.pem 2048

# Генеруємо самопідписаний сертифікат з SAN
openssl req -x509 -new -nodes \
  -key certs/key.pem \
  -days 365 \
  -out certs/cert.pem \
  -config certs/openssl.cnf \
  -extensions v3_req

# Видаляємо тимчасовий конфігураційний файл
rm certs/openssl.cnf

echo "SSL certificates generated successfully!" 