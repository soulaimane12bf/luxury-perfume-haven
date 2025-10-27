This project does not include an opinionated migrations folder by default.

I added a small SQL migration at `backend/migrations/20251027_add_admin_socials.sql` to add two columns to the `admins` table:

- instagram VARCHAR(255)
- facebook VARCHAR(255)

How to apply

1) Determine your database type (Postgres or MySQL). The SQL file contains commented examples for both.

2) Run the appropriate commands. Examples:

Postgres (psql):

```powershell
# Example with DATABASE_URL env var
$env:[REDACTED_DB_URL]
psql $env:DATABASE_URL -c "ALTER TABLE admins ADD COLUMN instagram VARCHAR(255);"
psql $env:DATABASE_URL -c "ALTER TABLE admins ADD COLUMN facebook VARCHAR(255);"
```

MySQL (mysql client):

```powershell
mysql -u $env:DB_USER -p -h $env:DB_HOST $env:DB_NAME -e "ALTER TABLE admins ADD COLUMN instagram VARCHAR(255) NULL;"
mysql -u $env:DB_USER -p -h $env:DB_HOST $env:DB_NAME -e "ALTER TABLE admins ADD COLUMN facebook VARCHAR(255) NULL;"
```

3) If you use Sequelize CLI or another migration system, create an up/down migration that performs the same steps (and commit it to your migrations folder).

4) After applying the migration, restart the backend server so Sequelize model changes are in sync with the DB schema.

Rollback

- To remove the columns (Postgres):
  ALTER TABLE admins DROP COLUMN IF EXISTS instagram;
  ALTER TABLE admins DROP COLUMN IF EXISTS facebook;

- To remove the columns (MySQL):
  ALTER TABLE admins DROP COLUMN instagram;
  ALTER TABLE admins DROP COLUMN facebook;

If you'd like, I can also:
- Generate a Sequelize migration file that uses the project's conventions (if you have a preferred migrations folder or use Sequelize CLI), or
- Apply the SQL to a running database if you provide credentials (not recommended here).

Tell me which option you prefer and I will proceed.