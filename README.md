# BZF Trainer

Eine Single Page Application (SPA) zum Üben der Prüfungsfragen für das **BZF I/II** (Beschränkt Gültiges Sprechfunkzeugnis für den Flugfunkdienst).

🔗 **Live-Demo**: [bzf.borowski-software.de](https://bzf.borowski-software.de)

## ⚠️ Hinweis

Dies ist ein **privates Hobby-Projekt** von [Tim Borowski](https://borowski-software.de) und dient **ausschließlich zum Lernen für Flugsimulatoren** wie dem Microsoft Flight Simulator. Es ist nicht für die Vorbereitung auf eine echte BZF-Prüfung gedacht.

Die Fragen stammen aus dem offiziellen Fragenkatalog der Bundesnetzagentur (Stand 2024) und wurden mit AI aus dem Original-PDF extrahiert.

## 🎯 Features

- ✅ Alle 261 offiziellen BZF I/II Prüfungsfragen
- ✅ Antworten werden bei jeder Anzeige zufällig gemischt
- ✅ 17 Kategorien mit Filteroptionen
- ✅ Verschiedene Lernmodi (alle Fragen, zufällig, nach Kategorie, Schwachstellen)
- ✅ Sofortiges Feedback beim Antworten
- ✅ Fortschritt wird lokal im Browser gespeichert
- ✅ Dark/Light Mode
- ✅ Responsive Design (Mobile-first)
- ✅ Statistiken und Lernfortschritt
- ✅ Kein Backend - alle Daten bleiben lokal

## 🛠 Technologie-Stack

- **Framework**: Angular 20 (Standalone Components, Signals, Zoneless)
- **Styling**: Tailwind CSS 3 mit shadcn-ähnlichen CSS-Variablen
- **Icons**: Lucide Angular
- **Lokale Datenbank**: IndexedDB via Dexie.js
- **Kein Backend** - alles läuft lokal im Browser

## 🚀 Entwicklung

### Voraussetzungen

- Node.js 20.x oder 22.x
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
# oder
ng serve
```

Die App läuft dann unter `http://localhost:4200/`.

### Build

```bash
npm run build
```

Die Build-Artefakte werden im `dist/` Verzeichnis erstellt.

## 📁 Projektstruktur

```
src/app/
├── core/
│   ├── db/          # Dexie.js Datenbank
│   ├── models/      # TypeScript Interfaces
│   └── services/    # Angular Services
├── pages/
│   ├── home/        # Dashboard
│   ├── quiz/        # Quiz-Seite
│   ├── results/     # Ergebnis-Seite
│   ├── statistics/  # Statistiken
│   └── settings/    # Einstellungen
└── shared/
    └── components/  # Wiederverwendbare Komponenten
```

## 📖 Dokumentation

- [Entwicklungsplan](docs/PLAN.md)
- [Architektur](docs/ARCHITECTURE.md)
- [Kategorien](docs/CATEGORIES.md)

## 📄 Quellen

Die Prüfungsfragen stammen aus dem offiziellen Fragenkatalog der Bundesnetzagentur:

- [Download PDF (Stand 2024)](https://www.bundesnetzagentur.de/SharedDocs/Downloads/DE/Sachgebiete/Telekommunikation/Unternehmen_Institutionen/Frequenzen/Funkzeugnisse/Flugfunkzeugnisse/2024Pruefungsfragen_BZFII_BZFI_pdf.pdf?__blob=publicationFile&v=2)

## 🤖 Mit AI erstellt

Diese Webseite wurde mit Unterstützung von Künstlicher Intelligenz programmiert. Die Fragen wurden mit AI aus dem Original-PDF extrahiert und gruppiert.

## 💬 Feedback

Feedback von Flugschüler*innen, (Simulator-)Pilot*innen und Lehrer\*innen ist willkommen!

📧 **E-Mail**: tim[at]borowski-software.de

## 📄 Lizenz

Private Nutzung - Prüfungsfragen © Bundesnetzagentur
