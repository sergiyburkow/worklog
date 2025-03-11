#!/bin/bash

# Створюємо директорію для бекапів, якщо її немає
BACKUP_DIR="$(dirname "$0")/../prisma/backup"
mkdir -p "$BACKUP_DIR"

# Створюємо бекап
BACKUP_FILE="$BACKUP_DIR/$(date +%Y%m%d_%H%M%S).sql"
/opt/homebrew/opt/postgresql@15/bin/pg_dump -h localhost -U maestro -d worklog -Fp --clean --if-exists > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Database backup created successfully: $(basename "$BACKUP_FILE")"
else
    echo "Error: Failed to create database backup"
    exit 1
fi 