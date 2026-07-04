#!/bin/sh
set -e

export PGPASSWORD="$POSTGRES_PASSWORD"

if [ -n "$1" ]; then
    FILE="/backups/$1"
else
    FILE=$(ls -t /backups/backup_*.sql 2>/dev/null | head -n 1)
fi

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
    echo "No se encontro ningun archivo de backup para restaurar"
    exit 1
fi

echo "Restaurando base de datos desde: $FILE"
psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$FILE"
echo "$(date '+%Y-%m-%d %H:%M:%S') OK restauracion completada desde ${FILE}" >> /backups/backup.log
echo "Restauracion completada"
