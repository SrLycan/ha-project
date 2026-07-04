FROM postgres:16-alpine

WORKDIR /backups

COPY backup.sh /backup.sh
COPY restore.sh /restore.sh

RUN chmod +x /backup.sh /restore.sh

ENTRYPOINT ["/backup.sh"]
