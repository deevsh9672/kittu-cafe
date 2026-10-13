# Backup and Disaster Recovery Guide

---

## 1. Automated MongoDB Backups

To create an archive backup of the Kittu Cafe database:

```bash
# Full database backup
mongodump --uri="mongodb://localhost:27017/kittu_cafe" --archive="kittu_cafe_backup_$(date +%Y%m%d_%H%M%S).gz" --gzip
```

### Scheduled Daily Backup (Linux Cron):
```cron
# Run daily at 3:00 AM Asia/Kolkata
0 3 * * * mongodump --uri="$MONGODB_URI" --archive="/backups/kittu_cafe_$(date +\%F).gz" --gzip
```

---

## 2. Disaster Recovery & Database Restoration

```bash
# Restore from compressed archive
mongorestore --uri="mongodb://localhost:27017/kittu_cafe" --drop --archive="kittu_cafe_backup_20261013.gz" --gzip
```

The `--drop` flag ensures existing collections are cleaned before re-importing the archive.

---

## 3. Data Retention & Customer Privacy

Under Indian consumer protection rules:
- Completed financial invoices and payment transaction snapshots are retained for tax reconciliation.
- Personal customer addresses and contact numbers can be purged upon customer request via the customer data deletion workflow.
