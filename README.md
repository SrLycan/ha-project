# Startup HA Project

Arquitectura de alta disponibilidad con Docker Compose para AWS EC2.

## Servicios

- **postgres**: base de datos con persistencia en volumen Docker (`pgdata`), sin puertos expuestos al host.
- **backend**: API REST (Node/Express). Usuarios y compras persisten en PostgreSQL. Servicios viven en memoria (sin persistencia).
- **frontend**: React + Nginx. Sirve el panel admin y hace de reverse proxy hacia el backend (`/api/*`). Único punto expuesto en el puerto 80.
- **backup**: agente que corre `pg_dump` cada `BACKUP_INTERVAL_MINUTES` minutos, guarda `.sql` y un log de auditoría en `./backups`.
- **monitor**: mide latencia del endpoint `/health` del backend cada 5s y expone un dashboard SLI, accesible internamente a través de nginx (no necesita puerto propio abierto en el firewall/Security Group).

## Uso en EC2

```bash
git clone <tu-repo>
cd ha-project
cp .env.example .env
nano .env   # cambia POSTGRES_PASSWORD
docker compose up -d --build
```

Panel admin: `http://<IP_PUBLICA_EC2>`
Dashboard SLI: `http://<IP_PUBLICA_EC2>/monitor/` (o directo desde el panel admin, sección "Monitor de disponibilidad")

## Backup manual

```bash
docker exec startup_backup ls /backups
```

## Restaurar en caso de desastre (< 3 min)

```bash
docker exec startup_backup /restore.sh
```

Para restaurar un backup específico:

```bash
docker exec startup_backup /restore.sh backup_20260704_120000.sql
```

## Probar persistencia

```bash
docker compose down
docker compose up -d
# los usuarios y compras siguen ahi, los servicios se reinician vacios
```

## Probar auto-recuperación (Prueba de Caos)

```bash
docker stop startup_backend
# gracias a restart: unless-stopped, Docker lo vuelve a levantar solo
```
