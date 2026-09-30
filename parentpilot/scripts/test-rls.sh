#!/usr/bin/env bash
# Applies every migration to a throwaway local Postgres (with a stub of Supabase's
# auth schema) and runs supabase/tests/rls.sql. Needs PostgreSQL server binaries.
# Usage: npm run test:db
set -euo pipefail
cd "$(dirname "$0")/.."

BIN="${PGBIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1 || true)}"
[ -x "$BIN/initdb" ] || { echo "PostgreSQL server binaries not found (set PGBIN)"; exit 2; }

DIR="$(mktemp -d /tmp/pp-rls.XXXXXX)"
PORT="${PGPORT_TEST:-55433}"
RUN=""
if [ "$(id -u)" = "0" ]; then
  id pguser >/dev/null 2>&1 || useradd -m pguser
  chown pguser "$DIR"
  RUN="su pguser -c"
fi
run() { if [ -n "$RUN" ]; then $RUN "$*"; else bash -c "$*"; fi; }
cleanup() { run "'$BIN/pg_ctl' -D '$DIR' stop -m immediate" >/dev/null 2>&1 || true; rm -rf "$DIR"; }
trap cleanup EXIT

run "'$BIN/initdb' -D '$DIR' -A trust" >/dev/null
run "'$BIN/pg_ctl' -D '$DIR' -o '-p $PORT -k $DIR' -l '$DIR/log' -w start" >/dev/null
PSQL="$BIN/psql -h $DIR -p $PORT -X -q -v ON_ERROR_STOP=1 postgres"
[ -n "$RUN" ] && PSQL="su pguser -c \"$PSQL\"" || true

psql_file() { if [ -n "$RUN" ]; then su pguser -c "$BIN/psql -h $DIR -p $PORT -X -q -v ON_ERROR_STOP=1 postgres -f '$PWD/$1'" 2>&1; else $BIN/psql -h "$DIR" -p "$PORT" -X -q -v ON_ERROR_STOP=1 postgres -f "$1" 2>&1; fi; }
psql_stdin() { if [ -n "$RUN" ]; then su pguser -c "$BIN/psql -h $DIR -p $PORT -X -q -v ON_ERROR_STOP=1 postgres"; else $BIN/psql -h "$DIR" -p "$PORT" -X -q -v ON_ERROR_STOP=1 postgres; fi; }

# Minimal stand-in for what Supabase provides: auth.users, auth.uid(), anon/authenticated roles.
psql_stdin <<'SQL'
create schema auth;
create table auth.users (id uuid primary key default gen_random_uuid());
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create role anon nologin; create role authenticated nologin;
grant usage on schema auth, public to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
SQL

for f in supabase/migrations/*.sql; do echo "applying $f"; psql_file "$f"; done

# Supabase grants table privileges to anon/authenticated; RLS does the gating. Mirror that.
psql_stdin <<'SQL'
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
SQL

OUT="$(psql_file supabase/tests/rls.sql)" || { echo "$OUT"; echo "RLS TESTS FAILED"; exit 1; }
echo "$OUT" | grep -E "^(psql:.*)?(NOTICE:  )?(PASS|FAIL)|^==|ALL RLS" | sed 's/^psql:[^ ]* NOTICE:  //; s/^NOTICE:  //'
echo "$OUT" | grep -q "ALL RLS TESTS PASSED"
