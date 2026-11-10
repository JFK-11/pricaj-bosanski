# Pričaj bosanski – Hinweise für Claude

Offline-Lern-App (PWA) für Bosnisch, genutzt als Home-Bildschirm-App auf einem iPhone. Der Nutzer spricht Deutsch; antworte auf Deutsch.

## Aufbau
- `app/index.html`: die ganze App in einer Datei (HTML, CSS, JS). Kein Framework, kein Build.
- `app/sw.js`: Service Worker für den Offline-Betrieb.
- `claude-version/pricaj.html`: Quelltext der Claude-Artifact-Version (Tutor-Gespräche über `window.claude`). Läuft nur in Claude, wird nicht veröffentlicht.
- `netlify.toml`: veröffentlicht `app/`, Push auf `main` = live.

## Regeln
- Bei jeder Änderung in `app/` die Konstante `VERSION` in `app/sw.js` hochzählen (`pricaj-v4` → `pricaj-v5`), sonst bekommt das iPhone das Update nicht.
- Keine externen Ressourcen (keine CDNs, keine Google Fonts). Externe Schriften haben den Start auf dem iPhone blockiert.
- Im Service Worker nie `index.html` cachen, nur `./`: Netlify leitet `index.html` auf `/` um, und iOS lehnt umgeleitete Antworten beim Start ab.
- Nutzerdaten liegen in `localStorage` unter `pricaj-app` (`profile`, `vocab`, `days`, `path`). Struktur rückwärtskompatibel halten, nie ohne Migration umbenennen.
- Die Daten hängen an der Adresse `iridescent-pie-25a1a1.netlify.app`. Projekt nicht umbenennen, bevor es eine Sicherungsfunktion gibt.
- Austauschcode zwischen Claude-Version und App: `PRICAJ:` + Base64 von `{"v":1,"items":[{"bs","de","laut","p"}]}` (`p:1` = persönlicher Satz).

## Inhalte
- Bosnisch in lateinischer Schrift, ijekavisch, bosnische Standardformen (kafa, hljeb, sedmica, hiljada).
- Der Lerner ist ein Mann: Ich-Sätze in maskulinen Formen (bio sam, sretan sam).
- Lernpfad folgt seinem 30-Tage-Plan: Laute & erste Sätze → Alltag & Verben → Essen, Orte, Vergangenheit → persönliche Sätze.

## Testen
- `cd app && python3 -m http.server 8000`, dann im Browser auf Handybreite prüfen, auch offline (Service Worker).
