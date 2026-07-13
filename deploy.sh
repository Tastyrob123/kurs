#!/usr/bin/env bash
# ------------------------------------------------------------------
# Parallel-sicherer Kurs-Deploy  (Repo: Tastyrob123/kurs)
# Mehrere Chats duerfen GLEICHZEITIG arbeiten. Nichts wird ueberschrieben.
# Nutzung:   ./deploy.sh "commit message"
# ------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")"
MSG="${1:-kurs update}"

# 1) Eigene Aenderungen committen (nur falls vorhanden)
git add -A
git diff --cached --quiet || git commit -m "$MSG"

# 2) Auf neuesten Stand rebasen -- NIE --force.
#    Konflikt => STOPP zur Aufloesung, nichts wird verworfen.
git fetch origin --quiet
if ! git rebase origin/main; then
  echo ""
  echo "‼  REBASE-KONFLIKT: ein anderer Chat hat dieselbe Stelle geaendert."
  echo "   -> BEIDE Aenderungen behalten, dann:  git rebase --continue && ./deploy.sh"
  exit 1
fi

# 3) Push (fast-forward, kein force -> kann fremde Commits nicht ueberschreiben)
git push origin main

# 4) jsDelivr purgen  => sofort live, KEIN GitHub-Pages-Build, der abgewuergt wird
for f in kurs.js kurs.css; do
  curl -s "https://purge.jsdelivr.net/gh/Tastyrob123/kurs@main/$f" >/dev/null || true
done

# 5) Verifizieren, dass die neue Datei wirklich ausgeliefert wird
sleep 3
HEAD_SHA=$(git rev-parse --short HEAD)
echo "✅ gepusht ($HEAD_SHA) + jsDelivr gepurged. In ~10-30s ueberall live. Robert: Cmd+Shift+R."
