/* ArcUp i18n — lightweight dictionary-based translator
 *  Usage in HTML:
 *    <p data-i18n="hero.sub">…fallback DE…</p>          // textContent
 *    <h1 data-i18n-html="manifesto.title">…</h1>        // innerHTML (allows <em>, <br>)
 *    <button data-i18n-aria-label="nav.menu">…</button> // sets aria-label
 *    <img data-i18n-alt="hero.altHome" />               // sets alt attribute
 *
 *  Active language is stored in localStorage('arcup-lang') and reflected on <html lang="…">.
 */
(function () {
  'use strict';

  const SUPPORTED = ['de', 'en', 'es', 'fr', 'it'];
  const DEFAULT_LANG = 'de';
  const STORAGE_KEY = 'arcup-lang';

  const LANG_LABELS = {
    de: 'Deutsch',
    en: 'English',
    es: 'Español',
    fr: 'Français',
    it: 'Italiano',
  };

  // ──────────────────────────────────────────────────────────
  // DICTIONARY
  // Keys are dotted; values are per-language strings.
  // Strings may contain HTML if used with data-i18n-html.
  // ──────────────────────────────────────────────────────────
  const DICT = {
    // ─── NAV ─────────────────────────────────────────────
    'nav.philosophy':  { de: 'Philosophie',      en: 'Philosophy',     es: 'Filosofía',     fr: 'Philosophie',  it: 'Filosofia' },
    'nav.system':      { de: 'Das System',       en: 'The System',     es: 'El Sistema',    fr: 'Le Système',   it: 'Il Sistema' },
    'nav.areas':       { de: 'Lebensbereiche',   en: 'Life Areas',     es: 'Áreas de vida', fr: 'Domaines de vie', it: 'Aree di vita' },
    'nav.pricing':     { de: 'Pro',              en: 'Pro',            es: 'Pro',           fr: 'Pro',          it: 'Pro' },
    'nav.faq':         { de: 'FAQ',              en: 'FAQ',            es: 'FAQ',           fr: 'FAQ',          it: 'FAQ' },
    'nav.download':    { de: 'App laden',        en: 'Get the app',    es: 'Descargar',     fr: 'Télécharger',  it: 'Scarica' },
    'nav.menu':        { de: 'Menü öffnen',      en: 'Open menu',      es: 'Abrir menú',    fr: 'Ouvrir le menu', it: 'Apri menu' },
    'nav.home':        { de: 'ArcUp Startseite', en: 'ArcUp home',     es: 'ArcUp inicio',  fr: "Accueil ArcUp", it: 'Home ArcUp' },
    'nav.lang':        { de: 'Sprache wählen',   en: 'Select language', es: 'Seleccionar idioma', fr: 'Choisir la langue', it: 'Seleziona lingua' },

    // ─── HERO ────────────────────────────────────────────
    'hero.pill': {
      de: 'iOS &amp; Android · Jetzt in der Beta',
      en: 'iOS &amp; Android · Now in Beta',
      es: 'iOS y Android · Ahora en Beta',
      fr: 'iOS et Android · Maintenant en Beta',
      it: 'iOS e Android · Ora in Beta',
    },
    'hero.headline1': { de: 'Building', en: 'Building', es: 'Construir', fr: 'Construire', it: 'Costruire' },
    'hero.headline2': { de: 'better',   en: 'better',   es: 'mejores',   fr: 'de meilleures', it: 'abitudini' },
    'hero.headline3': { de: 'habits.',  en: 'habits.',  es: 'hábitos.',  fr: 'habitudes.',    it: 'migliori.' },
    'hero.sub': {
      de: 'Nicht noch ein Tracker. Ein System aus zeit&shy;begrenzten ARCs, numerischen Habits und einer Quellen-Bibliothek — über fünf Lebensbereiche.',
      en: 'Not another tracker. A system of time-boxed ARCs, numeric habits and a source library — across five life areas.',
      es: 'No es otro rastreador. Un sistema de ARCs limitados en el tiempo, hábitos numéricos y una biblioteca de fuentes — en cinco áreas de vida.',
      fr: "Pas un énième tracker. Un système d'ARCs limités dans le temps, d'habitudes chiffrées et d'une bibliothèque de sources — sur cinq domaines de vie.",
      it: "Non un altro tracker. Un sistema di ARC a tempo limitato, abitudini numeriche e una biblioteca di fonti — su cinque aree di vita.",
    },
    'hero.ctaPrimary': {
      de: 'App kostenlos laden', en: 'Get the app for free', es: 'Descargar gratis',
      fr: "Télécharger gratuitement", it: "Scarica gratis",
    },
    'hero.ctaSecondary': {
      de: 'So funktioniert ArcUp', en: 'How ArcUp works', es: 'Cómo funciona ArcUp',
      fr: 'Comment fonctionne ArcUp', it: 'Come funziona ArcUp',
    },
    'hero.trust1': { de: 'Free für immer',          en: 'Free forever',           es: 'Gratis para siempre',  fr: 'Gratuit pour toujours',  it: 'Gratis per sempre' },
    'hero.trust2': { de: 'EU-Hosting · DSGVO',      en: 'EU hosting · GDPR',      es: 'Hosting UE · RGPD',    fr: 'Hébergement UE · RGPD',  it: 'Hosting UE · GDPR' },
    'hero.trust3': { de: 'Pro mit Lifetime',        en: 'Pro with Lifetime',      es: 'Pro con Lifetime',     fr: 'Pro avec Lifetime',      it: 'Pro con Lifetime' },
    'hero.trust4': { de: 'Keine Werbung, keine Tracker', en: 'No ads, no trackers', es: 'Sin anuncios, sin rastreadores', fr: 'Pas de pub, pas de trackers', it: 'Niente pubblicità, niente tracker' },

    'hero.altHome':  { de: 'ArcUp Home — Tageserfüllung, Wochenerfüllung, Level und aktive ARCs', en: 'ArcUp Home — daily and weekly completion, level and active ARCs', es: 'ArcUp Inicio — cumplimiento diario y semanal, nivel y ARCs activos', fr: "ArcUp Accueil — achèvement quotidien et hebdomadaire, niveau et ARC actifs", it: "ArcUp Home — completamento giornaliero e settimanale, livello e ARC attivi" },
    'hero.altARCs':  { de: 'ARCademy — kuratierte ARCs', en: 'ARCademy — curated ARCs', es: 'ARCademy — ARCs curados', fr: 'ARCademy — ARC sélectionnés', it: 'ARCademy — ARC selezionati' },
    'hero.altRef':   { de: 'Reflect — Wheel of Life', en: 'Reflect — Wheel of Life', es: 'Reflect — Rueda de la vida', fr: 'Reflect — Roue de la vie', it: 'Reflect — Ruota della vita' },

    // ─── MANIFESTO ───────────────────────────────────────
    'mani.overline': { de: 'Manifest', en: 'Manifesto', es: 'Manifiesto', fr: 'Manifeste', it: 'Manifesto' },
    'mani.title': {
      de: 'Wir tracken keine Häkchen.<br />Wir <em>messen</em> Verhalten — in Zahlen, über Zeit, mit Quellen im Rücken.',
      en: "We don't track checkmarks.<br />We <em>measure</em> behaviour — in numbers, over time, backed by sources.",
      es: 'No marcamos casillas.<br /><em>Medimos</em> comportamiento — en cifras, a lo largo del tiempo, con fuentes detrás.',
      fr: "On ne coche pas des cases.<br />On <em>mesure</em> le comportement — en chiffres, dans le temps, avec des sources à l'appui.",
      it: 'Non spuntiamo caselle.<br /><em>Misuriamo</em> il comportamento — in numeri, nel tempo, con fonti alle spalle.',
    },
    'p1.h': { de: 'Strukturiert statt beliebig.', en: 'Structured, not arbitrary.', es: 'Estructurado, no arbitrario.', fr: 'Structuré, pas arbitraire.', it: 'Strutturato, non arbitrario.' },
    'p1.b': {
      de: 'Habits sind keine Free-Text-Notizen. Jeder Habit hat Zielwert, Richtung (≥ oder ≤) und Einheit. „5,2 km gelaufen", nicht „Sport gemacht".',
      en: "Habits aren't free-text notes. Each habit has a target value, a direction (≥ or ≤) and a unit. “Ran 5.2 km”, not “did sport”.",
      es: 'Los hábitos no son notas libres. Cada uno tiene valor objetivo, dirección (≥ o ≤) y unidad. «5,2 km corridos», no «hice deporte».',
      fr: "Les habitudes ne sont pas des notes libres. Chacune a une valeur cible, une direction (≥ ou ≤) et une unité. « 5,2 km courus », pas « fait du sport ».",
      it: "Le abitudini non sono note libere. Ognuna ha un valore obiettivo, una direzione (≥ o ≤) e un'unità. «5,2 km corsi», non «fatto sport».",
    },
    'p2.h': { de: 'Zeit-geboxte Anstrengung.', en: 'Time-boxed effort.', es: 'Esfuerzo con plazo.', fr: 'Effort limité dans le temps.', it: 'Sforzo a tempo definito.' },
    'p2.b': {
      de: 'Echte Verhaltensänderung passiert in fokussierten Phasen. Ein ARC ist eine Verpflichtung über 1 bis 12 Wochen — kein „forever streak".',
      en: 'Real behaviour change happens in focused phases. An ARC is a 1- to 12-week commitment — not a "forever streak".',
      es: 'El cambio real ocurre en fases enfocadas. Un ARC es un compromiso de 1 a 12 semanas — no una «racha eterna».',
      fr: "Le vrai changement arrive par phases focalisées. Un ARC est un engagement de 1 à 12 semaines — pas une « série éternelle ».",
      it: 'Il vero cambiamento avviene per fasi focalizzate. Un ARC è un impegno di 1 a 12 settimane — non una «serie eterna».',
    },
    'p3.h': { de: 'Wissen als Fundament.', en: 'Knowledge as foundation.', es: 'Conocimiento como base.', fr: 'Le savoir comme fondation.', it: 'Conoscenza come fondamento.' },
    'p3.b': {
      de: 'Jede Empfehlung hat eine Quelle: ein Buch, eine Studie, einen Vortrag, einen Creator. Wir behaupten nichts ohne Beleg.',
      en: 'Every recommendation cites a source: a book, a study, a talk, a creator. We claim nothing without evidence.',
      es: 'Cada recomendación tiene una fuente: un libro, un estudio, una charla, un creador. No afirmamos nada sin prueba.',
      fr: "Chaque recommandation cite une source : livre, étude, conférence, créateur. Rien n'est affirmé sans preuve.",
      it: 'Ogni raccomandazione ha una fonte: un libro, uno studio, una conferenza, un creator. Non affermiamo nulla senza prove.',
    },
    'p4.h': { de: 'Progressive Steigerung.', en: 'Progressive growth.', es: 'Progresión gradual.', fr: 'Progression graduelle.', it: 'Crescita progressiva.' },
    'p4.b': {
      de: 'Ziele wachsen linear über die ARC-Dauer — von 1 auf 5 km, von 5 auf 20 Minuten. Wachstum passiert durch Steigerung, nicht durch Wiederholung.',
      en: 'Targets grow linearly across the ARC — from 1 to 5 km, from 5 to 20 minutes. Growth happens through progression, not repetition.',
      es: 'Los objetivos crecen linealmente durante el ARC — de 1 a 5 km, de 5 a 20 minutos. El crecimiento ocurre por progresión, no por repetición.',
      fr: "Les objectifs croissent linéairement sur la durée de l'ARC — de 1 à 5 km, de 5 à 20 minutes. La croissance vient de la progression, pas de la répétition.",
      it: "Gli obiettivi crescono linearmente lungo l'ARC — da 1 a 5 km, da 5 a 20 minuti. La crescita avviene per progressione, non per ripetizione.",
    },

    // ─── LAYERS (Macro/Meso/Micro) ───────────────────────
    'layers.overline': { de: 'Drei Zeit-Ebenen. Ein System.', en: 'Three time horizons. One system.', es: 'Tres horizontes temporales. Un sistema.', fr: 'Trois horizons temporels. Un système.', it: 'Tre orizzonti temporali. Un sistema.' },
    'layers.title':    { de: 'Macro. Meso. Micro.', en: 'Macro. Meso. Micro.', es: 'Macro. Meso. Micro.', fr: 'Macro. Meso. Micro.', it: 'Macro. Meso. Micro.' },

    'macro.tier': { de: 'Macro', en: 'Macro', es: 'Macro', fr: 'Macro', it: 'Macro' },
    'macro.time': { de: 'Lebenszeit', en: 'A lifetime', es: 'Toda la vida', fr: 'Une vie', it: 'Una vita' },
    'macro.h':    { de: 'Compass', en: 'Compass', es: 'Compass', fr: 'Compass', it: 'Compass' },
    'macro.q':    { de: 'Wer will ich werden?', en: 'Who do I want to become?', es: '¿Quién quiero ser?', fr: 'Qui je veux devenir ?', it: 'Chi voglio diventare?' },
    'macro.b':    { de: 'Fünf Lebensbereiche und ein Vision-Statement. Der Compass hält die Richtung, wenn der Alltag laut wird.', en: 'Five life areas and one vision statement. The Compass holds the direction when daily life gets loud.', es: 'Cinco áreas y una declaración de visión. El Compass marca el rumbo cuando el día a día se vuelve ruidoso.', fr: 'Cinq domaines de vie et un énoncé de vision. Le Compass garde le cap quand le quotidien devient bruyant.', it: 'Cinque aree di vita e una dichiarazione di visione. Il Compass tiene la rotta quando la quotidianità si fa rumorosa.' },

    'meso.tier': { de: 'Meso', en: 'Meso', es: 'Meso', fr: 'Meso', it: 'Meso' },
    'meso.time': { de: '1–12 Wochen', en: '1–12 weeks', es: '1–12 semanas', fr: '1–12 semaines', it: '1–12 settimane' },
    'meso.h':    { de: 'ARC', en: 'ARC', es: 'ARC', fr: 'ARC', it: 'ARC' },
    'meso.q':    { de: 'Was übe ich gerade gezielt?', en: 'What am I deliberately practising now?', es: '¿Qué practico ahora con intención?', fr: 'Que suis-je en train de pratiquer délibérément ?', it: 'Cosa sto praticando deliberatamente ora?' },
    'meso.b':    { de: 'Eine zeitlich begrenzte Challenge mit klarem Start, Ende und Commitment. 1 bis N Habits, progressive Ziele, Reflexion am Schluss.', en: 'A time-boxed challenge with a clear start, end and commitment. 1 to N habits, progressive targets, reflection at the end.', es: 'Un reto acotado en el tiempo con inicio, fin y compromiso claros. 1 a N hábitos, objetivos progresivos, reflexión al final.', fr: "Un défi à durée limitée avec début, fin et engagement clairs. 1 à N habitudes, objectifs progressifs, réflexion à la fin.", it: "Una sfida a tempo definito con inizio, fine e impegno chiari. 1 a N abitudini, obiettivi progressivi, riflessione finale." },

    'micro.tier': { de: 'Micro', en: 'Micro', es: 'Micro', fr: 'Micro', it: 'Micro' },
    'micro.time': { de: 'Täglich · Wöchentlich', en: 'Daily · Weekly', es: 'Diario · Semanal', fr: 'Quotidien · Hebdomadaire', it: 'Giornaliero · Settimanale' },
    'micro.h':    { de: 'Habit', en: 'Habit', es: 'Hábito', fr: 'Habitude', it: 'Abitudine' },
    'micro.q':    { de: 'Was tue ich heute konkret?', en: 'What am I concretely doing today?', es: '¿Qué hago hoy en concreto?', fr: 'Que fais-je concrètement aujourd’hui ?', it: 'Cosa faccio concretamente oggi?' },
    'micro.b':    { de: 'Atomare, numerisch messbare Einheit. 5 km, 7 h, 2 l, ≤ 30 min. Eine Sache, ein Wert, eine Richtung.', en: 'Atomic, numerically measurable unit. 5 km, 7 h, 2 l, ≤ 30 min. One thing, one value, one direction.', es: 'Unidad atómica medible. 5 km, 7 h, 2 l, ≤ 30 min. Una cosa, un valor, una dirección.', fr: 'Unité atomique, mesurable. 5 km, 7 h, 2 l, ≤ 30 min. Une chose, une valeur, une direction.', it: "Unità atomica, misurabile. 5 km, 7 h, 2 l, ≤ 30 min. Una cosa, un valore, una direzione." },

    // ─── THE APP (4 showcases) ───────────────────────────
    'sys.overline': { de: 'Die App', en: 'The App', es: 'La App', fr: "L'App", it: "L'App" },
    'sys.title':    { de: 'Vier Räume. Eine Reise.', en: 'Four spaces. One journey.', es: 'Cuatro espacios. Un viaje.', fr: 'Quatre espaces. Un voyage.', it: 'Quattro spazi. Un viaggio.' },
    'sys.sub':      { de: 'Jeder Tab erfüllt genau eine Aufgabe. Keine überladenen Screens, keine Multifunktions-Buttons.', en: 'Each tab does exactly one job. No overloaded screens, no multi-function buttons.', es: 'Cada pestaña hace una sola cosa. Pantallas claras, sin botones multifunción.', fr: 'Chaque onglet a une seule tâche. Pas d’écrans surchargés, pas de boutons multifonctions.', it: 'Ogni tab fa una sola cosa. Schermate pulite, niente pulsanti multifunzione.' },

    // 01 Home
    'sc1.num':   { de: '01 — Home', en: '01 — Home', es: '01 — Inicio', fr: '01 — Accueil', it: '01 — Home' },
    'sc1.h':     { de: 'Heute. Numerisch. Ehrlich.', en: 'Today. Numeric. Honest.', es: 'Hoy. Numérico. Honesto.', fr: "Aujourd'hui. Chiffré. Honnête.", it: 'Oggi. Numerico. Onesto.' },
    'sc1.b':     { de: 'Drei Ringe für Tag, Woche und Level. Eine Liste deiner heutigen Habits — mit dem konkreten Zielwert, nicht mit einer Checkbox. Aktive ARCs zeigen, wo du gerade stehst.', en: "Three rings for day, week and level. A list of today's habits — with concrete target values, not checkboxes. Active ARCs show where you currently stand.", es: 'Tres anillos para día, semana y nivel. Una lista de tus hábitos de hoy — con valor objetivo concreto, no casillas. Los ARCs activos muestran dónde estás.', fr: 'Trois anneaux pour le jour, la semaine et le niveau. Une liste de vos habitudes du jour — avec une valeur cible concrète, pas une case à cocher. Les ARC actifs montrent où vous en êtes.', it: 'Tre anelli per giorno, settimana e livello. Una lista delle tue abitudini di oggi — con valore obiettivo concreto, non caselle. Gli ARC attivi mostrano dove sei.' },
    'sc1.li1':   { de: 'Tages- und Wochenerfüllung als Prozent, proportional zum Zielwert', en: 'Daily and weekly completion as a percentage, proportional to the target', es: 'Cumplimiento diario y semanal en porcentaje, proporcional al objetivo', fr: 'Complétion quotidienne et hebdomadaire en pourcentage, proportionnelle à la cible', it: 'Completamento giornaliero e settimanale in percentuale, proporzionale al target' },
    'sc1.li2':   { de: 'Level, Streak und aktive ARC-Karte mit Tag X von Y', en: 'Level, streak and active-ARC card showing day X of Y', es: 'Nivel, racha y tarjeta de ARC activo con día X de Y', fr: 'Niveau, série et carte d’ARC actif jour X sur Y', it: 'Livello, streak e card di ARC attivo con giorno X di Y' },
    'sc1.li3':   { de: 'Logbuch öffnet sich in einem Tap — nur der heutige Tag, keine Rückdatierung', en: 'The logbook opens in one tap — only today, no back-dating', es: 'El registro se abre en un toque — solo hoy, sin retroactividad', fr: "Le journal s'ouvre en un tap — uniquement aujourd'hui, pas d'antidatage", it: "Il logbook si apre con un tap — solo oggi, niente retrodatazione" },
    'sc1.alt':   { de: 'ArcUp Home — Tages-, Wochen- und Level-Ringe mit aktivem ARC Morning Mastery', en: 'ArcUp Home — daily, weekly and level rings with active ARC Morning Mastery', es: 'ArcUp Inicio — anillos de día, semana y nivel con ARC Morning Mastery', fr: "ArcUp Accueil — anneaux jour, semaine et niveau avec ARC Morning Mastery actif", it: 'ArcUp Home — anelli giorno, settimana e livello con ARC Morning Mastery attivo' },

    // 02 ARCademy
    'sc2.num': { de: '02 — ARCademy', en: '02 — ARCademy', es: '02 — ARCademy', fr: '02 — ARCademy', it: '02 — ARCademy' },
    'sc2.h':   { de: 'Wähle, baue, oder lass generieren.', en: 'Pick one, build one, or have one generated.', es: 'Elige, crea o haz que se genere.', fr: 'Choisissez, créez ou laissez générer.', it: 'Scegli, crea o lascia generare.' },
    'sc2.b':   { de: 'Eine kuratierte Bibliothek aus ARCs zwischen 1 und 12 Wochen. Schwierigkeit, Lebensbereich, Quelle, Dauer — alles filterbar. Plus zwei Wege, eigene Pfade zu gehen.', en: 'A curated library of ARCs from 1 to 12 weeks. Difficulty, life area, source, duration — all filterable. Plus two ways to go your own path.', es: 'Una biblioteca curada de ARCs de 1 a 12 semanas. Dificultad, área, fuente, duración — todo filtrable. Y dos vías para crear el tuyo.', fr: "Une bibliothèque sélectionnée d'ARC de 1 à 12 semaines. Difficulté, domaine, source, durée — tout filtrable. Plus deux façons de tracer votre propre chemin.", it: 'Una biblioteca curata di ARC da 1 a 12 settimane. Difficoltà, area, fonte, durata — tutto filtrabile. E due modi per fare la tua strada.' },
    'sc2.li1': { de: 'Kuratierte ARCs mit Theorie, Tipps, Cover und Primärquelle', en: 'Curated ARCs with theory, tips, cover and primary source', es: 'ARCs curados con teoría, consejos, portada y fuente primaria', fr: 'ARC sélectionnés avec théorie, conseils, couverture et source primaire', it: 'ARC curati con teoria, consigli, copertina e fonte primaria' },
    'sc2.li2': { de: 'KI-Generator: Ziel in einem Satz beschreiben, fertigen ARC erhalten — editierbar', en: 'AI generator: describe your goal in one sentence, receive a ready ARC — editable', es: 'Generador IA: describe tu meta en una frase, recibe un ARC listo — editable', fr: "Générateur IA : décrivez votre objectif en une phrase, recevez un ARC prêt — éditable", it: "Generatore IA: descrivi il tuo obiettivo in una frase, ricevi un ARC pronto — modificabile" },
    'sc2.li3': { de: 'Selfmade-ARCs aus kuratierten Habits per Drei-Schritte-Wizard <span class="pro-pill">Pro</span>', en: 'Self-made ARCs from curated habits via a three-step wizard <span class="pro-pill">Pro</span>', es: 'ARCs propios a partir de hábitos curados con asistente de tres pasos <span class="pro-pill">Pro</span>', fr: "ARC personnalisés à partir d'habitudes sélectionnées via un assistant en trois étapes <span class=\"pro-pill\">Pro</span>", it: 'ARC personali da abitudini curate tramite procedura guidata in tre passi <span class="pro-pill">Pro</span>' },
    'sc2.alt': { de: 'ARCademy — Beliebte ARCs Productivity Reset und Quadrant II Architect mit Suche und Filter', en: 'ARCademy — popular ARCs Productivity Reset and Quadrant II Architect with search and filter', es: 'ARCademy — ARCs populares Productivity Reset y Quadrant II Architect con búsqueda y filtros', fr: "ARCademy — ARC populaires Productivity Reset et Quadrant II Architect avec recherche et filtres", it: 'ARCademy — ARC popolari Productivity Reset e Quadrant II Architect con ricerca e filtri' },

    // 03 Discover
    'sc3.num': { de: '03 — Discover', en: '03 — Discover', es: '03 — Discover', fr: '03 — Discover', it: '03 — Discover' },
    'sc3.h':   { de: 'Eigene Wissens-Briefings.', en: 'Our own knowledge briefings.', es: 'Nuestros propios briefings.', fr: 'Nos propres briefings.', it: 'I nostri briefing originali.' },
    'sc3.b':   { de: 'Hinter jedem Habit und jedem ARC steht ein redaktionelles Briefing — selbst geschrieben, in 4 bis 8 Minuten lesbar, direkt mit Habits und ARCs verknüpft.', en: 'Behind every habit and ARC sits an editorial briefing — written by us, readable in 4 to 8 minutes, linked directly to habits and ARCs.', es: 'Detrás de cada hábito y cada ARC hay un briefing editorial — escrito por nosotros, legible en 4 a 8 minutos, vinculado a hábitos y ARCs.', fr: "Derrière chaque habitude et chaque ARC : un briefing éditorial — écrit par nous, lisible en 4 à 8 minutes, lié aux habitudes et ARC.", it: 'Dietro a ogni abitudine e ogni ARC c’è un briefing editoriale — scritto da noi, leggibile in 4–8 minuti, collegato ad abitudini e ARC.' },
    'sc3.li1': { de: 'ArcUp Originals zu etablierten Konzepten: Trainingswissenschaft, Schlafhygiene, Atemtechniken, Lerntheorie, Fokus', en: 'ArcUp Originals on established concepts: training science, sleep hygiene, breath techniques, learning theory, focus', es: 'ArcUp Originals sobre conceptos establecidos: ciencia del entrenamiento, higiene del sueño, técnicas de respiración, teoría del aprendizaje, foco', fr: "ArcUp Originals sur des concepts établis : science de l'entraînement, hygiène du sommeil, techniques de respiration, théorie de l'apprentissage, concentration", it: "ArcUp Originals su concetti consolidati: scienza dell'allenamento, igiene del sonno, tecniche di respirazione, teoria dell'apprendimento, focus" },
    'sc3.li2': { de: 'Klare These pro Quelle, direkt anwendbar — keine Reproduktion geschützter Inhalte', en: 'Clear thesis per source, directly applicable — no reproduction of protected content', es: 'Una tesis clara por fuente, directamente aplicable — sin reproducir contenido protegido', fr: "Une thèse claire par source, directement applicable — pas de reproduction de contenu protégé", it: 'Una tesi chiara per fonte, direttamente applicabile — nessuna riproduzione di contenuti protetti' }, // _x:'Kein „im Buch lernst du…" — die Kernideen direkt destilliert, 4–8 Minuten Lesedauer', en: 'No "you’ll learn in the book…" — core ideas distilled directly, 4–8 minutes to read', es: 'Nada de «en el libro aprenderás…» — ideas centrales destiladas, 4–8 minutos de lectura', fr: "Pas de « vous apprendrez dans le livre » — les idées clés distillées, 4–8 min de lecture", it: 'Niente «nel libro imparerai…» — idee chiave distillate, 4–8 minuti di lettura' },
    'sc3.li3': { de: 'Optionale Buch- und Talk-Empfehlungen mit *-Markierung als Affiliate-Links — ohne Mehrkosten für dich', en: 'Optional book and talk recommendations marked with * as affiliate links — at no extra cost to you', es: 'Recomendaciones opcionales de libros y charlas marcadas con * como enlaces de afiliado — sin coste adicional para ti', fr: "Recommandations optionnelles de livres et conférences marquées d’un * comme liens affiliés — sans surcoût pour vous", it: 'Consigli opzionali su libri e talk marcati con * come link affiliati — nessun costo aggiuntivo per te' },
    'sc3.alt': { de: 'Discover — Lern-Mediathek mit redaktionellen ArcUp-Original-Briefings', en: 'Discover — Learning Library with editorial ArcUp Original briefings', es: 'Discover — Biblioteca con briefings editoriales ArcUp Original', fr: 'Discover — Bibliothèque avec briefings éditoriaux ArcUp Original', it: 'Discover — Biblioteca con briefing editoriali ArcUp Original' },

    // 04 Reflect
    'sc4.num': { de: '04 — Reflect', en: '04 — Reflect', es: '04 — Reflect', fr: '04 — Reflect', it: '04 — Reflect' },
    'sc4.h':   { de: 'Der Compass. Dein Wheel of Life.', en: 'The Compass. Your Wheel of Life.', es: 'El Compass. Tu Wheel of Life.', fr: 'Le Compass. Votre Wheel of Life.', it: 'Il Compass. La tua Wheel of Life.' },
    'sc4.b':   { de: 'Bewerte deine fünf Lebensbereiche von 1 bis 10. Sieh, wo Balance fehlt. Schreibe Vision, Ziele und Journal — paginiert, durchsuchbar, jederzeit editierbar.', en: 'Rate your five life areas from 1 to 10. See where balance is missing. Write vision, goals and journal — paginated, searchable, always editable.', es: 'Puntúa tus cinco áreas de 1 a 10. Ve dónde falta equilibrio. Escribe visión, metas y diario — paginado, buscable, siempre editable.', fr: 'Notez vos cinq domaines de 1 à 10. Voyez où le déséquilibre se cache. Écrivez vision, objectifs et journal — paginé, cherchable, toujours éditable.', it: 'Valuta le tue cinque aree da 1 a 10. Vedi dove manca equilibrio. Scrivi visione, obiettivi e diario — paginato, ricercabile, sempre modificabile.' },
    'sc4.li1': { de: 'Interaktiver Radar über Körper, Geist, Wachstum, Beziehungen, Freizeit', en: 'Interactive radar across Body, Mind, Growth, Relationships, Leisure', es: 'Radar interactivo sobre Cuerpo, Mente, Crecimiento, Relaciones, Ocio', fr: 'Radar interactif sur Corps, Esprit, Croissance, Relations, Loisirs', it: 'Radar interattivo su Corpo, Mente, Crescita, Relazioni, Tempo libero' },
    'sc4.li2': { de: 'Vision-Statement und Ziele pro Bereich (wöchentlich, monatlich, jährlich) <span class="pro-pill">Pro</span>', en: 'Vision statement and goals per area (weekly, monthly, yearly) <span class="pro-pill">Pro</span>', es: 'Declaración de visión y metas por área (semanal, mensual, anual) <span class="pro-pill">Pro</span>', fr: "Énoncé de vision et objectifs par domaine (hebdo, mensuel, annuel) <span class=\"pro-pill\">Pro</span>", it: 'Dichiarazione di visione e obiettivi per area (settimanale, mensile, annuale) <span class="pro-pill">Pro</span>' },
    'sc4.li3': { de: 'Journal in vier Typen: Gedanke, Lernen, Dankbarkeit, Erfolge &amp; Verluste <span class="pro-pill">Pro</span>', en: 'Journal in four types: Thought, Learning, Gratitude, Wins &amp; Losses <span class="pro-pill">Pro</span>', es: 'Diario en cuatro tipos: Pensamiento, Aprendizaje, Gratitud, Logros y pérdidas <span class="pro-pill">Pro</span>', fr: "Journal en quatre types : Pensée, Apprentissage, Gratitude, Victoires et pertes <span class=\"pro-pill\">Pro</span>", it: 'Diario in quattro tipi: Pensiero, Apprendimento, Gratitudine, Vittorie e perdite <span class="pro-pill">Pro</span>' },
    'sc4.alt': { de: 'Reflect — Wheel-of-Life-Radar mit Bewertung 37 von 50 über fünf Lebensbereiche', en: 'Reflect — Wheel-of-Life radar showing 37 out of 50 across five life areas', es: 'Reflect — radar Wheel of Life con 37 de 50 en cinco áreas', fr: "Reflect — radar Wheel of Life à 37 sur 50 sur cinq domaines", it: 'Reflect — radar Wheel of Life con 37 su 50 sulle cinque aree' },

    // ─── AREAS ───────────────────────────────────────────
    'areas.overline': { de: 'Der Compass', en: 'The Compass', es: 'El Compass', fr: 'Le Compass', it: 'Il Compass' },
    'areas.title':    { de: 'Fünf Lebensbereiche.<br />Ein Rahmen.', en: 'Five life areas.<br />One framework.', es: 'Cinco áreas de vida.<br />Un marco.', fr: 'Cinq domaines de vie.<br />Un cadre.', it: 'Cinque aree di vita.<br />Un’unica cornice.' },
    'areas.sub':      { de: 'Jede Quelle, jeder Habit, jeder ARC gehört genau einer Area an. Das hält den Compass scharf und verhindert „passt überall"-Inhalte.', en: 'Every source, habit and ARC belongs to exactly one area. That keeps the Compass sharp and prevents "fits anywhere" content.', es: 'Cada fuente, hábito y ARC pertenece a una sola área. Eso mantiene el Compass afilado y evita el contenido «encaja en todas partes».', fr: "Chaque source, habitude et ARC appartient à un seul domaine. Cela garde le Compass net et évite le contenu « utile partout ».", it: 'Ogni fonte, abitudine e ARC appartiene a una sola area. Così il Compass resta nitido e si evitano contenuti «buoni per tutto».' },

    'a1.h': { de: 'Körper', en: 'Body', es: 'Cuerpo', fr: 'Corps', it: 'Corpo' },
    'a1.d': { de: 'Ausdauer, Kraft, Mobility, Schlaf, Ernährung, Recovery.', en: 'Endurance, strength, mobility, sleep, nutrition, recovery.', es: 'Resistencia, fuerza, movilidad, sueño, nutrición, recuperación.', fr: 'Endurance, force, mobilité, sommeil, nutrition, récupération.', it: 'Resistenza, forza, mobilità, sonno, nutrizione, recupero.' },
    'a1.q': { de: 'Was trägt dich durch dein Leben?', en: 'What carries you through your life?', es: '¿Qué te sostiene en tu vida?', fr: 'Qu’est-ce qui vous porte à travers la vie ?', it: 'Cosa ti porta avanti nella vita?' },

    'a2.h': { de: 'Geist', en: 'Mind', es: 'Mente', fr: 'Esprit', it: 'Mente' },
    'a2.d': { de: 'Meditation, Fokus, Stress-Regulation, Resilienz.', en: 'Meditation, focus, stress regulation, resilience.', es: 'Meditación, foco, regulación del estrés, resiliencia.', fr: 'Méditation, concentration, régulation du stress, résilience.', it: 'Meditazione, focus, regolazione dello stress, resilienza.' },
    'a2.q': { de: 'Wer bist du, wenn es leise wird?', en: 'Who are you when it gets quiet?', es: '¿Quién eres cuando se hace el silencio?', fr: 'Qui êtes-vous quand le silence se fait ?', it: 'Chi sei quando cala il silenzio?' },

    'a3.h': { de: 'Wachstum', en: 'Growth', es: 'Crecimiento', fr: 'Croissance', it: 'Crescita' },
    'a3.d': { de: 'Lesen, Lernen, Deep Work, Karriere, Finanzen.', en: 'Reading, learning, deep work, career, finance.', es: 'Lectura, aprendizaje, deep work, carrera, finanzas.', fr: 'Lecture, apprentissage, deep work, carrière, finances.', it: 'Lettura, apprendimento, deep work, carriera, finanze.' },
    'a3.q': { de: 'Was lernst du, das dich verändert?', en: 'What are you learning that changes you?', es: '¿Qué aprendes que te transforma?', fr: "Qu'apprenez-vous qui vous transforme ?", it: 'Cosa stai imparando che ti trasforma?' },

    'a4.h': { de: 'Beziehungen', en: 'Relationships', es: 'Relaciones', fr: 'Relations', it: 'Relazioni' },
    'a4.d': { de: 'Partnerschaft, Familie, Freunde, Netzwerk, Repair.', en: 'Partnership, family, friends, network, repair.', es: 'Pareja, familia, amigos, red, reparación.', fr: 'Couple, famille, amis, réseau, réparation.', it: 'Coppia, famiglia, amici, rete, riparazione.' },
    'a4.q': { de: 'Wer wird dich vermissen, wenn du fehlst?', en: 'Who will miss you when you’re gone?', es: '¿Quién te echará de menos si faltas?', fr: 'Qui vous regrettera si vous manquez ?', it: 'Chi sentirà la tua mancanza se non ci sei?' },

    'a5.h': { de: 'Freizeit', en: 'Leisure', es: 'Ocio', fr: 'Loisirs', it: 'Tempo libero' },
    'a5.d': { de: 'Hobbys, Natur, Kreativität, Spiel, Digital Detox.', en: 'Hobbies, nature, creativity, play, digital detox.', es: 'Aficiones, naturaleza, creatividad, juego, detox digital.', fr: 'Loisirs, nature, créativité, jeu, détox numérique.', it: 'Hobby, natura, creatività, gioco, detox digitale.' },
    'a5.q': { de: 'Was tust du, wenn niemand zusieht?', en: 'What do you do when nobody is watching?', es: '¿Qué haces cuando nadie mira?', fr: 'Que faites-vous quand personne ne regarde ?', it: 'Cosa fai quando nessuno guarda?' },

    // ─── FOUNDATION ──────────────────────────────────────
    'fnd1.over': { de: 'ArcUp Originals',  en: 'ArcUp Originals',  es: 'ArcUp Originals',  fr: 'ArcUp Originals',  it: 'ArcUp Originals' },
    'fnd1.h':    { de: 'Eigene Wissens-Briefings.', en: 'Our own knowledge briefings.', es: 'Nuestros propios briefings.', fr: 'Nos propres briefings.', it: 'I nostri briefing originali.' },
    'fnd1.b':    { de: 'Redaktionell selbst geschrieben, in 4 bis 8 Minuten lesbar. Direkt aus der App. Mit Habits und ARCs verknüpft.', en: 'Editorially written by us, readable in 4 to 8 minutes. Directly from the app. Linked to habits and ARCs.', es: 'Escritos por nosotros, legibles en 4 a 8 minutos. Directo desde la app. Vinculados a hábitos y ARCs.', fr: "Écrits par nous, lisibles en 4 à 8 minutes. Directement dans l'app. Liés aux habitudes et ARC.", it: "Scritti da noi, leggibili in 4–8 minuti. Direttamente nell'app. Collegati ad abitudini e ARC." },
    'fnd1.s1': { de: 'Zone-2-Cardio — die Mechanik aerober Basis', en: 'Zone-2 cardio — the mechanics of an aerobic base', es: 'Cardio Zona 2 — la mecánica de la base aeróbica', fr: "Cardio Zone 2 — la mécanique de la base aérobie", it: 'Cardio Zona 2 — la meccanica della base aerobica' },
    'fnd1.s2': { de: 'Schlafhygiene-Protokoll: 7 Hebel, die wirken', en: 'Sleep-hygiene protocol: 7 levers that work', es: 'Higiene del sueño: 7 palancas que funcionan', fr: 'Hygiène du sommeil : 7 leviers qui marchent', it: 'Igiene del sonno: 7 leve che funzionano' },
    'fnd1.s3': { de: 'Box-Breathing &amp; 4-7-8 für Stress-Regulation', en: 'Box breathing &amp; 4-7-8 for stress regulation', es: 'Respiración box y 4-7-8 para la regulación del estrés', fr: 'Respiration carrée et 4-7-8 pour réguler le stress', it: 'Box breathing e 4-7-8 per la regolazione dello stress' },
    'fnd1.s4': { de: 'Deep-Work-Protokoll: Fokus über 90 Minuten', en: 'Deep-work protocol: focus over 90 minutes', es: 'Protocolo deep work: foco durante 90 minutos', fr: 'Protocole deep work : focus sur 90 minutes', it: 'Protocollo deep work: focus per 90 minuti' },
    'fnd1.s5': { de: 'Quadrant-II-Planning für die Woche', en: 'Quadrant-II planning for the week', es: 'Planificación cuadrante II para la semana', fr: 'Planification quadrant II pour la semaine', it: 'Pianificazione quadrante II per la settimana' },
    'fnd1.s6': { de: 'Habit-Architektur: Cue, Action, Reward', en: 'Habit architecture: cue, action, reward', es: 'Arquitectura de hábitos: cue, action, reward', fr: 'Architecture des habitudes : cue, action, reward', it: 'Architettura delle abitudini: cue, action, reward' },
    'fnd1.note': {
      de: '+ optionale Buch- und Talk-Empfehlungen mit *-Markierung als Affiliate-Links. Keine Mehrkosten für dich.',
      en: '+ optional book and talk recommendations marked with * as affiliate links. No extra cost for you.',
      es: '+ recomendaciones opcionales de libros y charlas marcadas con * como enlaces de afiliado. Sin coste adicional para ti.',
      fr: '+ recommandations optionnelles de livres et conférences marquées d’un * comme liens affiliés. Sans surcoût pour vous.',
      it: '+ consigli opzionali su libri e talk marcati con * come link affiliati. Nessun costo aggiuntivo per te.',
    },

    'fnd2.over': { de: 'Hierarchisch', en: 'Hierarchical', es: 'Jerárquico', fr: 'Hiérarchique', it: 'Gerarchico' },
    'fnd2.h':    { de: 'Habits sind kein flacher Name.', en: 'Habits are not a flat name.', es: 'Los hábitos no son un nombre plano.', fr: 'Les habitudes ne sont pas un simple nom.', it: 'Le abitudini non sono un nome piatto.' },
    'fnd2.b':    { de: 'Über 120 kuratierte Habits in einer Baum-Struktur. Du trackst „Long Run = 12 km" — Insights aggregieren automatisch unter <em>Laufen</em> und <em>Ausdauertraining</em>.', en: 'Over 120 curated habits in a tree. You track "Long Run = 12 km" — insights automatically roll up under <em>Running</em> and <em>Endurance training</em>.', es: 'Más de 120 hábitos curados en árbol. Registras «Long Run = 12 km» — los insights se agregan bajo <em>Correr</em> y <em>Entrenamiento de resistencia</em>.', fr: "Plus de 120 habitudes sélectionnées en arborescence. Vous suivez « Long Run = 12 km » — les insights remontent automatiquement sous <em>Course</em> et <em>Endurance</em>.", it: 'Oltre 120 abitudini curate in un albero. Tracci «Long Run = 12 km» — gli insights si aggregano automaticamente sotto <em>Corsa</em> e <em>Allenamento di resistenza</em>.' },

    // ─── COMPARE ─────────────────────────────────────────
    'cmp.over': { de: 'Numerisch, immer', en: 'Numeric, always', es: 'Numérico, siempre', fr: 'Chiffré, toujours', it: 'Numerico, sempre' },
    'cmp.h':    { de: 'Wir tracken Werte,<br />keine Häkchen.', en: 'We track values,<br />not checkmarks.', es: 'Registramos valores,<br />no marcas.', fr: 'Nous suivons des valeurs,<br />pas des cases cochées.', it: 'Tracciamo valori,<br />non spunte.' },
    'cmp.sub':  { de: 'Andere fragen: „Hast du heute Sport gemacht?" ArcUp fragt: „Wie viele Kilometer? Wie viele Minuten? Wie schnell?"', en: 'Others ask: "Did you do sport today?" ArcUp asks: "How many kilometres? How many minutes? How fast?"', es: 'Otros preguntan: «¿Hiciste deporte hoy?» ArcUp pregunta: «¿Cuántos kilómetros? ¿Cuántos minutos? ¿A qué velocidad?»', fr: 'Les autres demandent « t’as fait du sport aujourd’hui ? » ArcUp demande « combien de kilomètres ? combien de minutes ? à quelle vitesse ? »', it: 'Gli altri chiedono: «Hai fatto sport oggi?» ArcUp chiede: «Quanti chilometri? Quanti minuti? A che velocità?»' },

    'cmp.badLabel': { de: 'Häkchen-Tracker', en: 'Checkbox tracker', es: 'Tracker de casillas', fr: 'Tracker à cases', it: 'Tracker a spunte' },
    'cmp.bad1':     { de: '✓ Sport gemacht', en: '✓ Did sport', es: '✓ Hice deporte', fr: '✓ Fait du sport', it: '✓ Fatto sport' },
    'cmp.bad2':     { de: '✓ Wasser getrunken', en: '✓ Drank water', es: '✓ Bebí agua', fr: '✓ Bu de l’eau', it: '✓ Bevuto acqua' },
    'cmp.bad3':     { de: '✓ Gelesen', en: '✓ Read', es: '✓ Leí', fr: '✓ Lu', it: '✓ Letto' },
    'cmp.bad4':     { de: '✓ Meditiert', en: '✓ Meditated', es: '✓ Medité', fr: '✓ Médité', it: '✓ Meditato' },
    'cmp.badNote':  { de: 'Binär. Keine Tiefe. Erfüllung = 100 % oder 0 %.', en: 'Binary. No depth. Completion = 100% or 0%.', es: 'Binario. Sin profundidad. Cumplimiento = 100 % o 0 %.', fr: 'Binaire. Sans profondeur. Achèvement = 100 % ou 0 %.', it: 'Binario. Senza profondità. Completamento = 100 % o 0 %.' },

    'cmp.goodLabel':{ de: 'ArcUp', en: 'ArcUp', es: 'ArcUp', fr: 'ArcUp', it: 'ArcUp' },
    'cmp.good1':    { de: '<strong>5,2 km</strong> · Laufen, Zone 2 · 78 %', en: '<strong>5.2 km</strong> · Running, Zone 2 · 78%', es: '<strong>5,2 km</strong> · Correr, Zona 2 · 78 %', fr: '<strong>5,2 km</strong> · Course, Zone 2 · 78 %', it: '<strong>5,2 km</strong> · Corsa, Zona 2 · 78 %' },
    'cmp.good2':    { de: '<strong>2,4 l</strong> · Wasser · 96 %', en: '<strong>2.4 l</strong> · Water · 96%', es: '<strong>2,4 l</strong> · Agua · 96 %', fr: '<strong>2,4 l</strong> · Eau · 96 %', it: '<strong>2,4 l</strong> · Acqua · 96 %' },
    'cmp.good3':    { de: '<strong>34 min</strong> · Lesen · 100 %', en: '<strong>34 min</strong> · Reading · 100%', es: '<strong>34 min</strong> · Lectura · 100 %', fr: '<strong>34 min</strong> · Lecture · 100 %', it: '<strong>34 min</strong> · Lettura · 100 %' },
    'cmp.good4':    { de: '<strong>20 min</strong> · Meditation · 100 %', en: '<strong>20 min</strong> · Meditation · 100%', es: '<strong>20 min</strong> · Meditación · 100 %', fr: '<strong>20 min</strong> · Méditation · 100 %', it: '<strong>20 min</strong> · Meditazione · 100 %' },
    'cmp.goodNote': { de: 'Echte Werte. Proportionale Erfüllung. Roll-up im Insights.', en: 'Real values. Proportional completion. Roll-up in Insights.', es: 'Valores reales. Cumplimiento proporcional. Agregación en Insights.', fr: 'Vraies valeurs. Achèvement proportionnel. Agrégation dans Insights.', it: 'Valori reali. Completamento proporzionale. Aggregazione in Insights.' },

    // ─── NOT THIS ────────────────────────────────────────
    'not.over': { de: 'Bewusste Abgrenzung', en: 'Deliberate boundaries', es: 'Delimitación consciente', fr: 'Frontières assumées', it: 'Confini intenzionali' },
    'not.h':    { de: 'Was ArcUp <em>nicht</em> ist.', en: 'What ArcUp is <em>not</em>.', es: 'Lo que ArcUp <em>no</em> es.', fr: "Ce qu’ArcUp <em>n'est pas</em>.", it: 'Cosa ArcUp <em>non</em> è.' },
    'not.sub':  { de: 'Damit du weißt, wofür du dich entscheidest.', en: 'So you know what you’re choosing.', es: 'Para que sepas qué estás eligiendo.', fr: 'Pour que vous sachiez ce que vous choisissez.', it: 'Perché tu sappia cosa stai scegliendo.' },

    'not1.h': { de: 'Kein To-Do-Manager.', en: 'Not a to-do manager.', es: 'No es un gestor de tareas.', fr: 'Pas un gestionnaire de tâches.', it: 'Non è un gestore di to-do.' },
    'not1.b': { de: 'Habits sind keine Aufgaben mit Deadline. Ziele haben einen eigenen Platz.', en: 'Habits are not deadlined tasks. Goals have their own place.', es: 'Los hábitos no son tareas con fecha. Las metas tienen su propio lugar.', fr: 'Les habitudes ne sont pas des tâches à échéance. Les objectifs ont leur propre espace.', it: 'Le abitudini non sono task con scadenza. Gli obiettivi hanno il loro spazio.' },

    'not2.h': { de: 'Kein generischer Habit-Tracker.', en: 'Not a generic habit tracker.', es: 'No es un tracker de hábitos genérico.', fr: 'Pas un tracker d’habitudes générique.', it: 'Non è un tracker di abitudini generico.' },
    'not2.b': { de: 'Nicht „heute Sport gemacht ja/nein". Sondern „heute 5,2 km gelaufen". Numerisch, immer.', en: 'Not "did sport today yes/no". But "ran 5.2 km today". Numeric, always.', es: 'No «hice deporte sí/no». Sino «corrí 5,2 km hoy». Numérico, siempre.', fr: "Pas « fait du sport oui/non ». Mais « couru 5,2 km aujourd'hui ». Chiffré, toujours.", it: 'Non «fatto sport sì/no». Ma «corsi 5,2 km oggi». Numerico, sempre.' },

    'not3.h': { de: 'Kein Social Network.', en: 'Not a social network.', es: 'No es una red social.', fr: 'Pas un réseau social.', it: 'Non è un social network.' },
    'not3.b': { de: 'Keine Follower, keine Likes, keine Posts. Deine Insights sind privat.', en: 'No followers, no likes, no posts. Your insights are private.', es: 'Sin seguidores, sin likes, sin publicaciones. Tus insights son privados.', fr: 'Pas de followers, de likes, ni de posts. Vos insights sont privés.', it: 'Niente follower, like o post. I tuoi insights sono privati.' },

    'not4.h': { de: 'Kein Streak-um-jeden-Preis.', en: 'No streak at any cost.', es: 'No racha a cualquier precio.', fr: 'Pas de série à tout prix.', it: 'Niente streak a tutti i costi.' },
    'not4.b': { de: 'Streaks gibt es, aber Rest-Days sind eingebaut. Es gibt keine Streak-Shields.', en: 'Streaks exist, but rest days are built in. No streak shields.', es: 'Hay rachas, pero los días de descanso están integrados. Sin escudos de racha.', fr: 'Les séries existent, mais les jours de repos sont prévus. Pas de « boucliers de série ».', it: 'Le streak ci sono, ma i giorni di riposo sono integrati. Niente streak shield.' },

    'not5.h': { de: 'Keine Pure-Player-Konkurrenz.', en: 'No pure-player rivalry.', es: 'No competimos con apps específicas.', fr: 'Pas de concurrence avec les pure players.', it: 'Niente concorrenza con i pure player.' },
    'not5.b': { de: 'Wir sind die Struktur darüber — Strava, Headspace &amp; Co. bleiben ergänzend nutzbar.', en: 'We’re the structure above — Strava, Headspace &amp; co. stay complementary.', es: 'Somos la estructura por encima — Strava, Headspace y similares son complementos.', fr: 'Nous sommes la structure au-dessus — Strava, Headspace et compagnie restent complémentaires.', it: 'Siamo la struttura sopra — Strava, Headspace &amp; co. restano complementari.' },

    'not6.h': { de: 'Kein Dark Pattern.', en: 'No dark patterns.', es: 'Sin dark patterns.', fr: 'Pas de dark patterns.', it: 'Niente dark pattern.' },
    'not6.b': { de: 'Keine Werbung, keine Tracker, kein Notification-Spam. EU-Hosting, DSGVO.', en: 'No ads, no trackers, no notification spam. EU hosting, GDPR.', es: 'Sin anuncios, sin rastreadores, sin spam de notificaciones. Hosting UE, RGPD.', fr: 'Pas de pub, pas de trackers, pas de spam de notifications. Hébergement UE, RGPD.', it: 'Niente pubblicità, niente tracker, niente spam di notifiche. Hosting UE, GDPR.' },

    // ─── PRICING ─────────────────────────────────────────
    'pr.over': { de: 'Free oder Pro', en: 'Free or Pro', es: 'Free o Pro', fr: 'Free ou Pro', it: 'Free o Pro' },
    'pr.h':    { de: 'Du entscheidest.', en: 'You decide.', es: 'Tú decides.', fr: 'À vous de choisir.', it: 'Decidi tu.' },
    'pr.sub':  { de: 'Alle Kernfunktionen sind frei. Pro schaltet die Tiefe frei — Fundament, mehrere parallele ARCs, Insights, Journal, Ziele, KI-Generator.', en: 'All core features are free. Pro unlocks the depth — Fundament, multiple parallel ARCs, Insights, Journal, Goals, AI generator.', es: 'Las funciones esenciales son gratis. Pro desbloquea la profundidad — Fundament, varios ARCs en paralelo, Insights, Diario, Metas, generador IA.', fr: "Toutes les fonctions essentielles sont gratuites. Pro débloque la profondeur — Fundament, plusieurs ARC en parallèle, Insights, Journal, Objectifs, générateur IA.", it: "Tutte le funzioni principali sono gratis. Pro sblocca la profondità — Fundament, più ARC in parallelo, Insights, Diario, Obiettivi, generatore IA." },

    'pr.free.name':  { de: 'Free', en: 'Free', es: 'Free', fr: 'Free', it: 'Free' },
    'pr.free.tag':   { de: 'Für immer kostenlos.', en: 'Free forever.', es: 'Gratis para siempre.', fr: 'Gratuit pour toujours.', it: 'Gratis per sempre.' },
    'pr.free.l1':    { de: 'Habit-Tracking, über 120 kuratierte Habits', en: 'Habit tracking, 120+ curated habits', es: 'Tracking de hábitos, más de 120 curados', fr: 'Suivi d’habitudes, plus de 120 sélectionnées', it: 'Tracciamento abitudini, oltre 120 curate' },
    'pr.free.l2':    { de: '1 aktiver ARC gleichzeitig', en: '1 active ARC at a time', es: '1 ARC activo a la vez', fr: '1 ARC actif à la fois', it: '1 ARC attivo alla volta' },
    'pr.free.l3':    { de: 'Wheel of Life &amp; Selbstbewertung', en: 'Wheel of Life &amp; self-rating', es: 'Wheel of Life y autoevaluación', fr: 'Wheel of Life et auto-évaluation', it: 'Wheel of Life e autovalutazione' },
    'pr.free.l4':    { de: 'Quellen-Bibliothek (öffentliche Quellen)', en: 'Source library (public sources)', es: 'Biblioteca de fuentes (fuentes públicas)', fr: 'Bibliothèque de sources (sources publiques)', it: 'Biblioteca di fonti (fonti pubbliche)' },
    'pr.free.l5':    { de: 'Fundament (endloser Bereich, Pro)', en: 'Fundament (endless area, Pro)', es: 'Fundament (área sin fin, Pro)', fr: 'Fundament (espace sans fin, Pro)', it: 'Fundament (area senza fine, Pro)' },
    'pr.free.l6':    { de: 'Premium-ARCs (Pro)', en: 'Premium ARCs (Pro)', es: 'ARCs premium (Pro)', fr: 'ARC premium (Pro)', it: 'ARC premium (Pro)' },
    'pr.free.l7':    { de: 'Insights, Journal, Ziele (Pro)', en: 'Insights, Journal, Goals (Pro)', es: 'Insights, Diario, Metas (Pro)', fr: 'Insights, Journal, Objectifs (Pro)', it: 'Insights, Diario, Obiettivi (Pro)' },
    'pr.free.l8':    { de: 'Eigene ARCs &amp; KI-Generator (Pro)', en: 'Custom ARCs &amp; AI generator (Pro)', es: 'ARCs propios y generador IA (Pro)', fr: 'ARC personnalisés et générateur IA (Pro)', it: 'ARC personali e generatore IA (Pro)' },
    'pr.free.cta':   { de: 'Kostenlos starten', en: 'Start for free', es: 'Empezar gratis', fr: 'Commencer gratuitement', it: 'Inizia gratis' },

    'pr.lt.flag':   { de: 'Bestes Angebot', en: 'Best value', es: 'Mejor opción', fr: 'Meilleure offre', it: 'Migliore offerta' },
    'pr.lt.name':   { de: 'Pro Lifetime', en: 'Pro Lifetime', es: 'Pro Lifetime', fr: 'Pro Lifetime', it: 'Pro Lifetime' },
    'pr.lt.unit':   { de: '€ einmalig', en: '€ one-time', es: '€ pago único', fr: '€ unique', it: '€ una tantum' },
    'pr.lt.tag':    { de: 'Ein Preis. Alle Features. Für immer.', en: 'One price. All features. Forever.', es: 'Un precio. Todas las funciones. Para siempre.', fr: 'Un prix. Toutes les fonctions. Pour toujours.', it: 'Un prezzo. Tutte le funzioni. Per sempre.' },
    'pr.lt.l1':     { de: 'Alles aus Free', en: 'Everything in Free', es: 'Todo lo de Free', fr: 'Tout ce que contient Free', it: 'Tutto ciò che è in Free' },
    'pr.lt.l2':     { de: '<strong>Fundament</strong> — dein endloser Bereich für Alltags-Habits', en: '<strong>Fundament</strong> — your endless area for everyday habits', es: '<strong>Fundament</strong> — tu área sin fin para hábitos diarios', fr: '<strong>Fundament</strong> — votre espace sans fin pour les habitudes du quotidien', it: '<strong>Fundament</strong> — il tuo spazio senza fine per le abitudini quotidiane' },
    'pr.lt.l3':     { de: 'Mehrere aktive ARCs parallel', en: 'Multiple active ARCs in parallel', es: 'Varios ARCs activos en paralelo', fr: 'Plusieurs ARC actifs en parallèle', it: 'Più ARC attivi in parallelo' },
    'pr.lt.l4':     { de: 'Alle drei Insights-Tabs', en: 'All three Insights tabs', es: 'Las tres pestañas de Insights', fr: 'Les trois onglets Insights', it: 'Tutti e tre i tab di Insights' },
    'pr.lt.l5':     { de: 'Ziel-Tracking &amp; Journal in vier Typen', en: 'Goal tracking &amp; journal in four types', es: 'Seguimiento de metas y diario en cuatro tipos', fr: 'Suivi d’objectifs et journal en quatre types', it: 'Tracciamento obiettivi e diario in quattro tipi' },
    'pr.lt.l6':     { de: 'Eigene ARCs per Wizard', en: 'Custom ARCs via wizard', es: 'ARCs propios con asistente', fr: 'ARC personnalisés via assistant', it: 'ARC personali con procedura guidata' },
    'pr.lt.l7':     { de: 'KI-Generator (Wochen-Kontingent)', en: 'AI generator (weekly quota)', es: 'Generador IA (cuota semanal)', fr: 'Générateur IA (quota hebdo)', it: 'Generatore IA (quota settimanale)' },
    'pr.lt.l8':     { de: 'Erfolge teilen als Share-Image', en: 'Share achievements as share images', es: 'Comparte logros como imagen', fr: 'Partagez vos succès en image', it: 'Condividi i successi come immagine' },
    'pr.lt.cta':    { de: 'Pro Lifetime holen', en: 'Get Pro Lifetime', es: 'Conseguir Pro Lifetime', fr: 'Obtenir Pro Lifetime', it: 'Ottieni Pro Lifetime' },

    'pr.yr.name':   { de: 'Pro Jahr', en: 'Pro Yearly', es: 'Pro Anual', fr: 'Pro Annuel', it: 'Pro Annuale' },
    'pr.yr.unit':   { de: '€ / Jahr', en: '€ / year', es: '€ / año', fr: '€ / an', it: '€ / anno' },
    'pr.yr.tag':    { de: 'Jährlich abgerechnet, monatlich kündbar.', en: 'Billed yearly, cancel monthly.', es: 'Facturado anualmente, cancela cuando quieras.', fr: 'Facturé annuellement, résiliable chaque mois.', it: 'Fatturato annualmente, cancellabile mensilmente.' },
    'pr.yr.l1':     { de: 'Alles aus Pro', en: 'Everything in Pro', es: 'Todo lo de Pro', fr: 'Tout ce que contient Pro', it: 'Tutto ciò che è in Pro' },
    'pr.yr.l2':     { de: 'Auch monatlich verfügbar', en: 'Also available monthly', es: 'Disponible también mensualmente', fr: 'Aussi disponible mensuellement', it: 'Disponibile anche mensilmente' },
    'pr.yr.l3':     { de: 'Abrechnung über App Store oder Stripe', en: 'Billed via App Store or Stripe', es: 'Facturación vía App Store o Stripe', fr: 'Facturation via App Store ou Stripe', it: 'Fatturazione via App Store o Stripe' },
    'pr.yr.l4':     { de: 'Jederzeit kündbar — Daten bleiben erhalten', en: 'Cancel any time — your data stays', es: 'Cancela cuando quieras — tus datos se conservan', fr: 'Résiliable à tout moment — vos données restent', it: 'Cancellabile in qualsiasi momento — i tuoi dati restano' },
    'pr.yr.cta':    { de: 'Jährlich wählen', en: 'Choose yearly', es: 'Elegir anual', fr: 'Choisir annuel', it: 'Scegli annuale' },

    // ─── FAQ ─────────────────────────────────────────────
    'faq.over': { de: 'FAQ', en: 'FAQ', es: 'FAQ', fr: 'FAQ', it: 'FAQ' },
    'faq.h':    { de: 'Häufige Fragen.', en: 'Frequently asked questions.', es: 'Preguntas frecuentes.', fr: 'Questions fréquentes.', it: 'Domande frequenti.' },

    'faq1.q': { de: 'Was unterscheidet ArcUp von anderen Habit-Trackern?', en: 'What sets ArcUp apart from other habit trackers?', es: '¿Qué diferencia a ArcUp de otros habit trackers?', fr: 'Qu’est-ce qui distingue ArcUp des autres habit trackers ?', it: 'Cosa distingue ArcUp dagli altri habit tracker?' },
    'faq1.a': { de: 'Fünf Dinge: numerisches Tracking statt Häkchen, zeitlich begrenzte ARCs statt ewiger Disziplin-Marathons, progressive Ziele die automatisch wachsen, eine integrierte Quellen-Bibliothek und der Wheel of Life über fünf Lebensbereiche.', en: 'Five things: numeric tracking instead of checkmarks, time-boxed ARCs instead of endless discipline marathons, progressive targets that automatically grow, an integrated source library and a Wheel of Life across five areas.', es: 'Cinco cosas: tracking numérico en lugar de marcas, ARCs limitados en el tiempo en vez de maratones eternos de disciplina, objetivos progresivos que crecen solos, biblioteca integrada de fuentes y Wheel of Life sobre cinco áreas.', fr: 'Cinq choses : suivi chiffré au lieu de cases cochées, ARC à durée limitée plutôt que marathons de discipline sans fin, objectifs progressifs qui grandissent seuls, bibliothèque de sources intégrée et Wheel of Life sur cinq domaines.', it: 'Cinque cose: tracciamento numerico al posto delle spunte, ARC a tempo definito invece di maratone infinite di disciplina, obiettivi progressivi che crescono in automatico, biblioteca di fonti integrata e Wheel of Life sulle cinque aree.' },

    'faq2.q': { de: 'Was ist ein ARC?', en: 'What is an ARC?', es: '¿Qué es un ARC?', fr: 'Qu’est-ce qu’un ARC ?', it: 'Cos’è un ARC?' },
    'faq2.a': { de: 'Eine zeitlich begrenzte Challenge über 1 bis 12 Wochen. Sie bündelt 1 bis N Habits mit konkreten Ziel-Konfigurationen, hat einen klaren Start, ein Commitment-Statement, optional progressive Targets und endet in einer strukturierten Reflexion.', en: 'A time-boxed challenge of 1 to 12 weeks. It bundles 1 to N habits with concrete target configurations, has a clear start, a commitment statement, optionally progressive targets, and ends in a structured reflection.', es: 'Un reto de 1 a 12 semanas. Agrupa 1 a N hábitos con configuraciones de objetivo concretas, tiene inicio claro, declaración de compromiso, opcionalmente objetivos progresivos y termina con una reflexión estructurada.', fr: "Un défi à durée limitée de 1 à 12 semaines. Il regroupe 1 à N habitudes avec des cibles concrètes, possède un début clair, un engagement, des cibles progressives en option, et se termine par une réflexion structurée.", it: 'Una sfida a tempo definito da 1 a 12 settimane. Raggruppa 1 a N abitudini con target concreti, ha un inizio chiaro, una dichiarazione di impegno, target progressivi opzionali e termina con una riflessione strutturata.' },

    'faq3.q': { de: 'Woher kommen ARCs?', en: 'Where do ARCs come from?', es: '¿De dónde vienen los ARCs?', fr: 'D’où viennent les ARC ?', it: 'Da dove vengono gli ARC?' },
    'faq3.a': { de: 'Drei Quellen: <strong>kuratiert</strong> vom ArcUp-Team mit eigenen redaktionellen Briefings, <strong>selbst erstellt</strong> per Drei-Schritte-Wizard (Pro) oder <strong>KI-generiert</strong> aus einem natürlichsprachigen Prompt (Pro).', en: 'Three sources: <strong>curated</strong> by the ArcUp team with our own editorial briefings, <strong>self-made</strong> via a three-step wizard (Pro), or <strong>AI-generated</strong> from a natural-language prompt (Pro).', es: 'Tres fuentes: <strong>curados</strong> por el equipo ArcUp con nuestros propios briefings editoriales, <strong>creados por ti</strong> con un asistente de tres pasos (Pro), o <strong>generados por IA</strong> desde un prompt natural (Pro).', fr: "Trois sources : <strong>sélectionnés</strong> par l’équipe ArcUp avec nos propres briefings éditoriaux, <strong>créés par vous</strong> via un assistant en trois étapes (Pro), ou <strong>générés par IA</strong> à partir d'un prompt en langage naturel (Pro).", it: 'Tre fonti: <strong>curati</strong> dal team ArcUp con i nostri briefing editoriali, <strong>creati da te</strong> tramite procedura guidata in tre passi (Pro), o <strong>generati dall’IA</strong> da un prompt in linguaggio naturale (Pro).' },

    'faq4.q': { de: 'Was sind progressive Ziele?', en: 'What are progressive targets?', es: '¿Qué son los objetivos progresivos?', fr: 'Qu’est-ce que les objectifs progressifs ?', it: 'Cosa sono i target progressivi?' },
    'faq4.a': { de: 'Ein ARC-Habit kann statt eines festen Zielwerts einen Start- und Endwert haben. Der Zielwert wächst linear über die ARC-Laufzeit. Beispiel: Meditation von 5 Min. auf 20 Min. über 8 Wochen — du musst nichts manuell anpassen.', en: 'Instead of a fixed target, an ARC habit can have a start and end value. The target grows linearly across the ARC duration. Example: meditation from 5 min to 20 min over 8 weeks — no manual adjustment needed.', es: 'Un hábito de ARC puede tener valor inicial y final en lugar de uno fijo. El objetivo crece linealmente durante el ARC. Ejemplo: meditación de 5 a 20 min en 8 semanas — sin ajustes manuales.', fr: "Une habitude d'ARC peut avoir une valeur de début et de fin au lieu d'une cible fixe. L'objectif croît linéairement sur la durée de l'ARC. Exemple : méditation de 5 à 20 min sur 8 semaines — aucun ajustement manuel.", it: 'Un’abitudine ARC può avere valori di inizio e fine invece di un target fisso. L’obiettivo cresce linearmente lungo l’ARC. Esempio: meditazione da 5 a 20 min in 8 settimane — niente ritocchi manuali.' },

    'faq5.q': { de: 'Was ist das Fundament?', en: 'What is the Fundament?', es: '¿Qué es el Fundament?', fr: 'Qu’est-ce que le Fundament ?', it: 'Cos’è il Fundament?' }, // _x:'Was ist die Personal ARC?', en: 'What is the Personal ARC?', es: '¿Qué es la Personal ARC?', fr: 'Qu’est-ce que la Personal ARC ?', it: 'Cos’è la Personal ARC?' },
    'faq5.a': { de: 'Dein endloser persönlicher Bereich für Alltags-Habits — kein Enddatum, keine Reflexion erzwungen, frei konfigurierbar. Auch tracked-only Habits ohne Zielwert sind hier erlaubt. Jeder Pro-User bekommt automatisch genau ein Fundament.', en: 'Your endless personal area for everyday habits — no end date, no forced reflection, freely configurable. Tracked-only habits without target values are allowed. Every Pro user automatically gets exactly one Fundament.', es: 'Tu área personal sin fin para hábitos diarios — sin fecha de fin, sin reflexión obligatoria, configurable libremente. Aquí se permiten hábitos solo-tracked sin objetivo. Cada usuario Pro recibe automáticamente exactamente un Fundament.', fr: 'Votre espace personnel sans fin pour les habitudes du quotidien — pas de date de fin, pas de réflexion forcée, librement configurable. Les habitudes uniquement suivies, sans cible, y sont permises. Chaque utilisateur Pro reçoit automatiquement exactement un Fundament.', it: 'Il tuo spazio personale senza fine per le abitudini quotidiane — niente data di fine, niente riflessione forzata, configurabile liberamente. Sono ammesse anche abitudini solo tracciate, senza target. Ogni utente Pro riceve automaticamente esattamente un Fundament.' }, // _x:'Die einzige ARC ohne Enddatum — endlos, privat, frei konfigurierbar. Sie ist gedacht für Habits, die dich dauerhaft begleiten. Hier sind auch tracked-only Habits ohne Zielwert erlaubt. Ein Pro-Feature.', en: 'The only ARC without an end date — endless, private, freely configurable. Designed for habits that follow you long-term. Tracked-only habits without target values are allowed here. A Pro feature.', es: 'El único ARC sin fecha de fin — sin límite, privado, configurable libremente. Pensado para hábitos que te acompañan a largo plazo. Aquí se permiten hábitos solo-tracked sin objetivo. Una función Pro.', fr: "Le seul ARC sans date de fin — sans fin, privé, librement configurable. Pensé pour les habitudes qui vous accompagnent dans la durée. Les habitudes uniquement suivies, sans cible, y sont permises. Fonction Pro.", it: 'L’unico ARC senza data di fine — senza fine, privato, configurabile liberamente. Pensato per le abitudini che ti accompagnano a lungo. Qui sono ammesse anche abitudini solo tracciate, senza target. Funzione Pro.' },

    'faq6.q': { de: 'Was heißt „numerisches Tracking"?', en: 'What is "numeric tracking"?', es: '¿Qué es el «tracking numérico»?', fr: 'Que signifie « suivi chiffré » ?', it: 'Cosa significa «tracciamento numerico»?' },
    'faq6.a': { de: 'Jeder Habit hat Zielwert, Einheit und Richtung (≥ oder ≤). Statt „erledigt / nicht erledigt" trackst du echte Werte — „5,2 km gelaufen", „7 h geschlafen", „≤ 30 Min. Social Media" — mit proportionaler Erfüllung zwischen 0 und 100 %.', en: 'Each habit has a target value, a unit and a direction (≥ or ≤). Instead of "done / not done" you track real values — "ran 5.2 km", "slept 7 h", "≤ 30 min social media" — with proportional completion between 0 and 100%.', es: 'Cada hábito tiene valor objetivo, unidad y dirección (≥ o ≤). En vez de «hecho / no hecho» registras valores reales — «5,2 km corridos», «7 h de sueño», «≤ 30 min de redes» — con cumplimiento proporcional entre 0 y 100 %.', fr: "Chaque habitude a une valeur cible, une unité et une direction (≥ ou ≤). Au lieu de « fait / pas fait », vous suivez de vraies valeurs — « 5,2 km courus », « 7 h de sommeil », « ≤ 30 min de réseaux » — avec un achèvement proportionnel entre 0 et 100 %.", it: 'Ogni abitudine ha valore obiettivo, unità e direzione (≥ o ≤). Invece di «fatto / non fatto» tracci valori reali — «5,2 km corsi», «7 h di sonno», «≤ 30 min social» — con completamento proporzionale tra 0 e 100 %.' },

    'faq7.q': { de: 'Kann ich nachträglich Werte eintragen?', en: 'Can I enter values for past days?', es: '¿Puedo registrar valores retroactivos?', fr: 'Puis-je saisir des valeurs a posteriori ?', it: 'Posso inserire valori retroattivamente?' },
    'faq7.a': { de: 'Nein — bewusst nicht. Im Logbuch wird immer nur der heutige Tag getrackt. Keine Rückdatierung. Das ist Teil der Ehrlichkeit der App.', en: 'No — intentionally not. The logbook only tracks today. No back-dating. That’s part of the app’s honesty.', es: 'No — intencionadamente. El registro solo cubre el día de hoy. Sin retroactividad. Es parte de la honestidad de la app.', fr: "Non — volontairement. Le journal ne suit que la journée en cours. Pas d'antidatage. Cela fait partie de l'honnêteté de l'app.", it: 'No — di proposito. Il logbook traccia solo oggi. Niente retrodatazione. Fa parte dell’onestà dell’app.' },

    'faq8.q': { de: 'Wie funktioniert der Streak?', en: 'How does the streak work?', es: '¿Cómo funciona la racha?', fr: 'Comment fonctionne la série ?', it: 'Come funziona lo streak?' },
    'faq8.a': { de: 'Aufeinanderfolgende Tage mit 100 % Tageserfüllung. Ruhetage brechen den Streak nicht. Es gibt <strong>keine Streak-Shields</strong> — Ehrlichkeit statt Pay-to-Recover.', en: 'Consecutive days at 100% daily completion. Rest days don’t break the streak. <strong>No streak shields</strong> — honesty over pay-to-recover.', es: 'Días consecutivos al 100 % de cumplimiento diario. Los días de descanso no rompen la racha. <strong>Sin escudos de racha</strong> — honestidad antes que pagar para recuperar.', fr: 'Jours consécutifs à 100 % d’achèvement quotidien. Les jours de repos ne cassent pas la série. <strong>Pas de boucliers</strong> — l’honnêteté plutôt que le pay-to-recover.', it: 'Giorni consecutivi al 100 % di completamento giornaliero. I giorni di riposo non rompono lo streak. <strong>Niente streak shield</strong> — onestà invece del pay-to-recover.' },

    'faq9.q': { de: 'Auf welchen Plattformen läuft ArcUp?', en: 'Which platforms does ArcUp run on?', es: '¿En qué plataformas funciona ArcUp?', fr: 'Sur quelles plateformes fonctionne ArcUp ?', it: 'Su quali piattaforme funziona ArcUp?' },
    'faq9.a': { de: 'Native iOS- und Android-App. Funktionsumfang identisch. Sprachen: Englisch, Deutsch, Spanisch, Französisch, Italienisch.', en: 'Native iOS and Android. Identical feature set. Languages: English, German, Spanish, French, Italian.', es: 'App nativa para iOS y Android. Mismas funciones. Idiomas: inglés, alemán, español, francés, italiano.', fr: "Application native iOS et Android. Mêmes fonctions. Langues : anglais, allemand, espagnol, français, italien.", it: 'App native iOS e Android. Stesse funzioni. Lingue: inglese, tedesco, spagnolo, francese, italiano.' },

    'faq11.q': { de: 'Wer schreibt die Inhalte der Lern-Mediathek?', en: 'Who writes the content in the Learning Library?', es: '¿Quién escribe el contenido de la biblioteca?', fr: 'Qui écrit le contenu de la bibliothèque ?', it: 'Chi scrive i contenuti della biblioteca?' },
    'faq11.a': { de: 'Das ArcUp-Team. Die <strong>ArcUp Originals</strong> sind eigene redaktionelle Briefings zu etablierten Konzepten wie Trainingswissenschaft, Schlafhygiene, Atemtechniken oder Fokus. Bei der Erstellung unterstützt uns das KI-Modell Claude (Anthropic); jedes Briefing wird anschließend redaktionell geprüft und freigegeben. Wir reproduzieren keine geschützten Inhalte aus fremden Werken.', en: 'The ArcUp team. The <strong>ArcUp Originals</strong> are our own editorial briefings on established concepts like training science, sleep hygiene, breathing techniques or focus. We use the AI model Claude (Anthropic) for support; every briefing is then editorially reviewed and released. We do not reproduce protected content from other works.', es: 'El equipo ArcUp. Los <strong>ArcUp Originals</strong> son nuestros propios briefings editoriales sobre conceptos establecidos como ciencia del entrenamiento, higiene del sueño, técnicas de respiración o foco. Nos apoyamos en el modelo de IA Claude (Anthropic); cada briefing se revisa y aprueba editorialmente. No reproducimos contenido protegido de obras ajenas.', fr: "L'équipe ArcUp. Les <strong>ArcUp Originals</strong> sont nos propres briefings éditoriaux sur des concepts établis comme la science de l'entraînement, l'hygiène du sommeil, les techniques de respiration ou la concentration. Nous nous appuyons sur le modèle d'IA Claude (Anthropic) ; chaque briefing est ensuite revu et validé éditorialement. Nous ne reproduisons pas de contenus protégés issus d'œuvres tierces.", it: 'Il team ArcUp. Gli <strong>ArcUp Originals</strong> sono i nostri briefing editoriali su concetti consolidati come scienza dell’allenamento, igiene del sonno, tecniche di respirazione o focus. Per la creazione ci appoggiamo al modello IA Claude (Anthropic); ogni briefing viene poi rivisto e approvato editorialmente. Non riproduciamo contenuti protetti da opere di terzi.' },

    'faq12.q': { de: 'Wie verdient ihr Geld neben Pro?', en: 'How do you earn besides Pro?', es: '¿Cómo ganáis dinero aparte de Pro?', fr: 'Comment gagnez-vous de l’argent en dehors de Pro ?', it: 'Come guadagnate oltre a Pro?' },
    'faq12.a': { de: 'Wo es passt, verlinken wir vertiefende Bücher als optionale Empfehlungen. Diese Links sind mit einem <code>*</code> markiert und führen zu Amazon. Als Amazon-Partner erhält ArcUp eine Werbekostenerstattung — <strong>ohne Mehrkosten für dich</strong>. Die Auswahl der empfohlenen Werke folgt rein redaktionellen Kriterien; die Affiliate-Vergütung beeinflusst die Empfehlung nicht.', en: 'Where it fits, we link to in-depth books as optional recommendations. These links are marked with a <code>*</code> and lead to Amazon. As an Amazon Associate, ArcUp earns from qualifying purchases — <strong>at no extra cost to you</strong>. The selection of recommended works follows purely editorial criteria; affiliate compensation does not influence the recommendation.', es: 'Cuando encaja, enlazamos libros para profundizar como recomendaciones opcionales. Estos enlaces están marcados con un <code>*</code> y van a Amazon. Como afiliado de Amazon, ArcUp recibe una comisión — <strong>sin coste adicional para ti</strong>. La selección de obras recomendadas sigue criterios puramente editoriales; la comisión no influye en la recomendación.', fr: "Quand cela a du sens, nous renvoyons vers des livres d'approfondissement comme recommandations optionnelles. Ces liens sont marqués d'un <code>*</code> et mènent à Amazon. En tant que partenaire Amazon, ArcUp perçoit une commission — <strong>sans surcoût pour vous</strong>. La sélection des œuvres suit uniquement des critères éditoriaux ; la commission n'influence pas la recommandation.", it: 'Dove ha senso, segnaliamo libri di approfondimento come consigli opzionali. Questi link sono marcati con <code>*</code> e portano ad Amazon. Come partner Amazon, ArcUp riceve una commissione — <strong>senza costi aggiuntivi per te</strong>. La selezione delle opere segue criteri puramente editoriali; la commissione non influenza la raccomandazione.' },

    'faq10.q': { de: 'Wo werden meine Daten gespeichert?', en: 'Where is my data stored?', es: '¿Dónde se almacenan mis datos?', fr: 'Où sont stockées mes données ?', it: 'Dove vengono salvati i miei dati?' },
    'faq10.a': { de: 'Auf EU-Servern mit Row-Level-Security. Keine Werbung, keine Tracker, keine Dark Patterns. Export gemäß DSGVO Art. 20 jederzeit möglich.', en: 'On EU servers with row-level security. No ads, no trackers, no dark patterns. Export under GDPR Art. 20 is always available.', es: 'En servidores de la UE con row-level security. Sin anuncios, sin rastreadores, sin dark patterns. Exportación según RGPD Art. 20 disponible en cualquier momento.', fr: "Sur des serveurs UE avec row-level security. Pas de pub, pas de trackers, pas de dark patterns. Export conforme à l'art. 20 RGPD à tout moment.", it: 'Su server UE con row-level security. Niente pubblicità, niente tracker, niente dark pattern. Esportazione ai sensi dell’art. 20 GDPR sempre disponibile.' },

    // ─── CTA ─────────────────────────────────────────────
    'cta.h':   { de: 'Starte einen <em>ARC</em>,<br />keinen Vorsatz.', en: 'Start an <em>ARC</em>,<br />not a resolution.', es: 'Empieza un <em>ARC</em>,<br />no un propósito.', fr: 'Lancez un <em>ARC</em>,<br />pas une résolution.', it: 'Lancia un <em>ARC</em>,<br />non un buon proposito.' },
    'cta.sub': { de: 'ArcUp: Building Better Habits. Kostenlos laden. iOS &amp; Android.', en: 'ArcUp: Building Better Habits. Free to download. iOS &amp; Android.', es: 'ArcUp: Building Better Habits. Descarga gratuita. iOS y Android.', fr: 'ArcUp : Building Better Habits. Téléchargement gratuit. iOS et Android.', it: 'ArcUp: Building Better Habits. Download gratuito. iOS e Android.' },
    'cta.appStoreAria': { de: 'Im App Store laden', en: 'Download on the App Store', es: 'Descargar en App Store', fr: "Télécharger sur l'App Store", it: 'Scarica su App Store' },
    'cta.appStoreSmall':{ de: 'Download on the', en: 'Download on the', es: 'Descargar en', fr: 'Télécharger sur l’', it: 'Scarica su' },
    'cta.appStoreBig':  { de: 'App Store', en: 'App Store', es: 'App Store', fr: 'App Store', it: 'App Store' },
    'cta.googleAria':   { de: 'Bei Google Play laden', en: 'Get it on Google Play', es: 'Disponible en Google Play', fr: 'Disponible sur Google Play', it: 'Disponibile su Google Play' },
    'cta.googleSmall':  { de: 'Get it on', en: 'Get it on', es: 'Disponible en', fr: 'Disponible sur', it: 'Disponibile su' },
    'cta.googleBig':    { de: 'Google Play', en: 'Google Play', es: 'Google Play', fr: 'Google Play', it: 'Google Play' },

    // ─── FOOTER ──────────────────────────────────────────
    'ft.tag':          { de: 'Building Better Habits.', en: 'Building Better Habits.', es: 'Building Better Habits.', fr: 'Building Better Habits.', it: 'Building Better Habits.' },
    'ft.system':       { de: 'Das System', en: 'The System', es: 'El Sistema', fr: 'Le Système', it: 'Il Sistema' },
    'ft.areas':        { de: 'Lebensbereiche', en: 'Life Areas', es: 'Áreas de vida', fr: 'Domaines de vie', it: 'Aree di vita' },
    'ft.pricing':      { de: 'Pro', en: 'Pro', es: 'Pro', fr: 'Pro', it: 'Pro' },
    'ft.faq':          { de: 'FAQ', en: 'FAQ', es: 'FAQ', fr: 'FAQ', it: 'FAQ' },
    'ft.impressum':    { de: 'Impressum', en: 'Imprint', es: 'Aviso legal', fr: 'Mentions légales', it: 'Note legali' },
    'ft.datenschutz':  { de: 'Datenschutz', en: 'Privacy', es: 'Privacidad', fr: 'Confidentialité', it: 'Privacy' },
    'ft.agb':          { de: 'AGB', en: 'Terms', es: 'Términos', fr: 'CGU', it: 'Termini' },
    'ft.macroMicroMeso': { de: 'Macro · Meso · Micro', en: 'Macro · Meso · Micro', es: 'Macro · Meso · Micro', fr: 'Macro · Meso · Micro', it: 'Macro · Meso · Micro' },

    // ─── LEGAL PAGES ─────────────────────────────────────
    'legal.lastUpdated': {
      de: 'Stand: 23. Mai 2026',
      en: 'Last updated: 23 May 2026',
      es: 'Última actualización: 23 de mayo de 2026',
      fr: 'Dernière mise à jour : 23 mai 2026',
      it: 'Ultimo aggiornamento: 23 maggio 2026',
    },
    'legal.fallbackNotice': {
      de: '',
      en: '',
      es: 'Este documento solo está disponible en alemán y en inglés. Se muestra la versión en inglés.',
      fr: "Ce document n'est disponible qu'en allemand et en anglais. La version anglaise est affichée.",
      it: 'Questo documento è disponibile solo in tedesco e in inglese. È mostrata la versione inglese.',
    },
    'legal.impressum.title':   { de: 'Impressum &amp; Offenlegung', en: 'Imprint &amp; Disclosure', es: 'Aviso legal y divulgación', fr: 'Mentions légales', it: 'Note legali' },
    'legal.datenschutz.title': { de: 'Datenschutzerklärung', en: 'Privacy Policy', es: 'Política de privacidad', fr: 'Politique de confidentialité', it: 'Informativa sulla privacy' },
    'legal.agb.title':         { de: 'Allgemeine Geschäftsbedingungen', en: 'Terms of Service', es: 'Términos y condiciones', fr: "Conditions générales d'utilisation", it: 'Termini e condizioni' },

    // Page titles
    'title.impressum':   { de: 'Impressum — ArcUp', en: 'Imprint — ArcUp', es: 'Aviso legal — ArcUp', fr: 'Mentions légales — ArcUp', it: 'Note legali — ArcUp' },
    'title.datenschutz': { de: 'Datenschutzerklärung — ArcUp', en: 'Privacy Policy — ArcUp', es: 'Política de privacidad — ArcUp', fr: 'Politique de confidentialité — ArcUp', it: 'Informativa sulla privacy — ArcUp' },
    'title.agb':         { de: 'AGB — ArcUp', en: 'Terms — ArcUp', es: 'Términos — ArcUp', fr: 'CGU — ArcUp', it: 'Termini — ArcUp' },
  };

  // ──────────────────────────────────────────────────────────
  // CORE
  // ──────────────────────────────────────────────────────────
  function detectInitial() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const nav = (navigator.language || 'de').slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(nav)) return nav;
    return DEFAULT_LANG;
  }

  function translate(key, lang) {
    const entry = DICT[key];
    if (!entry) return null;
    return entry[lang] ?? entry[DEFAULT_LANG] ?? null;
  }

  function applyTranslations(lang) {
    // textContent
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = translate(key, lang);
      if (val !== null) el.textContent = decodeEntities(val);
    });
    // innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const val = translate(key, lang);
      if (val !== null) el.innerHTML = val;
    });
    // attributes
    Array.from(document.querySelectorAll('*')).forEach((el) => {
      for (const attr of Array.from(el.attributes)) {
        const m = attr.name.match(/^data-i18n-attr-(.+)$/);
        if (!m) continue;
        const target = m[1];
        const val = translate(attr.value, lang);
        if (val !== null) el.setAttribute(target, decodeEntities(val));
      }
    });
    // Page title
    const titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey) {
      const t = translate(titleKey, lang);
      if (t) document.title = decodeEntities(t);
    }
    // Reflect on <html lang>
    document.documentElement.setAttribute('lang', lang);
  }

  function decodeEntities(s) {
    // Decode common HTML entities for textContent assignments (so &amp; renders as &)
    if (!/&[a-z#0-9]+;/i.test(s)) return s;
    const ta = document.createElement('textarea');
    ta.innerHTML = s;
    return ta.value;
  }

  // ──────────────────────────────────────────────────────────
  // SWITCHER UI (auto-injects into [data-lang-switcher])
  // ──────────────────────────────────────────────────────────
  function buildSwitcher(mount, currentLang, onChange) {
    mount.classList.add('lang-switch');
    mount.innerHTML = `
      <button class="lang-switch-btn" type="button" aria-haspopup="listbox" aria-expanded="false">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="lang-switch-current">${currentLang.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <ul class="lang-switch-menu" role="listbox">
        ${SUPPORTED.map((code) => `
          <li role="option">
            <button type="button" data-lang="${code}" aria-current="${code === currentLang}">
              <span>${LANG_LABELS[code]}</span>
              <span class="lang-code">${code}</span>
            </button>
          </li>
        `).join('')}
      </ul>
    `;

    const btn = mount.querySelector('.lang-switch-btn');
    const menu = mount.querySelector('.lang-switch-menu');

    function close() {
      mount.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function open() {
      mount.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      mount.classList.contains('open') ? close() : open();
    });
    document.addEventListener('click', (e) => {
      if (!mount.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    menu.querySelectorAll('button[data-lang]').forEach((b) => {
      b.addEventListener('click', () => {
        const code = b.getAttribute('data-lang');
        onChange(code);
        close();
      });
    });

    // Set aria-label
    btn.setAttribute('aria-label', translate('nav.lang', currentLang) || 'Select language');
  }

  function updateSwitcherState(mount, lang) {
    const cur = mount.querySelector('.lang-switch-current');
    if (cur) cur.textContent = lang.toUpperCase();
    mount.querySelectorAll('button[data-lang]').forEach((b) => {
      b.setAttribute('aria-current', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    const btn = mount.querySelector('.lang-switch-btn');
    if (btn) btn.setAttribute('aria-label', translate('nav.lang', lang) || 'Select language');
  }

  // ──────────────────────────────────────────────────────────
  // BOOT
  // ──────────────────────────────────────────────────────────
  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);
    document.querySelectorAll('[data-lang-switcher]').forEach((m) => updateSwitcherState(m, lang));
    document.dispatchEvent(new CustomEvent('arcup:langchange', { detail: { lang } }));
  }

  function init() {
    const lang = detectInitial();
    document.querySelectorAll('[data-lang-switcher]').forEach((mount) => {
      buildSwitcher(mount, lang, setLang);
    });
    applyTranslations(lang);
  }

  // Expose minimal API
  window.ArcUpI18n = { setLang, getLang: () => document.documentElement.lang || DEFAULT_LANG, supported: SUPPORTED.slice() };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
