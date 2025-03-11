#!/bin/bash

# Перевіряємо наявність бекапів
BACKUP_DIR="$(dirname "$0")/../prisma/backup"
backups=($(ls -1 "$BACKUP_DIR"/*.sql 2>/dev/null))

if [ ${#backups[@]} -eq 0 ]; then
    echo "No backup files found in $BACKUP_DIR/"
    exit 1
fi

# Виводимо список доступних бекапів
echo "Available backups:"
for i in "${!backups[@]}"; do
    echo "[$i] $(basename "${backups[$i]}")"
done

# Запитуємо користувача, який бекап відновити
read -p "Enter the number of the backup to restore: " backup_number

if ! [[ "$backup_number" =~ ^[0-9]+$ ]] || [ "$backup_number" -ge "${#backups[@]}" ]; then
    echo "Error: Invalid backup number"
    exit 1
fi

selected_backup="${backups[$backup_number]}"
echo "Restoring from: $(basename "$selected_backup")"

# Відновлюємо базу даних
/opt/homebrew/opt/postgresql@15/bin/psql -h localhost -U maestro -d worklog < "$selected_backup"

if [ $? -eq 0 ]; then
    echo "Database restored successfully!"
else
    echo "Error: Failed to restore database"
    exit 1
fi 