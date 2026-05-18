# ArcUp — Philosophy & Content Model

> Briefing-Dokument für die Erstellung produktionsreifer Seed-Daten.
> Reihenfolge der Erstellung: **Quellen → Habits → ARCs**.
> Gilt für `arc_sources`, `habits` (+ `habit_sources`), `arcs` (+ `arc_habits`).

---

## 1. Die App-Philosophie

ArcUp ist **kein Habit-Tracker**. Es ist ein strukturiertes System für persönliches Wachstum, das drei Zeit-Ebenen verbindet:

| Ebene | Zeitraum | Repräsentiert durch | Frage, die es beantwortet |
|---|---|---|---|
| **Macro** | Lebenszeit | **Compass** (5 Life Areas + Vision) | *Wer will ich werden?* |
| **Meso** | 1–12 Wochen | **ARC** (zeitlich begrenzte Challenge) | *Was übe ich gerade gezielt?* |
| **Micro** | Täglich/Wöchentlich | **Habit** (numerisch messbar) | *Was tue ich heute konkret?* |

**Tagline:** *ArcUp: Building Better Habits.*

**Kernprinzipien:**

1. **Strukturiert statt beliebig.** Habits sind keine Free-Text-Notizen, sondern numerische Messgrößen mit Zielwert, Richtung (Above/Below) und Einheit. Jedes Habit ist quantifiziert.
2. **Zeit-geboxte Anstrengung.** Echte Verhaltensänderung passiert in fokussierten Phasen. Ein ARC ist eine bewusste Verpflichtung über 1–12 Wochen — kein „forever streak".
3. **Wissen als Fundament.** Jede Empfehlung hat eine Quelle: ein Buch, eine Studie, einen Vortrag, einen Creator. Wir behaupten nichts ohne Beleg.
4. **Progressive Steigerung.** Targets können statisch oder über die ARC-Dauer linear interpoliert sein (`target_start_value → target_end_value`). Wachstum passiert *durch* Steigerung, nicht durch Wiederholung.
5. **Kuratierte Library.** Habits, ARCs und Quellen werden zentral kuratiert (`creator_type = 'System'`). User wählen aus einer durchdachten Auswahl, statt eine Wildwiese aus eigenen Habits anzulegen. (User können `Selfmade` ARCs aus bestehenden Habits zusammenstellen — aber Habits selbst bleiben kuratiert.)
6. **Fünf Life Areas als Compass.** Body, Mind, Growth, Relationships, Leisure. Jedes Inhaltsobjekt (Quelle, Habit, ARC) gehört genau **einer** Life Area an. Das hält den Compass scharf und verhindert „passt überall"-Inhalte.

---

## 1.1 Die fünf Life Areas

Die `life_area_id` ist im seed bereits final vergeben (per `00000000000000_initial.sql`). **IDs sind stabil** — auf sie wird in `arc_sources`, `habits` und `arcs` per FK referenziert.

| ID | Name (en) | Icon | Themen-Beispiele für Quellen / Habits / ARCs |
|---:|---|---|---|
| **1** | **Body** | `body` | Ausdauer (Laufen, Radfahren, Schwimmen, Zone 2), Krafttraining, Mobility, Schlaf, Hydration, Ernährung (Protein, Gemüse, Whole Foods, Intermittent Fasting), Kälte/Hitze (Cold Shower, Sauna, Ice Bath), Outdoor-Bewegung (Steps, Wandern, Sonnenexposition), Atemarbeit, Recovery |
| **2** | **Mind** | `mind` | Meditation, Achtsamkeit, Atemtechnik (Box-Breathing, 4-7-8), Stress-Regulation, Fokus / Deep Work, Schlafhygiene mental, Cognitive Load Management, Mood-Tracking, Therapie-/Reflexions-Übungen, Emotionsarbeit, Resilienz |
| **3** | **Growth** | `growth` | Lesen, Lernen (Sprachen, Skills, Kurse), Schreiben / Journaling, Weekly Planning (Quadrant II), Deep Work, Goal-Setting, Visualisierung, Affirmations, Morgenroutinen, Side-Projects, Karriere-Habits, Finanzbildung, Productivity-Systeme |
| **4** | **Relationships** | `relationships` | Quality Time, Active Listening, Date Night, Compliments, Acts of Kindness, Phone-Free Socializing, Gratitude (ausgesprochen), Apology & Repair, Reach Out (alte Kontakte), Mentoring, Familienrituale, Vulnerability-Übungen |
| **5** | **Leisure** | `leisure` | Hobbies (Musik, Malerei, Fotografie), Outdoor-Aktivitäten (Hiking, Forest Bathing, Stargazing), Reisen, Kreatives Schreiben, Spiele/Sport zum Spaß, Digital Detox, Reading for Pleasure, Konzert-/Museums-Besuche, Naturzeit, Handwerk |

