mongodump --host mongo -u root -p root123 --authenticationDatabase admin --db scaffold --out /opt/backups/backup-$(date +"%Y%m%d_%H%M%S")