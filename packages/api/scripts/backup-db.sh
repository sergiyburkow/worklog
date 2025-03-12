#!/bin/bash

# Додаємо шлях до PostgreSQL 15 в PATH
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Перевіряємо версію pg_dump
PG_VERSION=$(pg_dump --version | grep -oE '[0-9]+' | head -1)
if [ "$PG_VERSION" != "15" ]; then
    echo "Error: Wrong pg_dump version. Expected 15, got $PG_VERSION"
    exit 1
fi

# Створюємо директорію для бекапів, якщо її немає
BACKUP_DIR="$(dirname "$0")/../prisma/backup"
mkdir -p "$BACKUP_DIR"

# Створюємо часову мітку
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Створюємо повний бекап (структура + дані)
FULL_BACKUP_FILE="$BACKUP_DIR/${TIMESTAMP}_full.sql"
pg_dump -h localhost -U maestro -d worklog -Fp --clean --if-exists > "$FULL_BACKUP_FILE"

# Створюємо бекап тільки даних (без таблиці міграцій)
DATA_BACKUP_FILE="$BACKUP_DIR/${TIMESTAMP}_data.sql"
pg_dump -h localhost -U maestro -d worklog --data-only -T _prisma_migrations > "$DATA_BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Database backups created successfully:"
    echo "Full backup: $(basename "$FULL_BACKUP_FILE")"
    echo "Data backup: $(basename "$DATA_BACKUP_FILE")"
else
    echo "Error: Failed to create database backups"
    exit 1
fi 