**Zuordnungsregel bei Grenzfällen:**
- Eine **Lauf-Quelle** zu Couch-to-5K → **Body** (Mechanik dominiert das Nutzererlebnis), nicht Mind, auch wenn mentale Disziplin enthalten ist.
- *Atomic Habits* → **Growth** (Methodik für Selbstentwicklung), nicht Mind.
- *The 5 Love Languages* → **Relationships** (eindeutig).
- *Into the Wild* → **Leisure** (Naturerfahrung), nicht Body, weil das Erleben im Vordergrund steht.
- *Outlive* (Peter Attia) → **Body** (Longevity-Mechanik), nicht Mind.
- Im Zweifel: **wo trackt der User die direkte Konsequenz?** Dort gehört der Inhalt hin.

---

## 2. Die drei Inhaltstypen und ihre Beziehung

```
        ┌──────────────┐
        │  arc_sources │   "Warum?"   — Wissens-Fundament (Bücher, Artikel, Talks, …)
        └──────┬───────┘
               │ habit_sources (n:n)
               │ + arcs.source_id (optional 1:1, „primäre" Quelle)
               ▼
        ┌──────────────┐
        │    habits    │   "Was?"     — atomare, messbare Tracking-Einheit
        └──────┬───────┘
               │ arc_habits (n:n, mit Target-Konfiguration)
               ▼
        ┌──────────────┐
        │     arcs     │   "Wie & Wann?" — zeitlich begrenzte Challenge (1–12 Wochen)
        └──────────────┘
```

### 2.1 Quellen (`arc_sources`) — das *Warum*

Quellen sind das **Wissens-Backbone** der App. Jede Quelle ist eine eigenständige, mikro-konsumierbare Wissens-Einheit, die der User direkt in der App lesen kann (`content_md`).

**Sechs Typen** (`type`):

| Typ | Beispiel | Verwendung |
|---|---|---|
| `Book` | *Atomic Habits* von James Clear | Klassische Sachbücher mit Methodik-Substanz |
| `Article` | wissenschaftliche Studie, Long-Read, Blog-Post | Kürzere, fokussiertere Quellen |
| `Movie` | Dokumentation, Lecture-Aufzeichnung | Visuelle / narrative Wissensvermittlung |
| `Creator` | Andrew Huberman, Cal Newport, Yuval Harari | Personen-zentriert, Body of Work |
| `Speech` | TED-Talk, Commencement Speech | Pointierte, einzelne Botschaft |
| `ArcUp Original` | von uns selbst geschriebener Inhalt | Synthesen, Lückenfüller, App-spezifisches |

