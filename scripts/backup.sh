#!/bin/sh

# Current date for backup file name
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/backups"

# Ensure backup directory exists
mkdir -p $BACKUP_DIR

# Create backup
echo "Starting backup for islamic_portal at $DATE..."
mongodump --host mongodb --port 27017 --username ${MONGO_ROOT_USER:-admin} --password ${MONGO_ROOT_PASSWORD:-password123} --authenticationDatabase admin --db islamic_portal --archive=$BACKUP_DIR/db_$DATE.archive --gzip

# Success message
if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_DIR/db_$DATE.archive"
  # Optional: Delete backups older than 7 days
  find $BACKUP_DIR -name "db_*.archive" -mtime +7 -delete
else
  echo "Backup failed!"
fi
