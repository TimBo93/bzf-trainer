# BZF Trainer - Kategorien

## Geplante Kategorien

Basierend auf der Analyse der Prüfungsfragen werden folgende Kategorien erstellt:

| ID | Kategorie | Beschreibung | Fragen (geschätzt) |
|----|-----------|--------------|-------------------|
| `legal` | Rechtliche Grundlagen | TKG, Flugfunkzeugnisse, Zuständigkeiten | ~10 |
| `definitions` | Begriffsbestimmungen | Luft-/Bodenfunkstelle, Blindsendung, etc. | ~15 |
| `abbreviations` | Abkürzungen | IMC, FIR, ATIS, CTR, AIS, SAR, UTC, etc. | ~20 |
| `q-codes` | Q-Gruppen | QNH, QFE, QDM, QDR, QTE, etc. | ~15 |
| `message-types` | Meldungsarten | Not-, Dringlichkeits-, Flugsicherheitsmeldungen | ~15 |
| `callsigns` | Rufzeichen | Luftfunkstellen, Bodenfunkstellen, Buchstabieren | ~15 |
| `transmission` | Übermittlung | Zeit, Zahlen, Frequenzen, Höhen | ~10 |
| `atc` | Flugverkehrskontrolle | Freigaben, Anweisungen, Verfahren | ~30 |
| `airspace` | Lufträume | Luftraumklassen, CTR, FIR, etc. | ~15 |
| `emergency` | Notverfahren | Mayday, Pan Pan, Transponder, Signale | ~20 |
| `radar` | Radar & Navigation | Radar-Dienste, Peilung, VDF | ~15 |
| `weather` | Meteorologie | ATIS, VOLMET, Wettermeldungen | ~15 |
| `procedures` | Betriebsverfahren | Start, Landung, Platzrunde, Rollen | ~25 |
| `equipment` | Funkausrüstung | Frequenzen, Reichweite, Störungen | ~10 |

**Gesamt: ~230 Fragen**

---

## Kategorie-Mapping Format

Die Datei `assets/categories.json` wird folgendes Format haben:

```json
{
  "categories": [
    {
      "id": "legal",
      "name": "Rechtliche Grundlagen",
      "description": "TKG, Flugfunkzeugnisse, Zuständigkeiten",
      "icon": "scale",
      "color": "#3B82F6"
    },
    {
      "id": "definitions",
      "name": "Begriffsbestimmungen",
      "description": "Grundlegende Begriffe des Flugfunks",
      "icon": "book-open",
      "color": "#8B5CF6"
    }
    // ... weitere Kategorien
  ],
  "questionMapping": {
    "1": "legal",
    "2": "legal",
    "3": "legal",
    "4": "legal",
    "5": "legal",
    "6": "legal",
    "7": "legal",
    "8": "legal",
    "9": "legal",
    "10": "definitions",
    "11": "definitions",
    "12": "definitions",
    "13": "definitions",
    "14": "definitions",
    "15": "abbreviations",
    "16": "abbreviations",
    "17": "abbreviations"
    // ... alle 230 Fragen
  }
}
```

---

## Detaillierte Fragen-Zuordnung

### Rechtliche Grundlagen (`legal`) - Fragen 1-9
- Frage 1: ITU - Internationale Organisation
- Frage 2: TKG - Rechtliche Grundlage
- Frage 3: Bundesnetzagentur - Frequenzzuteilung
- Frage 4-6: Flugfunkzeugnis-Pflicht
- Frage 7-9: BZF I/II Berechtigungen

### Begriffsbestimmungen (`definitions`) - Fragen 10-14
- Frage 10: Luftfunkstelle
- Frage 11: Bodenfunkstelle
- Frage 12: Blindsendung
- Frage 13: Allgemeiner Anruf
- Frage 14: Rollhalt

### Abkürzungen (`abbreviations`) - Fragen 15-24
- Frage 15: CTR
- Frage 16: IMC
- Frage 17: FIR
- Frage 18: H24
- Frage 19: HX
- Frage 20: HJ
- Frage 21: AIS
- Frage 22: SAR
- Frage 23: UTC
- Frage 24: ATIS

### Q-Gruppen (`q-codes`) - Fragen 25-33
- Frage 25-26: QFE, QNH
- Frage 27-28: Höhenmesser-Einstellung
- Frage 29-32: QDM, QDR
- Frage 33: Peilfunkmeldungen

### Meldungsarten (`message-types`) - Fragen 34-43
- Frage 34-35: Meldungsprioritäten
- Frage 36-43: Klassifizierung von Meldungen

### Übermittlung (`transmission`) - Fragen 44-50
- Frage 44: Uhrzeitübermittlung
- Frage 45-46: Buchstabieren
- Frage 47: Höhenübermittlung
- Frage 48: QNH Übermittlung
- Frage 49: Frequenzübermittlung
- Frage 50: Zeitübermittlung

### Rufzeichen (`callsigns`) - Fragen 51-62
- Frage 51-56: Bodenfunkstellen-Rufzeichen
- Frage 57: Rufzeichen weglassen
- Frage 58-61: Luftfunkstellen-Rufzeichen

*... weitere Zuordnung wird bei der Implementierung vervollständigt*

---

## Status

- [ ] Alle Fragen durchgehen und kategorisieren
- [ ] categories.json erstellen
- [ ] Kategorien im UI anzeigen
- [ ] Filter nach Kategorie implementieren