**Pflichtfelder & Konventionen:**
- `title` — prägnant; bei Büchern Originaltitel
- `subtitle` — One-Liner / Tagline (max. ~60 Zeichen, sichtbar in Kacheln)
- `authors` — `text[]`, immer als Array, auch bei einer Person
- `content_md` — **die eigentliche Inhalts-Substanz**: 600–1500 Wörter, lesbar in 4–8 Minuten, in Markdown. Soll für sich allein stehen — kein Verweis auf „in dem Buch lernst du…", sondern die Kernideen direkt destilliert. Aufbau in der Regel: Hook → Kernthese → 3–5 konkrete Prinzipien → praktische Anwendung → kurzer Outro / Reflexionsfrage.
- `image_url` — Cover oder Profilbild (1:1 oder 2:3 für Bücher; HTTPS, möglichst stabile CDN)
- `source_url` — Link zum Original (Buchhandel-neutral, Wikipedia, YouTube, offizielle Site)
- `external_url` / `affiliate_tag` — Affiliate-Link nur wenn vorhanden, nie erfunden
- `estimated_read_minutes` — realistische Schätzung für `content_md` (bei `Movie`/`Speech` die Original-Länge)
- `is_free` — Default `true`. `false` nur bei Quellen, die hinter einer Paid-Tier-Schwelle liegen sollen
- `is_trending` — kuratorisches Feature-Flag für die Home-Carousel „Beliebt & Neu"
- `life_area_id` — genau **eine** Life Area (FK)
- `translations` — JSONB `{ "de": { "title", "subtitle", "content_md" }, "es": {...}, "fr": {...}, "it": {...} }`. Englisch ist Source-of-Truth in den Hauptspalten. **Alle 4 Übersetzungen sind Pflicht** (de, es, fr, it).

**Was eine gute Quelle ausmacht:**
- Sie hat **eine klare These**, nicht „10 zufällige Tipps".
- Sie ist **direkt anwendbar** — der Leser kann am nächsten Tag etwas anders machen.
- Sie hat **Substanz, kein Self-Help-Geschwafel**. Wenn möglich Studien-/Daten-basiert.
- Sie **inspiriert mindestens ein Habit oder einen ARC**, der in der App existiert (oder später existieren wird). Reine „nice to know"-Quellen werden nicht gesourct.

**Verlinkungs-Regel:** Wenn eine Quelle einen Habit oder ARC inspiriert hat, muss sie via `habit_sources` (Habit) bzw. `arcs.source_id` (ARC, optional) verknüpft werden.

---

### 2.2 Habits (`habits`) — das *Was*

Habits sind die atomaren, **numerisch messbaren** Tracking-Einheiten. Sie sind **vom Curator gepflegt**, niemals vom User erstellt.

