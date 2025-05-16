#!/bin/bash

# Додаємо шлях до curl в PATH
export PATH="/opt/homebrew/bin:$PATH"

# Перевіряємо наявність curl
if ! command -v curl &> /dev/null; then
    echo "Error: curl is not installed"
    exit 1
fi

# Завантажуємо змінні з .env файлу
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Встановлюємо значення за замовчуванням, якщо змінні не визначені
HOST=${HOST:-localhost}
PORT=${PORT:-3001}
PROTOCOL=${PROTOCOL:-https}

# Створюємо директорію для документації, якщо вона не існує
mkdir -p docs

# Отримуємо Swagger документацію
curl -k "${PROTOCOL}://${HOST}:${PORT}/api-json" -o docs/swagger.json

if [ $? -eq 0 ]; then
    echo "Swagger documentation saved to docs/swagger.json"
else
    echo "Error: Failed to save Swagger documentation"
    exit 1
fi 