#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
PORT="${PORT:-3000}"
HOST="${HOST:-0.0.0.0}"

if curl -sf "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
  echo "Next.js already responding on port ${PORT}"
  exit 0
fi

SESSION="next-dev"
TMUX_CONF="/exec-daemon/tmux.portal.conf"
tmux -f "$TMUX_CONF" has-session -t "$SESSION" 2>/dev/null ||
  tmux -f "$TMUX_CONF" new-session -d -s "$SESSION" -c "$PWD" -- "${SHELL:-bash}" -l -c \
    "exec npm run dev -- --hostname ${HOST} --port ${PORT}"

for _ in $(seq 1 120); do
  if curl -sf "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
    echo "Next.js ready on http://127.0.0.1:${PORT}/"
    exit 0
  fi
  sleep 1
done

echo "Timed out waiting for Next.js on port ${PORT}" >&2
exit 1
