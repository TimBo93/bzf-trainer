# BZF Trainer - Entwicklungsplan

## Übersicht

| Phase   | Tasks                | Status           |
| ------- | -------------------- | ---------------- |
| Phase 1 | Daten & Setup        | ✅ Abgeschlossen |
| Phase 2 | Core & Infrastruktur | ✅ Abgeschlossen |
| Phase 3 | UI/Pages             | ✅ Abgeschlossen |
| Phase 4 | Features & Polish    | ✅ Abgeschlossen |

---

## Phase 1: Daten & Setup ✅

### 1.1 Fragen kategorisieren ✅

- [x] Alle 261 Fragen aus `questions.json` analysiert
- [x] 17 Kategorien definiert basierend auf Themengebieten
- [x] `public/categories.json` erstellt mit Mapping

**Implementierte Kategorien:**

- Rechtliche Grundlagen (TKG, Flugfunkzeugnis)
- Begriffsbestimmungen (Luftfunkstelle, Bodenfunkstelle, etc.)
- Abkürzungen (IMC, FIR, ATIS, etc.)
- Q-Gruppen (QNH, QFE, QDM, QDR, etc.)
- Meldungsarten und Prioritäten
- Übermittlung (Buchstabiertafel, Zeit, Zahlen)
- Rufzeichen
- Frequenzen
- Flugverkehrsdienste
- Sprechgruppen
- Transponder
- Notverfahren
- Flugplatz & Platzrunde
- Instrumentenflug
- Sichtflug (VFR)
- Navigation & Radar
- ATIS & Wetter

### 1.2 Angular Projekt aufsetzen ✅

- [x] Angular 20 mit Standalone Components
- [x] Zoneless Application
- [x] SCSS als Style-Preprocessor
- [x] Routing konfiguriert

### 1.3 Tailwind CSS einrichten ✅

- [x] Tailwind CSS 3 installiert
- [x] Dark Mode Support (`class` strategy)
- [x] shadcn-ähnliche CSS-Variablen

### 1.4 UI Libraries ✅

- [x] Lucide Angular für Icons
- [x] Custom Components statt ng-shadcn

---

## Phase 2: Core & Infrastruktur ✅

### 2.1 Core Module erstellt ✅

**Models/Interfaces:**

- [x] `question.model.ts` - Question, ShuffledQuestion, ShuffledAnswer
- [x] `category.model.ts` - Category, CategoriesData
- [x] `progress.model.ts` - QuestionProgress, QuizSession, QuizAnswer, QuizConfig

**Services:**

- [x] `QuestionService` - Fragen laden, shufflen, filtern; lädt beide Kataloge (BZF & BZF‑E) und stellt Variantenzugriff bereit
- [x] `StorageService` - IndexedDB Wrapper, Progress-Tracking
- [x] `SettingsService` - Theme, Immediate Feedback, Standard-Variante (BZF/BZF‑E)
- [x] `QuizService` - Quiz-Logik, State Management

### 2.2 IndexedDB Setup (Dexie.js) ✅

- [x] Dexie.js installiert
- [x] Database Schema definiert (questionProgress, quizSessions, settings)

### 2.3 Quiz Engine ✅

- [x] Fragen shufflen (Fisher-Yates)
- [x] Antworten shufflen
- [x] Quiz-Modi implementiert:
  - **Alle Fragen**: Alle 261 Fragen
  - **Zufällig**: 20 zufällige Fragen
  - **Kategorie**: Nach Kategorie filtern
  - **Schwachstellen**: Falsch beantwortete
  - **Prüfung**: 45 Fragen (nicht implementiert)

---

## Phase 3: UI/Pages ✅

### 3.1 App Shell & Navigation ✅

- [x] Header mit Logo und Navigation
- [x] Mobile-optimiert
- [x] Theme Toggle im Header
- [x] Sprachumschalter (DE/EN) im Header
- [x] Varianten-Umschalter (BZF/BZF‑E) im Header

### 3.2 Home/Dashboard Page ✅

**Route:** `/`

- [x] Willkommens-Header
- [x] Schnellstart-Buttons
- [x] Fortschritts-Ring
- [x] Statistik-Vorschau
- [x] Kategorieliste

### 3.3 Quiz Page ✅

**Route:** `/quiz`

- [x] Fortschrittsbalken
- [x] Frage-Nummer und Kategorie
- [x] Frage-Text
- [x] 4 Antwort-Buttons
- [x] Direktes Feedback beim Klick
- [x] Nächste Frage / Quiz beenden
- [x] Varianten-Umschalter pro Frage (BZF/BZF‑E)

### 3.4 Results Page ✅

**Route:** `/results/:sessionId`

- [x] Score-Kreis (Prozent)
- [x] Richtig/Falsch Anzahl
- [x] Liste falscher Antworten
- [x] Aktions-Buttons

### 3.5 Statistics Page ✅

**Route:** `/statistics`

- [x] Gesamtfortschritt
- [x] Fortschritt pro Kategorie
- [x] Erfolgsquote
- [x] Lernstreifen (Streak)
- [x] Tipps basierend auf Fortschritt

### 3.6 Settings Page ✅

**Route:** `/settings`

- [x] Theme Toggle (Dark/Light/System)
- [x] Sofortiges Feedback Toggle
- [x] Fortschritt zurücksetzen
- [x] Über die App
- [x] Standard-Variante auswählen (BZF/BZF‑E)

---

## Phase 4: Features & Polish ✅

### 4.1 Theme Switcher ✅

- [x] System-Präferenz erkennen
- [x] Theme in localStorage speichern
- [x] Dark/Light/System Auswahl

### 4.2 Responsive Design ✅

- [x] Mobile-first
- [x] Touch-friendly Button-Größen
- [x] Optimiert für alle Bildschirmgrößen

### 4.3 Disclaimer ✅

- [x] Disclaimer-Dialog bei erstem Besuch
- [x] Hinweise zu Hobby-Projekt, Flugsimulatoren, AI, Datenschutz

### 4.4 SEO & Deployment ✅

- [x] robots.txt
- [x] sitemap.xml
- [x] Meta-Tags in index.html

---

## Nicht implementiert (Optional)

- [ ] PWA (Service Worker, Offline)
- [ ] Prüfungsmodus mit Zeitlimit
- [ ] Daten Export/Import
- [ ] Unit Tests
- [ ] E2E Tests
- [ ] Animationen

---

## Technologie-Stack (Final)

| Bereich   | Technologie                                |
| --------- | ------------------------------------------ |
| Framework | Angular 20 (Zoneless, Standalone, Signals) |
| Styling   | Tailwind CSS 3                             |
| Icons     | Lucide Angular                             |
| Datenbank | IndexedDB via Dexie.js                     |
| Build     | Angular CLI                                |
