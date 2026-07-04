#!/bin/sh
set -e

INTERVAL=${BACKUP_INTERVAL_MINUTES:-15}
mkdir -p /backups
export PGPASSWORD="$POSTGRES_PASSWORD"

echo "$(date '+%Y-%m-%d %H:%M:%S') INFO agente de backup iniciado, intervalo=${INTERVAL}min" >> /backups/backup.log

while true; do
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    FILE="/backups/backup_${TIMESTAMP}.sql"

    if pg_dump -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -F p -f "$FILE"; then
        SIZE=$(du -h "$FILE" | cut -f1)
        echo "$(date '+%Y-%m-%d %H:%M:%S') OK backup generado: ${FILE} (${SIZE})" >> /backups/backup.log
        find /backups -name "backup_*.sql" -mtime +7 -delete
    else
        echo "$(date '+%Y-%m-%d %H:%M:%S') ERROR fallo la generacion del backup" >> /backups/backup.log
    fi

    sleep "$((INTERVAL * 60))"
done
