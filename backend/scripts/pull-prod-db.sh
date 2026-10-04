#!/usr/bin/env bash
# Replace the local dev database with a copy of prod.
#
#   PROD_DATABASE_URL='postgres://…' backend/scripts/pull-prod-db.sh
#
# PROD_DATABASE_URL is the External Database URL from the Render dashboard
# (Postgres instance → Connect → External). It is never written to disk.
#
# What it does:
#   1. backs up the local DB to ~/maldevera-db-backups/local-<timestamp>.dump
#   2. dumps prod (read-only — nothing is written to prod)
#   3. drops and recreates the local DB, restores the prod dump into it
#   4. deletes the prod dump (it can hold customer details)
#
# Local connection settings come from backend/.env (DB_NAME, DB_HOST,
# DB_USERNAME, DB_PASSWORD). Stop the backend first or the drop will fail.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"
BACKUP_DIR="$HOME/maldevera-db-backups"

die() { echo "error: $*" >&2; exit 1; }

[ -n "${PROD_DATABASE_URL:-}" ] || die "set PROD_DATABASE_URL to Render's External Database URL"

# Only the DB_* lines — the rest of .env holds secrets this script has no business reading.
env_get() { grep -E "^$1=" "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- | sed -e 's/^["'\'']//' -e 's/["'\'']$//' || true; } 
LOCAL_DB="$(env_get DB_NAME)"
export PGHOST="$(env_get DB_HOST)"
export PGUSER="$(env_get DB_USERNAME)"
export PGPASSWORD="$(env_get DB_PASSWORD)"
LOCAL_DB="${LOCAL_DB:-maldevera_merch_inventory}"
PGHOST="${PGHOST:-localhost}"
[ -n "$PGUSER" ] || unset PGUSER
[ -n "$PGPASSWORD" ] || unset PGPASSWORD

# pg_dump refuses to dump a server newer than itself, and the pg_dump first on
# PATH here is Homebrew's 14 while Postgres.app ships 16. Find the newest one
# installed and make sure it's at least as new as prod.
major_of() { "$1" --version | sed -E 's/[^0-9]*([0-9]+).*/\1/'; }
best_bin=""; best_major=0
for d in /Applications/Postgres.app/Contents/Versions/*/bin \
         /opt/homebrew/opt/postgresql@*/bin \
         /usr/local/opt/postgresql@*/bin \
         "$(dirname "$(command -v pg_dump 2>/dev/null || echo /nonexistent/x)")"; do
    [ -x "$d/pg_dump" ] && [ -x "$d/pg_restore" ] && [ -x "$d/psql" ] || continue
    m="$(major_of "$d/pg_dump")"
    if [ "$m" -gt "$best_major" ]; then best_major="$m"; best_bin="$d"; fi
done
[ -n "$best_bin" ] || die "no pg_dump found — install Postgres.app or 'brew install postgresql@16'"

prod_major="$("$best_bin/psql" "$PROD_DATABASE_URL" -Atc 'show server_version_num' 2>/dev/null)" \
    || die "couldn't connect to prod — check PROD_DATABASE_URL (use the External URL, not Internal)"
prod_major=$((prod_major / 10000))
if [ "$best_major" -lt "$prod_major" ]; then
    die "prod is Postgres $prod_major but the newest pg_dump here is $best_major — 'brew install postgresql@$prod_major'"
fi
echo "using $best_bin (pg_dump $best_major, prod is $prod_major)"

echo
echo "This will DROP the local database '$LOCAL_DB' on $PGHOST and replace it with prod."
read -r -p "Type the database name to continue: " answer
[ "$answer" = "$LOCAL_DB" ] || die "cancelled"

mkdir -p "$BACKUP_DIR"
stamp="$(date +%Y%m%d-%H%M%S)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

if "$best_bin/psql" -d postgres -Atc "select 1 from pg_database where datname = '$LOCAL_DB'" | grep -q 1; then
    echo "→ backing up local to $BACKUP_DIR/local-$stamp.dump"
    "$best_bin/pg_dump" -Fc -d "$LOCAL_DB" -f "$BACKUP_DIR/local-$stamp.dump"
fi

echo "→ dumping prod"
"$best_bin/pg_dump" "$PROD_DATABASE_URL" -Fc --no-owner --no-privileges -f "$tmp/prod.dump"

echo "→ recreating $LOCAL_DB"
"$best_bin/dropdb" --if-exists "$LOCAL_DB" \
    || die "couldn't drop $LOCAL_DB — is the backend (or Postico) still connected? Your backup is in $BACKUP_DIR"
"$best_bin/createdb" "$LOCAL_DB"

echo "→ restoring"
# pg_restore exits non-zero on harmless warnings (e.g. Render-only roles or
# extensions), so report rather than abort — the data is what matters.
if ! "$best_bin/pg_restore" --no-owner --no-privileges -d "$LOCAL_DB" "$tmp/prod.dump"; then
    echo "pg_restore reported warnings (above) — usually harmless; check the app works"
fi

echo
"$best_bin/psql" -d "$LOCAL_DB" -Atc \
    "select 'products: ' || (select count(*) from products) || ', variants: ' || (select count(*) from variants)" \
    2>/dev/null || true
echo "done. Local backup: $BACKUP_DIR/local-$stamp.dump"
echo "restore it with: $best_bin/pg_restore --clean --no-owner -d $LOCAL_DB $BACKUP_DIR/local-$stamp.dump"
