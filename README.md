# ArcUp Website

Statische Landing Page + Legal-Seiten für die ArcUp App (ArcUp: Building Better Habits).

---

## Website lokal anschauen (sofort, ohne Installation)

**Einfach die Datei im Browser öffnen:**

1. Im Explorer / Finder in den Ordner `website/` navigieren
2. `index.html` **doppelklicken**
3. Die Seite öffnet sich direkt im Browser

Alle internen Links (Impressum, Datenschutz, AGB, Navigation) funktionieren sofort.
Kein Server, kein npm, keine Installation nötig.

> **Tipp für VS Code-Nutzer:** Mit der Extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
> rechtsklick auf `index.html` → „Open with Live Server" — die Seite aktualisiert sich
> bei jeder Änderung automatisch.

---

## Wie bekomme ich eine eigene Domain?

Eine Domain wie `arc-up.com` kaufst du bei einem **Domain-Registrar**. Empfehlungen:

| Anbieter | Preis (ca.) | Besonderheit |
|---|---|---|
| [Porkbun](https://porkbun.com) | ~10–15 €/Jahr | Günstigster für `.app`, WHOIS-Privacy kostenlos |
| [Namecheap](https://namecheap.com) | ~12–18 €/Jahr | Große Auswahl, gutes Dashboard |
| [Cloudflare Registrar](https://cloudflare.com/products/registrar) | Zum Selbstkostenpreis | Billigste Option, kein Aufschlag |
| [Google Domains](https://domains.google) | ~12–15 €/Jahr | Jetzt bei Squarespace, einfaches UI |

**Empfehlung:** Porkbun oder Cloudflare Registrar — beide günstig, seriös und WHOIS-Privacy inklusive.

`.app`-Domains kosten ~10–15 €/Jahr. Das ist die einzige laufende Kosten — Hosting bleibt kostenlos über GitHub Pages.

### Ablauf nach dem Kauf

1. Domain kaufen (z. B. `arc-up.com` bei Porkbun)
2. Im GitHub-Repo eine Datei namens `CNAME` erstellen mit dem einzigen Inhalt: `arc-up.com`
3. Beim Domain-Anbieter im DNS-Dashboard folgende Einträge anlegen:
   - Typ `A`, Name `@`, Wert `185.199.108.153`
   - Typ `A`, Name `@`, Wert `185.199.109.153`
   - Typ `A`, Name `@`, Wert `185.199.110.153`
   - Typ `A`, Name `@`, Wert `185.199.111.153`
   - Typ `CNAME`, Name `www`, Wert `<dein-github-username>.github.io`
4. In den GitHub Repo-Einstellungen → Pages → Custom Domain → `arcup.app` eintragen
5. „Enforce HTTPS" aktivieren (GitHub stellt das SSL-Zertifikat kostenlos aus)

DNS-Änderungen dauern 15 Minuten bis 24 Stunden.

---

## Struktur

```
website/
├── index.html          ← Landing Page
├── impressum.html
├── datenschutz.html
├── agb.html
├── css/
│   └── styles.css      ← gemeinsames Stylesheet
└── README.md
```

## Hosting: GitHub Pages (kostenlos)

### Einmalig einrichten

1. Neues GitHub-Repo erstellen, z. B. `arcup-website`
2. Die Dateien aus diesem Ordner in den Repo-Root pushen
3. In den Repo-Einstellungen → **Pages** → Source: `Deploy from branch` → Branch: `main` → Folder: `/ (root)`
4. GitHub vergibt automatisch eine URL: `https://<username>.github.io/arcup-website`

### Eigene Domain (z. B. arc-up.com)

1. Im Repo-Root eine Datei `CNAME` mit dem Inhalt `arc-up.com` erstellen
2. Beim Domain-Anbieter folgende DNS-Einträge setzen:
   - `A`-Records auf GitHub-IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - oder `CNAME` für `www` → `<username>.github.io`
3. In den GitHub Pages Einstellungen die Custom Domain eintragen und „Enforce HTTPS" aktivieren

→ HTTPS + eigene Domain: **kostenlos**, inklusive.

## Updates veröffentlichen

Einfach die HTML-Dateien bearbeiten und per `git push` deployen — GitHub Pages aktualisiert
die Website innerhalb weniger Minuten automatisch.

### News-Eintrag hinzufügen

In `index.html` im Bereich `<!-- ── Neue Updates hier … -->` ein weiteres Block einfügen:

```html
<div class="news-item">
  <div class="news-date">Mai 2025</div>
  <div class="news-content">
    <span class="news-tag news-tag--feature">Feature</span>
    <h3>Titel des Updates</h3>
    <p>Kurzbeschreibung was neu ist.</p>
  </div>
</div>
```

Tag-Varianten: `news-tag--feature` (grün) | `news-tag--fix` (blau) | `news-tag--launch` (gelb)

## Legal-Texte anpassen

Die Platzhalter `[Dein Name / Unternehmensname]` und `[Adresse]` in allen drei Legal-Dateien
durch echte Daten ersetzen, **bevor** die Domain live geht.

## App Store / Google Play URLs eintragen

In `index.html` die `href="#"` der Store-Badges durch die echten Store-URLs ersetzen:

```html
<a href="https://apps.apple.com/app/arcup/id<ID>" class="store-badge">
<a href="https://play.google.com/store/apps/details?id=com.mhoer.arcup" class="store-badge">
```

test