**Was ist ein Habit?**
Ein Habit ist eine wiederholbare Handlung mit **genau einer primären Messgröße** (z. B. „Laufen — Distanz in km", „Meditation — Dauer in min", „Wasser — Volumen in l"). Habits sind **kein** „Aufgaben-Typ" wie „heute lesen" — sie sind die Skala, auf der gemessen wird.

**Hierarchie (`parent_habit_id`):**
Habits bilden einen **Baum**. Jeder Knoten ist ein eigenständig trackbarer Habit (kein reiner Kategorie-Knoten). Beispiel:

```
Ausdauertraining (primary: min)
├── Laufen (primary: km, secondary: min)
│   ├── Zone 2 Laufen (primary: min, secondary: km)
│   └── Intervall-Lauf (primary: min, secondary: km)
├── Radfahren (primary: km, secondary: min)
└── Schwimmen (primary: m, secondary: min)
```

Die Hierarchie dient drei Zwecken:
1. **Overlap-Detection** — verhindert, dass User in einem ARC gleichzeitig Eltern (*Ausdauertraining*) und Kind (*Laufen*) aktivieren (würde Statistiken verdoppeln).
2. **Roll-up Insights** — ermöglicht Aggregation entlang des Teilbaums.
3. **Taxonomie ohne Extra-Tabelle** — die Struktur lebt direkt auf `habits`.

**Curator-Regeln (siehe `DEVELOPMENT.md §3.8`):**
1. Kinder sollten die Primary-Unit der Eltern als **Secondary** tragen, damit der Eltern-Roll-up entlang einer einheitlichen Dimension funktioniert.
2. Geschwister sollten dimensional ähnlich sein.
3. Ein Habit = eine Primary-Unit. Niemals dasselbe Habit zweimal mit unterschiedlichen Einheiten.
4. **Hard Constraint** (per Trigger erzwungen): Pro Habit-Baum (Root + alle Descendants) maximal **2 unterschiedliche `metric_key`-Werte** über `metric_key` ∪ `secondary_metric_key`.

**Pflichtfelder:**
- `name` — kurz, prägnant, ohne Einheit (die kommt aus `unit_metric`)
- `description` — wissenschaftlicher Hintergrund / das *Warum* hinter diesem Habit, 2–4 Sätze
- `life_area_id` — genau eine
- `icon` — Icon-Identifier (lowercase, kebab-case)
- `metric_key` — eine von `distance | duration | weight | volume | count` (für Roll-up-Aggregation)
- `base_conversion_factor` — `unit_metric × factor = base unit` (siehe Tabelle in `DEVELOPMENT.md §3.8`)
- `unit_metric` (z. B. `km`, `min`, `kg`, `l`, `reps`)
- `unit_imperial` + `conversion_factor` (z. B. `mi`, `factor 0.621371`)
- `step_size_metric` / `step_size_imperial` — UI-Stepper-Schrittweite
- `max_value_metric` / `max_value_imperial` — sinnvolle Obergrenze für UI-Stepper
- `init_value_metric` — Plausibler Default im Logbook
- `is_positive` — `true` bei aufzubauenden Habits, `false` bei zu reduzierenden („Zigaretten")
- `secondary_*` — optional; nur befüllen wenn dimensional sinnvoll
- `theory_md` (optional) — längerer wissenschaftlicher Hintergrund
- `tips_md` (optional) — praktische Umsetzungs-Tipps
- `translations` JSONB — alle 4 Sprachen für `name`, `description`, `theory_md`, `tips_md`

**Verlinkung zu Quellen (`habit_sources`):**
Jeder Habit sollte **mindestens eine Quelle** referenzieren, die ihn wissenschaftlich oder methodisch begründet. n:n — eine Quelle kann viele Habits inspirieren, ein Habit kann auf mehreren Quellen ruhen.

**Was ein guter Habit ist:**
- **Atomar** — eine einzige messbare Sache, kein „Sport machen" (zu vage), sondern „Laufen in km" oder „Krafttraining in min".
- **Generalisierbar** — funktioniert für viele User-Profile, nicht nur Spezialfälle.
- **In mindestens einem ARC nutzbar** — Habits ohne ARC-Anwendung gehören nicht in die Library.
- **Hat eine Quelle** — `habit_sources`-Eintrag.

---

### 2.3 ARCs (`arcs`) — das *Wie & Wann*

Ein ARC ist eine **zeitlich begrenzte Challenge** über 1–12 Wochen, die **1–N Habits bündelt** und sie mit konkreten Ziel-Konfigurationen versieht. ARCs sind die zentrale Aktions-Einheit der App: User starten einen ARC, leben ihn aus, und schließen ihn ab (`arc_runs`).

**Pflichtfelder:**
- `title` — prägnant, oft im Stil „Verb + Objekt + Zeitraum-Hint" (z. B. *„Tiefer schlafen in 4 Wochen"*, *„30 Tage Atem-Reset"*)
- `subtitle` — One-Liner-Versprechen
- `theory_md` — der **Why**-Teil: warum funktioniert dieser ARC, welche Mechanik dahinter, welche Studien. 400–800 Wörter, Markdown.
- `tips_md` — der **How**-Teil: praktische Umsetzungs-Hinweise, häufige Stolpersteine, Tagesablauf-Beispiele. 300–600 Wörter.
- `source_id` — optional, aber **stark empfohlen**: die *eine* primäre Quelle, die diesen ARC inspiriert hat. (Weitere Quellen kommen über die enthaltenen Habits → `habit_sources`.)
- `cover_url` — Cover-Bild (HTTPS, idealerweise 16:9 oder 4:3)
- `duration_weeks` — 1–12. Sweet Spot: 4 (für etablierte Patterns), 8 (für tiefgreifende Veränderungen), 12 (für maximale Transformation).
- `life_area_id` — genau eine (auch wenn Habits aus mehreren stammen *könnten* — der ARC selbst hat einen Schwerpunkt)
- `difficulty` — `Easy | Medium | Hard | Extreme`
- `creator_type` — für Seed-Daten immer `'System'`
- `is_free` / `required_level` — Monetarisierungs- und Progression-Gates
- `is_seasonal` + `available_from` / `available_until` — nur für saisonale ARCs (z. B. „Dry January", „Sommer-Lauf-Challenge")
- `translations` — alle 4 Sprachen für `title`, `subtitle`, `theory_md`, `tips_md`

**Habit-Konfiguration via `arc_habits`:**
Pro ARC werden 1–N Habits angehängt, jeweils mit:
- `habit_id` — Referenz auf den kuratierten Habit
- `target_start_value` — Startwert in **metrischer Einheit** (z. B. 10 für „10 km")
- `target_end_value` — nur bei `target_mode = 'Progressive'`, ebenfalls metrisch
- `target_mode` — `Static` (gleicher Zielwert über die ganze ARC-Dauer) oder `Progressive` (linear interpoliert von start → end über die ARC-Dauer)
- `target_direction` — `Above` (Wert ≥ Target, z. B. Schritte) oder `Below` (Wert ≤ Target, z. B. Zigaretten)
- `target_interval` — `Daily` oder `Weekly`
- `time_of_day` — `Morning | Afternoon | Evening | Anytime`
- **Constraint (DB):** ein Habit kann pro ARC nur **einmal** vorkommen (`arc_habits_unique_habit_per_arc`).
- **Curator-Regel:** Niemals Eltern *und* Kind aus dem Habit-Baum gleichzeitig in einem ARC. Niemals ein Habit in zwei `target_interval`-Modi gleichzeitig (gleicher Habit zweimal Daily+Weekly im selben ARC ist per Constraint ohnehin verboten).

**Was einen guten ARC ausmacht:**
- **Klares Versprechen.** Title + subtitle sagen, was der User nach Abschluss anders kann oder hat.
- **3–6 Habits** als Sweet Spot. Weniger = wenig Substanz; mehr = User überfordert.
- **Mischung aus Daily + Weekly** wo sinnvoll: Daily-Habits für tägliche Routine, Weekly für Volumen-Ziele („3 Krafttrainings pro Woche").
- **Difficulty ehrlich gewählt.** `Extreme` ist die Ausnahme (z. B. „Cold Shower Daily 12 Weeks"), nicht der Default.
- **Progressive Targets nutzen, wo Wachstum die Mechanik ist.** Couch-to-5K-Logik: starte bei 1 km, ende bei 5 km. Statisch nur, wenn das Habit von Tag 1 in voller Höhe machbar sein soll (z. B. „10 min Meditation täglich").
- **Eine inspirierende Primary-Source.** `source_id` zeigt auf das Buch/den Artikel, der dem User vermittelt, *warum* dieser ARC die Sache wert ist.

---

## 3. Seed-Strategie & Reihenfolge

### Schritt 1 — Quellen anlegen
- Pro Life Area mindestens 8–12 Quellen.
- Mix aus Typen anstreben: nicht nur Books, auch Articles, Creators, Speeches, ArcUp Originals.
- `content_md` ist die wichtigste Spalte — hier liegt der Endnutzer-Wert. Niemals leer lassen.
- Pro Quelle alle 4 Übersetzungen mitliefern.

### Schritt 2 — Habits anlegen
- Pro Life Area einen kompakten, durchdachten Baum (8–20 Habits insgesamt pro Area).
- Eltern-Knoten zuerst inserten, dann Kinder (FK).
- Jeder Habit braucht: vollständige Unit-Konfiguration, `metric_key`, `base_conversion_factor`, `description`, `translations`.
- Direkt nach dem Habit-Insert: `habit_sources`-Verknüpfungen zu den passenden Quellen aus Schritt 1.
- Hard-Constraint im Kopf behalten: ≤ 2 distinct `metric_key`-Werte pro Baum.

### Schritt 3 — ARCs anlegen
- Pro Life Area 5–10 ARCs zum Launch.
- Difficulty-Verteilung anstreben: ~40 % Easy/Medium, ~40 % Medium/Hard, ~20 % Hard/Extreme.
- Duration-Verteilung anstreben: ~30 % 1–2 Wochen (Quick-Wins), ~40 % 4 Wochen, ~20 % 8 Wochen, ~10 % 12 Wochen.
- Für jeden ARC: `source_id` setzen (eine der in Schritt 1 angelegten Quellen).
- Pro ARC die `arc_habits`-Zeilen mit Target-Konfiguration einfügen — **niemals Habit-Eltern und -Kind gleichzeitig** im selben ARC.
- `theory_md` + `tips_md` in voller Länge schreiben, nicht als Platzhalter.
- Alle 4 Übersetzungen für `title`, `subtitle`, `theory_md`, `tips_md`.

### Allgemein für alle drei Schritte
- **Englisch ist Source-of-Truth** in den Hauptspalten; de/es/fr/it gehören in `translations` JSONB.
- **`is_free = true`** für die Seed-Library (Monetarisierung kommt später über kuratorisches Toggling, nicht über die Initial-Daten).
- **Keine erfundenen `external_url` / `image_url`** — lieber NULL als Phantasie-URLs. Bei Image-URLs realistische, stabile Quellen verwenden (offizielle Verlags-Seiten, Wikipedia-Commons, offizielle Profilbilder).
- **`creator_type = 'System'`** und `created_by = NULL` für alle ARCs.
- **`life_area_id` sauber wählen.** Im Zweifel: an welche Life Area würde der User dieses Inhaltsobjekt aus dem Bauch heraus zuordnen?

---

## 4. Inhaltliche Tonalität

- **Kein Coach-Geschwafel.** Kein „Du schaffst das!", kein „Glaub an dich!". Stattdessen: konkrete Mechanik, ehrliche Erwartungssetzung, klare Anleitung.
- **Wissenschaftlich fundiert, aber zugänglich.** Studien-Bezüge erlaubt und erwünscht, aber lesbar. Keine Paper-Sprache.
- **Direkte Ansprache** in der zweiten Person Singular (en: *you*, de: *du*, es: *tú*, fr: *tu*, it: *tu*).
- **Keine Emojis** in Inhalts-Texten. (UI-Icons leben in eigenen `icon`-Spalten.)
- **Realistische Versprechen.** Keine „Verändere dein Leben in 7 Tagen". Stattdessen: „Nach 4 Wochen wirst du den Effekt von X auf Y zuverlässig spüren — und du wirst die Routine etabliert haben."

---

## 5. Schnell-Referenz: Felder-Pflicht-Matrix

| Inhaltstyp | Pflicht-Spalten | Pflicht-Verlinkung |
|---|---|---|
| `arc_sources` | `type`, `title`, `authors`, `content_md`, `image_url`, `source_url`, `estimated_read_minutes`, `life_area_id`, `translations` (de/es/fr/it für title, subtitle, content_md) | — |
| `habits` | alle Unit-Felder, `metric_key`, `base_conversion_factor`, `name`, `description`, `life_area_id`, `icon`, `is_positive`, `translations` (de/es/fr/it für name, description, theory_md, tips_md) | `habit_sources` ≥ 1 Eintrag |
| `arcs` | `title`, `subtitle`, `theory_md`, `tips_md`, `cover_url`, `duration_weeks`, `life_area_id`, `difficulty`, `creator_type='System'`, `translations` (de/es/fr/it für alle Texte) | `source_id` (empfohlen), `arc_habits` ≥ 1 Eintrag pro ARC |

---

## 6. Was ArcUp *nicht* ist

Damit Seed-Daten nicht in falsche Richtungen wandern — bewusste Abgrenzungen:

- **Kein To-Do-Manager.** Habits sind keine Aufgaben mit Deadline. Goals (separate Tabelle) sind dafür da.
- **Kein generischer Habit-Tracker.** Wir tracken nicht „heute Sport gemacht ja/nein", sondern „heute 5,2 km gelaufen". Numerisch, immer.
- **Kein Social Network.** Keine Follower, keine Likes, keine Posts. Insights sind privat.
- **Kein Meditations-Pure-Player / kein Lauf-Pure-Player.** Wir sind die *Struktur* darüber. Spezialisierte Apps (Strava, Headspace) bleiben ergänzend nutzbar.
- **Kein „Streak-um-jeden-Preis"-System.** Streaks gibt es, aber Rest-Days sind eingebaut, und ein gebrochener Streak ist keine Katastrophe — er ist ein Datenpunkt. Es gibt **keine Streak-Shields**.
