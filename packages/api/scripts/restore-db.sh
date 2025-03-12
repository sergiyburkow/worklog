#!/bin/bash

# Додаємо шлях до PostgreSQL 15 в PATH
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Перевіряємо версію psql
PG_VERSION=$(psql --version | grep -oE '[0-9]+' | head -1)
if [ "$PG_VERSION" != "15" ]; then
    echo "Error: Wrong psql version. Expected 15, got $PG_VERSION"
    exit 1
fi

# Перевіряємо наявність аргументу
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

BACKUP_FILE="$1"

# Перевіряємо існування файлу
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Якщо це повний бекап (містить _full.sql в імені)
if [[ "$BACKUP_FILE" == *"_full.sql" ]]; then
    echo "Restoring full backup..."
    psql worklog -f "$BACKUP_FILE"
else
    # Якщо це бекап тільки даних
    echo "Restoring data backup..."
    # Спочатку скидаємо базу і застосовуємо міграції
    echo "Resetting database and applying migrations..."
    npx prisma migrate reset --force
    # Потім відновлюємо дані
    psql worklog -f "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo "Database restored successfully"
else
    echo "Error: Failed to restore database"
    exit 1
fi 