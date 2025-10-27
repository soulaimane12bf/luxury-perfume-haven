-- Migration: add instagram and facebook columns to admins table
-- Run the appropriate section for your database (Postgres or MySQL).

/* PostgreSQL */
-- ALTER TABLE admins ADD COLUMN instagram VARCHAR(255);
-- ALTER TABLE admins ADD COLUMN facebook VARCHAR(255);

/* MySQL */
-- ALTER TABLE admins ADD COLUMN instagram VARCHAR(255) NULL AFTER smtp_password;
-- ALTER TABLE admins ADD COLUMN facebook VARCHAR(255) NULL AFTER instagram;

-- Notes:
-- 1) Uncomment the two ALTER TABLE statements that match your DB and run them
--    using psql/mysql client or via your DB admin tooling.
-- 2) If you are using a migration tool (Sequelize CLI / Umzug / Knex), create
--    a corresponding migration using your tooling and include these SQL steps
--    in the up() migration. Provide a down() migration that drops the columns.

-- Example psql command (Postgres):
-- psql "$DATABASE_URL" -c "ALTER TABLE admins ADD COLUMN instagram VARCHAR(255);"
-- psql "$DATABASE_URL" -c "ALTER TABLE admins ADD COLUMN facebook VARCHAR(255);"

-- Example MySQL command (mysql client):
-- mysql -u $DB_USER -p -h $DB_HOST $DB_NAME -e "ALTER TABLE admins ADD COLUMN instagram VARCHAR(255) NULL;"
-- mysql -u $DB_USER -p -h $DB_HOST $DB_NAME -e "ALTER TABLE admins ADD COLUMN facebook VARCHAR(255) NULL;"
