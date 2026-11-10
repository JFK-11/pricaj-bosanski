# Pričaj bosanski

Bosnisch lernen auf dem iPhone, auch offline: Lernpfad in 24 Etappen, Satzbaukästen, Hören & Sagen, Grundwortschatz, Zahlen, Quiz, Karteikarten mit Wiederholungsplan.

- **App:** `app/` – eine einzige `index.html` plus Service Worker, Manifest und Icons. Kein Build.
- **Veröffentlichung:** Netlify (Projekt `iridescent-pie-25a1a1`) baut automatisch bei jeder Änderung auf `main`.
- **Claude-Version:** `claude-version/pricaj.html` ist der Quelltext der Version mit Tutor, die als Artifact in Claude läuft. Sie funktioniert nur dort.
