#!/bin/bash

# Додаємо шлях до PostgreSQL 15 в PATH
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Перевіряємо версію psql
PG_VERSION=$(psql --version | grep -oE '[0-9]+' | head -1)
if [ "$PG_VERSION" != "15" ]; then
    echo "Error: Wrong psql version. Expected 15, got $PG_VERSION"
    exit 1
fi

# Визначаємо директорію скрипта та корінь API проекту
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
API_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
BACKUPS_DIR="$API_ROOT/prisma/backup"

# Функція для перевірки існування файлу та пошуку його
find_backup_file() {
    local file_path="$1"
    
    # Якщо це абсолютний шлях або відносний з "/", перевіряємо як є
    if [[ "$file_path" == /* ]] || [[ "$file_path" == ./* ]] || [[ "$file_path" == ../* ]]; then
        if [ -f "$file_path" ]; then
            echo "$file_path"
            return 0
        fi
    else
        # Перевіряємо як відносний шлях від поточного каталогу
        if [ -f "$file_path" ]; then
            echo "$(cd "$(dirname "$file_path")" && pwd)/$(basename "$file_path")"
            return 0
        fi
    fi
    
    # Якщо не знайдено, шукаємо в директорії backups
    local backup_file="$BACKUPS_DIR/$(basename "$file_path")"
    if [ -f "$backup_file" ]; then
        echo "$backup_file"
        return 0
    fi
    
    return 1
}

# Функція для знаходження останнього бекапу
get_latest_backup() {
    # Шукаємо обидва типи бекапів (full та data)
    local latest_full=$(ls -t "$BACKUPS_DIR"/*_full.sql 2>/dev/null | head -1)
    local latest_data=$(ls -t "$BACKUPS_DIR"/*_data.sql 2>/dev/null | head -1)
    
    # Порівнюємо за датою модифікації
    if [ -n "$latest_full" ] && [ -n "$latest_data" ]; then
        if [ "$latest_full" -nt "$latest_data" ]; then
            echo "$latest_full"
        else
            echo "$latest_data"
        fi
    elif [ -n "$latest_full" ]; then
        echo "$latest_full"
    elif [ -n "$latest_data" ]; then
        echo "$latest_data"
    else
        return 1
    fi
}

BACKUP_FILE=""

# Якщо передано параметр
if [ "$#" -ge 1 ]; then
    BACKUP_FILE=$(find_backup_file "$1")
    
    if [ -z "$BACKUP_FILE" ]; then
        echo "Error: Backup file not found: $1"
        echo "Searched in:"
        echo "  - $1"
        echo "  - $BACKUPS_DIR/$(basename "$1")"
        exit 1
    fi
else
    # Якщо немає параметрів, шукаємо останній бекап
    BACKUP_FILE=$(get_latest_backup)
    
    if [ -z "$BACKUP_FILE" ]; then
        echo "Error: No backup files found in $BACKUPS_DIR"
        exit 1
    fi
    
    # Показуємо конфірм з дефолтним Yes
    echo "No backup file specified. Found latest backup:"
    echo "  $(basename "$BACKUP_FILE")"
    echo ""
    read -p "Restore this backup? [Y/n]: " confirm
    
    # Дефолт - Yes (Enter або Y/y)
    if [[ "$confirm" =~ ^[Nn]$ ]]; then
        echo "Restore cancelled"
        exit 0
    fi
fi

# Перевіряємо існування файлу (фінальна перевірка)
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Restoring backup: $(basename "$BACKUP_FILE")"

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