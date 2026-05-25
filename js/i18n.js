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
    // Old faq1–faq12 keys removed — replaced by faq01–faq40 (see FAQ v2 section below).

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
    'title.faq':         { de: 'FAQ — ArcUp', en: 'FAQ — ArcUp', es: 'FAQ — ArcUp', fr: 'FAQ — ArcUp', it: 'FAQ — ArcUp' },

    'faq.intro': {
      de: 'Antworten auf die Fragen, die uns am häufigsten zu Habits, ARCs, dem Fundament, der Lern-Mediathek, Pricing und Datenschutz gestellt werden.',
      en: 'Answers to the questions we get asked most about habits, ARCs, the Fundament, the Learning Library, pricing and privacy.',
      es: 'Respuestas a las preguntas más frecuentes sobre hábitos, ARCs, el Fundament, la biblioteca, precios y privacidad.',
      fr: "Réponses aux questions qu'on nous pose le plus souvent sur les habitudes, les ARC, le Fundament, la bibliothèque, les tarifs et la confidentialité.",
      it: 'Risposte alle domande più frequenti su abitudini, ARC, Fundament, biblioteca, prezzi e privacy.',
    },
    'faq.legalHint': {
      de: 'Du suchst rechtliche Informationen?',
      en: 'Looking for legal information?',
      es: '¿Buscas información legal?',
      fr: 'Vous cherchez des informations légales ?',
      it: 'Cerchi informazioni legali?',
    },
    'faq.allCta': {
      de: 'Alle 40 Fragen ansehen →',
      en: 'See all 40 questions →',
      es: 'Ver las 40 preguntas →',
      fr: 'Voir les 40 questions →',
      it: 'Vedi tutte le 40 domande →',
    },

    // ─── FAQ v2 — SECTION LABELS ─────────────────────────
    'faqs.basics':     { de: 'Grundlagen', en: 'Basics', es: 'Conceptos básicos', fr: 'Notions de base', it: 'Nozioni di base' },
    'faqs.arcsHabits': { de: 'ARCs &amp; Habits im Detail', en: 'ARCs &amp; habits in detail', es: 'ARCs y hábitos en detalle', fr: 'ARC et habitudes en détail', it: 'ARC e abitudini in dettaglio' },
    'faqs.tracking':   { de: 'Tracking &amp; Logging', en: 'Tracking &amp; logging', es: 'Seguimiento y registro', fr: 'Suivi et journal', it: 'Tracciamento e log' },
    'faqs.streaks':    { de: 'Streaks, Rest Days &amp; Vacation', en: 'Streaks, rest days &amp; vacation', es: 'Rachas, días de descanso y vacaciones', fr: 'Streaks, jours de repos et vacances', it: 'Streak, giorni di riposo e vacanze' },
    'faqs.library':    { de: 'Library &amp; Sources', en: 'Library &amp; sources', es: 'Biblioteca y fuentes', fr: 'Bibliothèque et sources', it: 'Biblioteca e fonti' },
    'faqs.freePro':    { de: 'Free vs Pro', en: 'Free vs Pro', es: 'Free vs Pro', fr: 'Free vs Pro', it: 'Free vs Pro' },
    'faqs.aiCoach':    { de: 'AI Coach', en: 'AI Coach', es: 'AI Coach', fr: 'AI Coach', it: 'AI Coach' },
    'faqs.insights':   { de: 'Insights &amp; Reflexion', en: 'Insights &amp; reflection', es: 'Insights y reflexión', fr: 'Insights et réflexion', it: 'Insights e riflessione' },
    'faqs.settings':   { de: 'Persönliche Einstellungen', en: 'Personal settings', es: 'Ajustes personales', fr: 'Paramètres personnels', it: 'Impostazioni personali' },
    'faqs.privacy':    { de: 'Daten &amp; Datenschutz', en: 'Data &amp; privacy', es: 'Datos y privacidad', fr: 'Données et confidentialité', it: 'Dati e privacy' },
    'faqs.tech':       { de: 'Technik &amp; Plattform', en: 'Technology &amp; platform', es: 'Tecnología y plataforma', fr: 'Technologie et plateforme', it: 'Tecnologia e piattaforma' },

    // ─── FAQ v2 — 01–10 (Basics, ARCs & Habits) ──────────
    'faq01.q': { de: 'Was ist ArcUp?', en: 'What is ArcUp?', es: '¿Qué es ArcUp?', fr: "Qu'est-ce qu'ArcUp ?", it: "Cos'è ArcUp?" },
    'faq01.a': {
      de: 'ArcUp ist eine mobile App für <strong>strukturierte persönliche Entwicklung</strong>. Sie verbindet drei Zeit-Ebenen miteinander:<ul><li><strong>Compass (Macro)</strong> – fünf Life Areas mit deiner langfristigen Vision (<em>Wer will ich werden?</em>)</li><li><strong>ARCs (Meso)</strong> – zeitlich begrenzte Challenges über 1 bis 12 Wochen (<em>Was übe ich gerade gezielt?</em>)</li><li><strong>Habits (Micro)</strong> – numerisch messbare Tagesgewohnheiten (<em>Was tue ich heute konkret?</em>)</li></ul>Unser Tagline: <em>ArcUp – Building Better Habits.</em>',
      en: 'ArcUp is a mobile app for <strong>structured personal development</strong>. It connects three time horizons:<ul><li><strong>Compass (macro)</strong> – five life areas with your long-term vision (<em>Who do I want to become?</em>)</li><li><strong>ARCs (meso)</strong> – time-boxed challenges of 1 to 12 weeks (<em>What am I deliberately practising right now?</em>)</li><li><strong>Habits (micro)</strong> – numerically measurable daily habits (<em>What am I concretely doing today?</em>)</li></ul>Our tagline: <em>ArcUp – Building Better Habits.</em>',
      es: 'ArcUp es una app móvil para el <strong>desarrollo personal estructurado</strong>. Conecta tres horizontes temporales:<ul><li><strong>Compass (macro)</strong> – cinco life areas con tu visión a largo plazo (<em>¿Quién quiero ser?</em>)</li><li><strong>ARCs (meso)</strong> – retos limitados en el tiempo de 1 a 12 semanas (<em>¿Qué practico ahora con intención?</em>)</li><li><strong>Habits (micro)</strong> – hábitos diarios numéricamente medibles (<em>¿Qué hago hoy en concreto?</em>)</li></ul>Nuestro tagline: <em>ArcUp – Building Better Habits.</em>',
      fr: "ArcUp est une app mobile pour le <strong>développement personnel structuré</strong>. Elle relie trois horizons temporels :<ul><li><strong>Compass (macro)</strong> — cinq life areas avec ta vision à long terme (<em>Qui je veux devenir ?</em>)</li><li><strong>ARCs (méso)</strong> — défis limités dans le temps de 1 à 12 semaines (<em>Que suis-je en train de pratiquer délibérément ?</em>)</li><li><strong>Habits (micro)</strong> — habitudes quotidiennes mesurables numériquement (<em>Que fais-je concrètement aujourd'hui ?</em>)</li></ul>Notre tagline : <em>ArcUp – Building Better Habits.</em>",
      it: "ArcUp è un'app mobile per lo <strong>sviluppo personale strutturato</strong>. Collega tre orizzonti temporali:<ul><li><strong>Compass (macro)</strong> – cinque life area con la tua visione a lungo termine (<em>Chi voglio diventare?</em>)</li><li><strong>ARC (meso)</strong> – sfide a tempo limitato di 1 a 12 settimane (<em>Cosa sto praticando deliberatamente ora?</em>)</li><li><strong>Habit (micro)</strong> – abitudini quotidiane misurabili numericamente (<em>Cosa faccio concretamente oggi?</em>)</li></ul>La nostra tagline: <em>ArcUp – Building Better Habits.</em>",
    },
    'faq02.q': { de: 'Ist ArcUp ein klassischer Habit-Tracker?', en: 'Is ArcUp a classic habit tracker?', es: '¿ArcUp es un habit tracker clásico?', fr: 'ArcUp est-il un habit tracker classique ?', it: 'ArcUp è un habit tracker classico?' },
    'faq02.a': {
      de: 'Nein. Ein klassischer Habit-Tracker zeichnet „heute gemacht – ja/nein" auf. ArcUp tracked <strong>numerisch</strong>: nicht „heute gelaufen", sondern „heute 5,2 km gelaufen". Jeder Habit hat eine Einheit (km, min, kg, Wiederholungen, …), einen Zielwert, eine Richtung (≥ oder ≤) und ein Intervall (täglich oder wöchentlich). Dadurch wird Fortschritt messbar statt geschätzt.',
      en: 'No. A classic habit tracker records "done today — yes/no". ArcUp tracks <strong>numerically</strong>: not "ran today", but "ran 5.2 km today". Every habit has a unit (km, min, kg, reps, …), a target value, a direction (≥ or ≤) and an interval (daily or weekly). That makes progress measurable instead of guessed.',
      es: 'No. Un habit tracker clásico registra «hecho hoy — sí/no». ArcUp registra de forma <strong>numérica</strong>: no «corrí hoy», sino «corrí 5,2 km hoy». Cada hábito tiene una unidad (km, min, kg, repeticiones, …), un valor objetivo, una dirección (≥ o ≤) y un intervalo (diario o semanal). Así el progreso es medible, no estimado.',
      fr: "Non. Un habit tracker classique note « fait aujourd'hui — oui/non ». ArcUp suit <strong>numériquement</strong> : pas « couru aujourd'hui », mais « couru 5,2 km aujourd'hui ». Chaque habitude a une unité (km, min, kg, répétitions, …), une valeur cible, une direction (≥ ou ≤) et un intervalle (quotidien ou hebdomadaire). Le progrès devient mesurable, pas estimé.",
      it: "No. Un habit tracker classico registra «fatto oggi — sì/no». ArcUp traccia in modo <strong>numerico</strong>: non «corso oggi», ma «corsi 5,2 km oggi». Ogni abitudine ha un'unità (km, min, kg, ripetizioni, …), un valore obiettivo, una direzione (≥ o ≤) e un intervallo (giornaliero o settimanale). Il progresso diventa misurabile, non stimato.",
    },
    'faq03.q': { de: 'Was ist ein ARC?', en: 'What is an ARC?', es: '¿Qué es un ARC?', fr: "Qu'est-ce qu'un ARC ?", it: "Cos'è un ARC?" },
    'faq03.a': {
      de: 'Ein ARC ist eine <strong>zeitlich begrenzte Challenge</strong> von 1 bis 12 Wochen, die mehrere Habits zu einem fokussierten Vorhaben bündelt – zum Beispiel „Tiefer schlafen in 4 Wochen" oder „30 Tage Atem-Reset". Jeder ARC hat ein klares Versprechen, eine Theorie (das <em>Warum</em>), praktische Tipps (das <em>Wie</em>) und 3–6 konkrete Habits mit individuellen Zielen. ARCs haben einen Anfang und ein Ende – im Gegensatz zu endlosen Tracking-Streaks.',
      en: 'An ARC is a <strong>time-boxed challenge</strong> of 1 to 12 weeks that bundles several habits into one focused project — for example "Sleep deeper in 4 weeks" or "30-day breath reset". Every ARC has a clear promise, a theory (the <em>why</em>), practical tips (the <em>how</em>) and 3–6 concrete habits with individual targets. ARCs have a start and an end — unlike endless tracking streaks.',
      es: 'Un ARC es un <strong>reto limitado en el tiempo</strong> de 1 a 12 semanas que agrupa varios hábitos en un proyecto enfocado — por ejemplo «Dormir mejor en 4 semanas» o «30 días de reset de respiración». Cada ARC tiene una promesa clara, una teoría (el <em>porqué</em>), consejos prácticos (el <em>cómo</em>) y de 3 a 6 hábitos concretos con objetivos individuales. Los ARCs tienen inicio y final — a diferencia de las rachas infinitas.',
      fr: "Un ARC est un <strong>défi limité dans le temps</strong> de 1 à 12 semaines qui regroupe plusieurs habitudes dans un projet focalisé — par exemple « Mieux dormir en 4 semaines » ou « 30 jours de reset respiration ». Chaque ARC a une promesse claire, une théorie (le <em>pourquoi</em>), des conseils pratiques (le <em>comment</em>) et de 3 à 6 habitudes concrètes avec des objectifs individuels. Les ARC ont un début et une fin — contrairement aux séries infinies.",
      it: "Un ARC è una <strong>sfida a tempo limitato</strong> di 1 a 12 settimane che riunisce più abitudini in un progetto focalizzato — per esempio «Dormire meglio in 4 settimane» o «30 giorni di reset del respiro». Ogni ARC ha una promessa chiara, una teoria (il <em>perché</em>), consigli pratici (il <em>come</em>) e 3–6 abitudini concrete con obiettivi individuali. Gli ARC hanno un inizio e una fine — a differenza degli streak infiniti.",
    },
    'faq04.q': { de: 'Was sind die fünf Life Areas?', en: 'What are the five life areas?', es: '¿Cuáles son las cinco life areas?', fr: 'Quelles sont les cinq life areas ?', it: 'Quali sono le cinque life area?' },
    'faq04.a': {
      de: 'Der Compass besteht aus genau fünf Lebensbereichen:<ul><li><strong>Body</strong> – Sport, Schlaf, Ernährung, Recovery</li><li><strong>Mind</strong> – Meditation, Achtsamkeit, Stress-Regulation</li><li><strong>Growth</strong> – Lernen, Lesen, Karriere, Goal-Setting</li><li><strong>Relationships</strong> – Quality Time, Active Listening, Familienrituale</li><li><strong>Leisure</strong> – Hobbies, Naturzeit, kreative Aktivitäten</li></ul>Du bewertest jede Life Area regelmäßig auf einer Skala von 1–10 (Wheel of Life), schreibst eine persönliche Vision dazu und siehst auf einen Blick, wo du gerade unausgewogen bist.',
      en: 'The Compass consists of exactly five life areas:<ul><li><strong>Body</strong> — sport, sleep, nutrition, recovery</li><li><strong>Mind</strong> — meditation, mindfulness, stress regulation</li><li><strong>Growth</strong> — learning, reading, career, goal setting</li><li><strong>Relationships</strong> — quality time, active listening, family rituals</li><li><strong>Leisure</strong> — hobbies, time in nature, creative activities</li></ul>You rate each life area regularly on a scale of 1–10 (Wheel of Life), write a personal vision and see at a glance where you are currently unbalanced.',
      es: 'El Compass consta de exactamente cinco áreas de vida:<ul><li><strong>Body</strong> — deporte, sueño, nutrición, recuperación</li><li><strong>Mind</strong> — meditación, atención plena, regulación del estrés</li><li><strong>Growth</strong> — aprendizaje, lectura, carrera, metas</li><li><strong>Relationships</strong> — tiempo de calidad, escucha activa, rituales familiares</li><li><strong>Leisure</strong> — aficiones, naturaleza, actividades creativas</li></ul>Puntúas cada área regularmente del 1 al 10 (Wheel of Life), escribes una visión personal y ves de un vistazo dónde estás desequilibrado.',
      fr: "Le Compass comprend exactement cinq domaines de vie :<ul><li><strong>Body</strong> — sport, sommeil, nutrition, récupération</li><li><strong>Mind</strong> — méditation, pleine conscience, gestion du stress</li><li><strong>Growth</strong> — apprentissage, lecture, carrière, objectifs</li><li><strong>Relationships</strong> — temps de qualité, écoute active, rituels familiaux</li><li><strong>Leisure</strong> — loisirs, nature, activités créatives</li></ul>Tu notes chaque domaine régulièrement de 1 à 10 (Wheel of Life), tu écris une vision personnelle et tu vois d'un coup d'œil où tu es déséquilibré.",
      it: 'Il Compass è composto da esattamente cinque aree di vita:<ul><li><strong>Body</strong> — sport, sonno, nutrizione, recupero</li><li><strong>Mind</strong> — meditazione, mindfulness, regolazione dello stress</li><li><strong>Growth</strong> — apprendimento, lettura, carriera, obiettivi</li><li><strong>Relationships</strong> — tempo di qualità, ascolto attivo, rituali familiari</li><li><strong>Leisure</strong> — hobby, natura, attività creative</li></ul>Valuti ogni area regolarmente da 1 a 10 (Wheel of Life), scrivi una visione personale e vedi a colpo d’occhio dove sei sbilanciato.',
    },
    'faq05.q': { de: 'Für wen ist ArcUp gedacht?', en: 'Who is ArcUp for?', es: '¿Para quién es ArcUp?', fr: 'À qui s’adresse ArcUp ?', it: 'A chi è rivolto ArcUp?' },
    'faq05.a': {
      de: 'Für alle, die <strong>strukturiert</strong> an sich arbeiten wollen statt zufällig „mehr Sport zu machen". Wenn du gerne klare Ziele, messbare Fortschritte und ein durchdachtes Konzept hinter deinem Selbstwachstum hast, wirst du dich bei ArcUp wohlfühlen. Ab Vollendung des 16. Lebensjahres nutzbar (14–16 mit Zustimmung der Erziehungsberechtigten).',
      en: 'For anyone who wants to work on themselves in a <strong>structured</strong> way instead of vaguely "doing more sport". If you like clear targets, measurable progress and a thought-through concept behind your self-growth, you’ll feel at home in ArcUp. Available from age 16 (14–16 with consent of legal guardians).',
      es: 'Para quien quiere trabajar en sí mismo de forma <strong>estructurada</strong> en lugar de «hacer más deporte» sin más. Si te gustan los objetivos claros, el progreso medible y un concepto bien pensado detrás de tu crecimiento, te sentirás en casa con ArcUp. Disponible a partir de 16 años (14–16 con consentimiento de los padres).',
      fr: "Pour celles et ceux qui veulent travailler sur eux de manière <strong>structurée</strong> au lieu de « faire plus de sport » au hasard. Si tu aimes les objectifs clairs, les progrès mesurables et un concept réfléchi derrière ta croissance, tu te sentiras à l'aise dans ArcUp. Disponible à partir de 16 ans (14–16 avec accord des tuteurs légaux).",
      it: 'Per chi vuole lavorare su di sé in modo <strong>strutturato</strong> invece di «fare più sport» a caso. Se ti piacciono gli obiettivi chiari, i progressi misurabili e un concetto ragionato dietro la tua crescita, ti troverai bene con ArcUp. Disponibile dai 16 anni (14–16 con consenso dei tutori).',
    },

    'faq06.q': { de: 'Wie unterscheiden sich Habits, ARCs und Goals?', en: 'What is the difference between habits, ARCs and goals?', es: '¿En qué se diferencian hábitos, ARCs y goals?', fr: 'Quelle est la différence entre habitudes, ARC et goals ?', it: 'Qual è la differenza tra abitudini, ARC e goal?' },
    'faq06.a': {
      de: '<ul><li><strong>Habits</strong> sind die atomaren, messbaren Einheiten – z. B. „Laufen in km".</li><li><strong>ARCs</strong> bündeln Habits zu einer zeitlich begrenzten Challenge mit konkreten Zielwerten.</li><li><strong>Goals</strong> sind separate, einmalige Vorhaben mit Fälligkeitsdatum („Bis Ende Mai 5 km am Stück laufen") und gehören in den Compass-Bereich.</li></ul>Goals sind Aufgaben mit Deadline. Habits sind die Messskala, auf der dein Verhalten sichtbar wird.',
      en: '<ul><li><strong>Habits</strong> are the atomic, measurable units — e.g. "running in km".</li><li><strong>ARCs</strong> bundle habits into a time-boxed challenge with concrete targets.</li><li><strong>Goals</strong> are separate, one-off projects with a due date ("Run 5 km in one go by end of May") and live in the Compass area.</li></ul>Goals are tasks with deadlines. Habits are the scale on which your behaviour becomes visible.',
      es: '<ul><li><strong>Habits</strong> son las unidades atómicas medibles — por ejemplo «correr en km».</li><li><strong>ARCs</strong> agrupan hábitos en un reto limitado en el tiempo con objetivos concretos.</li><li><strong>Goals</strong> son proyectos separados, únicos, con fecha límite («Correr 5 km de un tirón antes de fin de mayo») y pertenecen al área Compass.</li></ul>Los goals son tareas con fecha. Los hábitos son la escala en la que se hace visible tu comportamiento.',
      fr: "<ul><li><strong>Habits</strong> sont les unités atomiques, mesurables — par exemple « course en km ».</li><li><strong>ARC</strong> regroupent des habitudes dans un défi limité dans le temps avec des objectifs concrets.</li><li><strong>Goals</strong> sont des projets séparés et ponctuels avec une échéance (« Courir 5 km d'une traite d'ici fin mai ») et appartiennent au Compass.</li></ul>Les goals sont des tâches avec date butoir. Les habitudes sont l'échelle sur laquelle ton comportement devient visible.",
      it: '<ul><li><strong>Habit</strong> sono le unità atomiche misurabili — es. «corsa in km».</li><li><strong>ARC</strong> riuniscono abitudini in una sfida a tempo limitato con obiettivi concreti.</li><li><strong>Goal</strong> sono progetti separati e una tantum con scadenza («Correre 5 km filati entro fine maggio») e vivono nel Compass.</li></ul>I goal sono compiti con scadenza. Le abitudini sono la scala su cui il tuo comportamento diventa visibile.',
    },
    'faq07.q': { de: 'Was sind progressive Ziele?', en: 'What are progressive targets?', es: '¿Qué son los objetivos progresivos?', fr: 'Que sont les objectifs progressifs ?', it: 'Cosa sono i target progressivi?' },
    'faq07.a': {
      de: 'Statt jeden Tag denselben Zielwert anzusetzen (Static), kann ein ARC-Habit <strong>progressiv</strong> angelegt sein. Das Ziel steigt dann linear vom Startwert zum Endwert über die ARC-Dauer – zum Beispiel von 1 km am ersten Tag auf 5 km am letzten. Klassisch für Couch-to-5K-Logik: Wachstum passiert durch Steigerung, nicht durch Wiederholung.',
      en: 'Instead of setting the same target value every day (static), an ARC habit can be <strong>progressive</strong>. The target then grows linearly from the start value to the end value across the ARC duration — for example from 1 km on day one to 5 km on the last day. Classic couch-to-5K logic: growth happens through progression, not repetition.',
      es: 'En lugar de fijar el mismo objetivo cada día (estático), un hábito de ARC puede ser <strong>progresivo</strong>. El objetivo crece linealmente desde el valor inicial hasta el final durante la duración del ARC — por ejemplo de 1 km el primer día a 5 km el último. Clásica lógica couch-to-5K: el crecimiento ocurre por progresión, no por repetición.',
      fr: "Au lieu de fixer la même cible chaque jour (statique), une habitude d'ARC peut être <strong>progressive</strong>. La cible croît alors linéairement de la valeur de départ à la valeur finale sur la durée de l'ARC — par exemple de 1 km le premier jour à 5 km le dernier. Logique classique couch-to-5K : la croissance vient de la progression, pas de la répétition.",
      it: "Invece di fissare ogni giorno lo stesso valore (statico), un'abitudine ARC può essere <strong>progressiva</strong>. L'obiettivo cresce linearmente dal valore iniziale a quello finale per la durata dell'ARC — per esempio da 1 km il primo giorno a 5 km l'ultimo. Classica logica couch-to-5K: la crescita avviene per progressione, non per ripetizione.",
    },
    'faq08.q': { de: 'Was bedeutet „Above" und „Below" bei einem Habit?', en: 'What do "Above" and "Below" mean for a habit?', es: '¿Qué significan «Above» y «Below» en un hábito?', fr: 'Que signifient « Above » et « Below » pour une habitude ?', it: 'Cosa significano «Above» e «Below» per un’abitudine?' },
    'faq08.a': {
      de: '<ul><li><strong>≥ (Above):</strong> Der Zielwert ist eine Untergrenze – du erreichst ihn, wenn dein Wert ihn trifft oder überschreitet. Beispiel: 10.000 Schritte.</li><li><strong>≤ (Below):</strong> Der Zielwert ist eine Obergrenze – du erreichst ihn, wenn dein Wert ihn nicht überschreitet. Beispiel: maximal 2 Stunden Bildschirmzeit.</li></ul>',
      en: '<ul><li><strong>≥ (Above):</strong> the target is a lower bound — you hit it when your value meets or exceeds it. Example: 10,000 steps.</li><li><strong>≤ (Below):</strong> the target is an upper bound — you hit it when your value doesn’t exceed it. Example: max. 2 hours of screen time.</li></ul>',
      es: '<ul><li><strong>≥ (Above):</strong> el objetivo es un límite inferior — lo alcanzas si tu valor lo iguala o supera. Ejemplo: 10.000 pasos.</li><li><strong>≤ (Below):</strong> el objetivo es un límite superior — lo alcanzas si tu valor no lo supera. Ejemplo: máximo 2 horas de pantalla.</li></ul>',
      fr: "<ul><li><strong>≥ (Above) :</strong> la cible est une limite basse — tu l'atteins si ta valeur l'égale ou la dépasse. Exemple : 10 000 pas.</li><li><strong>≤ (Below) :</strong> la cible est une limite haute — tu l'atteins si ta valeur ne la dépasse pas. Exemple : max. 2 h d'écran.</li></ul>",
      it: "<ul><li><strong>≥ (Above):</strong> l'obiettivo è un limite inferiore — lo raggiungi se il tuo valore lo eguaglia o lo supera. Esempio: 10.000 passi.</li><li><strong>≤ (Below):</strong> l'obiettivo è un limite superiore — lo raggiungi se il tuo valore non lo supera. Esempio: max. 2 ore di schermo.</li></ul>",
    },
    'faq09.q': { de: 'Was ist der Unterschied zwischen Daily- und Weekly-Habits?', en: 'What is the difference between daily and weekly habits?', es: '¿Cuál es la diferencia entre hábitos diarios y semanales?', fr: 'Quelle est la différence entre habitudes quotidiennes et hebdomadaires ?', it: "Qual è la differenza tra abitudini giornaliere e settimanali?" },
    'faq09.a': {
      de: 'Daily-Habits werden <strong>pro Tag</strong> geprüft (z. B. 10 min Meditation täglich). Weekly-Habits akkumulieren <strong>über die ganze ARC-Woche</strong> (z. B. 3 Krafttrainings pro Woche). Bei Weekly-Habits zählt jede Eintragung in die Wochensumme; das Ziel ist erreicht, sobald die Summe es trifft.',
      en: 'Daily habits are checked <strong>per day</strong> (e.g. 10 min meditation daily). Weekly habits accumulate <strong>over the whole ARC week</strong> (e.g. 3 strength sessions per week). With weekly habits, every entry adds to the weekly sum; the target is hit as soon as the sum reaches it.',
      es: 'Los hábitos diarios se evalúan <strong>por día</strong> (p. ej. 10 min de meditación al día). Los semanales se acumulan <strong>durante toda la semana del ARC</strong> (p. ej. 3 sesiones de fuerza por semana). En los semanales cada entrada suma al total; el objetivo se cumple cuando la suma lo alcanza.',
      fr: "Les habitudes quotidiennes sont vérifiées <strong>par jour</strong> (par ex. 10 min de méditation par jour). Les hebdomadaires s'accumulent <strong>sur toute la semaine de l'ARC</strong> (par ex. 3 séances de musculation par semaine). Pour les hebdomadaires, chaque saisie compte dans la somme hebdo ; la cible est atteinte dès que la somme l'atteint.",
      it: "Le abitudini giornaliere si verificano <strong>per giorno</strong> (es. 10 min di meditazione al giorno). Le settimanali si accumulano <strong>sull'intera settimana dell'ARC</strong> (es. 3 sessioni di forza a settimana). Nelle settimanali ogni inserimento conta nella somma; l'obiettivo è raggiunto appena la somma lo tocca.",
    },
    'faq10.q': { de: 'Wie viele Habits sollte ein ARC haben?', en: 'How many habits should an ARC have?', es: '¿Cuántos hábitos debería tener un ARC?', fr: "Combien d'habitudes un ARC devrait-il avoir ?", it: 'Quante abitudini dovrebbe avere un ARC?' },
    'faq10.a': {
      de: 'Der Sweet Spot liegt bei <strong>3–6 Habits</strong> pro ARC. Weniger fühlt sich substanzlos an, mehr überfordert. Eine gute Mischung aus täglichen Routine-Habits und wöchentlichen Volumen-Zielen funktioniert in der Praxis am besten.',
      en: 'The sweet spot is <strong>3–6 habits</strong> per ARC. Less feels insubstantial, more overwhelms. A good mix of daily routine habits and weekly volume targets works best in practice.',
      es: 'El punto óptimo está en <strong>3–6 hábitos</strong> por ARC. Menos se siente vacío, más abruma. Una buena mezcla de rutinas diarias y objetivos semanales de volumen funciona mejor en la práctica.',
      fr: "Le sweet spot est de <strong>3–6 habitudes</strong> par ARC. Moins paraît creux, plus submerge. Un bon mélange d'habitudes quotidiennes de routine et d'objectifs de volume hebdomadaires fonctionne le mieux en pratique.",
      it: 'Il punto ottimale è <strong>3–6 abitudini</strong> per ARC. Meno sembra vuoto, di più sopraffà. Un buon mix di abitudini giornaliere di routine e obiettivi settimanali di volume funziona meglio in pratica.',
    },

    // ─── FAQ v2 — 11–20 (Multiple ARCs, Tracking, Streaks, Library) ─
    'faq11.q': { de: 'Kann ich gleichzeitig mehrere ARCs aktiv haben?', en: 'Can I have multiple ARCs active at the same time?', es: '¿Puedo tener varios ARCs activos a la vez?', fr: 'Puis-je avoir plusieurs ARC actifs en même temps ?', it: 'Posso avere più ARC attivi contemporaneamente?' },
    'faq11.a': {
      de: 'Im <strong>Free-Tarif</strong> kannst du <strong>einen ARC</strong> gleichzeitig laufen lassen. Im <strong>Pro-Tarif</strong> sind parallele ARCs möglich. Achtung: Wenn zwei aktive ARCs dasselbe Habit mit unterschiedlicher Zielrichtung (einmal ≥, einmal ≤) verlangen, wird das Starten geblockt – das wäre ein logischer Widerspruch.',
      en: 'On the <strong>Free plan</strong> you can run <strong>one ARC</strong> at a time. On <strong>Pro</strong>, parallel ARCs are possible. Caveat: if two active ARCs require the same habit with opposite directions (once ≥, once ≤), starting is blocked — that would be a logical contradiction.',
      es: 'En el plan <strong>Free</strong> puedes tener <strong>un ARC</strong> activo a la vez. Con <strong>Pro</strong> son posibles varios en paralelo. Atención: si dos ARCs activos requieren el mismo hábito con direcciones opuestas (una ≥, otra ≤), el inicio se bloquea — sería una contradicción lógica.',
      fr: "Avec le plan <strong>Free</strong>, tu peux faire tourner <strong>un seul ARC</strong> à la fois. Avec <strong>Pro</strong>, plusieurs ARC en parallèle sont possibles. Attention : si deux ARC actifs demandent la même habitude avec des directions opposées (une fois ≥, une fois ≤), le démarrage est bloqué — ce serait une contradiction logique.",
      it: 'Nel piano <strong>Free</strong> puoi avere <strong>un ARC</strong> attivo alla volta. Con <strong>Pro</strong> sono possibili più ARC in parallelo. Attenzione: se due ARC attivi richiedono la stessa abitudine con direzioni opposte (una ≥, una ≤), l’avvio viene bloccato — sarebbe una contraddizione logica.',
    },

    'faq12.q': { de: 'Wie tracke ich meine Habits?', en: 'How do I track my habits?', es: '¿Cómo registro mis hábitos?', fr: 'Comment suivre mes habitudes ?', it: 'Come traccio le mie abitudini?' },
    'faq12.a': {
      de: 'Du tippst auf den <strong>+ Track</strong>-Button auf dem Home-Screen und öffnest dein Logbook. Dort trägst du für jedes aktive Habit den Wert des Tages ein – per Stepper oder Slider. Zusätzlich gibt es einen <strong>Timer</strong> (Stoppuhr oder Pomodoro), mit dem du Zeit-basierte Habits live mitlaufen lassen kannst.',
      en: 'Tap the <strong>+ Track</strong> button on the Home screen to open your logbook. Enter today’s value for every active habit — via stepper or slider. There’s also a <strong>timer</strong> (stopwatch or Pomodoro) for time-based habits, which you can run live.',
      es: 'Toca el botón <strong>+ Track</strong> en la pantalla Home para abrir tu logbook. Ahí registras el valor de hoy para cada hábito activo — con stepper o slider. También hay un <strong>timer</strong> (cronómetro o Pomodoro) para hábitos basados en tiempo.',
      fr: "Touche le bouton <strong>+ Track</strong> sur l'écran d'accueil pour ouvrir ton logbook. Tu y saisis la valeur du jour pour chaque habitude active — via stepper ou slider. Il y a aussi un <strong>timer</strong> (chrono ou Pomodoro) pour les habitudes basées sur le temps, à faire tourner en direct.",
      it: 'Tocca il pulsante <strong>+ Track</strong> nella Home per aprire il tuo logbook. Lì inserisci il valore di oggi per ogni abitudine attiva — con stepper o slider. C’è anche un <strong>timer</strong> (cronometro o Pomodoro) per abitudini basate sul tempo, da far girare live.',
    },
    'faq13.q': { de: 'Kann ich auch vergangene Tage nachtragen?', en: 'Can I back-fill past days?', es: '¿Puedo registrar días pasados?', fr: 'Puis-je remplir des jours passés ?', it: 'Posso compilare giorni passati?' },
    'faq13.a': {
      de: 'Nur <strong>heute und gestern</strong> sind beschreibbar. Alles davor ist bewusst schreibgeschützt. Das ist ein Designprinzip: kein Backfilling, keine geschönten Streaks. Jeder Streak, den du baust, ist ehrlich verdient.',
      en: 'Only <strong>today and yesterday</strong> are writable. Everything before that is deliberately read-only. This is a design principle: no back-filling, no fabricated streaks. Every streak you build is honestly earned.',
      es: 'Solo <strong>hoy y ayer</strong> son editables. Todo lo anterior es deliberadamente de solo lectura. Es un principio de diseño: nada de rellenar a posteriori, nada de rachas maquilladas. Cada racha que construyes es honesta.',
      fr: "Seuls <strong>aujourd'hui et hier</strong> sont modifiables. Tout ce qui précède est volontairement en lecture seule. C'est un principe de design : pas de remplissage rétroactif, pas de séries embellies. Chaque série que tu bâtis est honnêtement gagnée.",
      it: 'Solo <strong>oggi e ieri</strong> sono modificabili. Tutto il resto è volutamente in sola lettura. È un principio di design: niente backfilling, niente streak abbellite. Ogni streak che costruisci è onesta.',
    },
    'faq14.q': { de: 'Was bedeutet die Prozentzahl bei jedem Habit?', en: 'What does the percentage on each habit mean?', es: '¿Qué significa el porcentaje en cada hábito?', fr: 'Que signifie le pourcentage sur chaque habitude ?', it: 'Cosa significa la percentuale su ogni abitudine?' },
    'faq14.a': {
      de: 'Das ist deine <strong>proportionale Completion</strong> für diesen Tag. Bei Above-Habits: <code>Wert ÷ Ziel × 100</code>, gekappt bei 100 %. Hast du 7 von 10 Gläsern Wasser getrunken, sind das 70 %. Bei Below-Habits ist die Logik binär – entweder unter dem Limit (100 %) oder darüber (0 %). Die Prozente der Habits werden zur <strong>Daily Completion</strong> gemittelt.',
      en: 'That’s your <strong>proportional completion</strong> for the day. For Above habits: <code>value ÷ target × 100</code>, capped at 100 %. Drink 7 of 10 glasses of water → 70 %. For Below habits the logic is binary — either under the limit (100 %) or over it (0 %). The habit percentages average into your <strong>Daily Completion</strong>.',
      es: 'Es tu <strong>cumplimiento proporcional</strong> del día. Para hábitos Above: <code>valor ÷ objetivo × 100</code>, con tope al 100 %. Si bebiste 7 de 10 vasos de agua → 70 %. En hábitos Below la lógica es binaria — por debajo del límite (100 %) o por encima (0 %). Los porcentajes se promedian en la <strong>Daily Completion</strong>.',
      fr: "C'est ton <strong>achèvement proportionnel</strong> pour la journée. Pour les habitudes Above : <code>valeur ÷ cible × 100</code>, plafonné à 100 %. 7 verres d'eau sur 10 → 70 %. Pour les habitudes Below, la logique est binaire — soit sous la limite (100 %), soit au-dessus (0 %). Les pourcentages sont moyennés dans ta <strong>Daily Completion</strong>.",
      it: 'È il tuo <strong>completamento proporzionale</strong> della giornata. Per Above: <code>valore ÷ obiettivo × 100</code>, fino a 100 %. 7 bicchieri d’acqua su 10 → 70 %. Per Below la logica è binaria — sotto al limite (100 %) o sopra (0 %). Le percentuali si mediano nella <strong>Daily Completion</strong>.',
    },
    'faq15.q': { de: 'Was ist ein „perfekter Tag"?', en: 'What is a "perfect day"?', es: '¿Qué es un «día perfecto»?', fr: 'Qu’est-ce qu’un « jour parfait » ?', it: 'Cos’è un «giorno perfetto»?' },
    'faq15.a': {
      de: 'Ein Tag, an dem <strong>alle</strong> deine täglichen Habit-Ziele auf 100 % gekommen sind – bei wöchentlichen Habits am letzten Tag der Woche zusätzlich die Wochenziele. Perfekte Tage zählen für deinen Streak und sind die Grundlage für viele Achievements.',
      en: 'A day on which <strong>all</strong> your daily habit targets reached 100 % — plus the weekly targets on the last day of the week (for weekly habits). Perfect days count toward your streak and are the basis for many achievements.',
      es: 'Un día en el que <strong>todos</strong> tus objetivos diarios llegaron al 100 % — más los semanales el último día de la semana (para hábitos semanales). Los días perfectos cuentan para tu racha y son base para muchos logros.',
      fr: "Une journée où <strong>tous</strong> tes objectifs d'habitudes quotidiens atteignent 100 % — plus les objectifs hebdo le dernier jour de la semaine (pour les habitudes hebdomadaires). Les journées parfaites comptent pour ta série et sont la base de nombreux succès.",
      it: 'Una giornata in cui <strong>tutti</strong> i tuoi obiettivi giornalieri sono al 100 % — più quelli settimanali l’ultimo giorno della settimana (per le abitudini settimanali). I giorni perfetti contano per lo streak e sono base per molti achievement.',
    },

    'faq16.q': { de: 'Was ist der Streak?', en: 'What is the streak?', es: '¿Qué es la racha?', fr: 'Qu’est-ce que la série ?', it: 'Cos’è lo streak?' },
    'faq16.a': {
      de: 'Dein <strong>Day Streak</strong> zählt aufeinanderfolgende perfekte Tage. Ein Tag ohne Logs zählt als 0 % und bricht den Streak – es sei denn, er ist durch einen Rest Day oder eine geplante Vacation abgedeckt. Es gibt <strong>keine Streak-Shields</strong> – ein gebrochener Streak ist kein Drama, sondern ein Datenpunkt.',
      en: 'Your <strong>day streak</strong> counts consecutive perfect days. A day without logs counts as 0 % and breaks the streak — unless covered by a rest day or planned vacation. There are <strong>no streak shields</strong> — a broken streak is not a drama, it’s a data point.',
      es: 'Tu <strong>day streak</strong> cuenta días perfectos consecutivos. Un día sin logs cuenta como 0 % y rompe la racha — salvo que esté cubierto por un día de descanso o vacaciones planificadas. <strong>No hay escudos de racha</strong> — una racha rota no es un drama, es un dato.',
      fr: "Ton <strong>day streak</strong> compte les journées parfaites consécutives. Une journée sans saisie compte 0 % et casse la série — sauf si couverte par un jour de repos ou des vacances planifiées. <strong>Aucun bouclier de série</strong> — une série cassée n'est pas un drame, c'est une donnée.",
      it: 'Il tuo <strong>day streak</strong> conta i giorni perfetti consecutivi. Un giorno senza log conta 0 % e rompe lo streak — a meno che sia coperto da un giorno di riposo o vacanza pianificata. <strong>Niente streak shield</strong> — uno streak rotto non è un dramma, è un dato.',
    },
    'faq17.q': { de: 'Was sind Rest Days?', en: 'What are rest days?', es: '¿Qué son los días de descanso?', fr: 'Que sont les jours de repos ?', it: 'Cosa sono i giorni di riposo?' },
    'faq17.a': {
      de: 'Rest Days <strong>frieren deinen Streak ein</strong>, ohne ihn zu brechen. Du bekommst pro Woche ein selbst gewähltes Budget (z. B. 1–2 Tage). Du kannst sie manuell setzen oder sie werden automatisch verbraucht, wenn du nach einem Logging-Loch wieder einsteigst. Nicht verbrauchte Rest Days verfallen am Wochenende – sie sind kein Konto, das du ansparst.',
      en: 'Rest days <strong>freeze your streak</strong> without breaking it. You get a self-chosen weekly budget (e.g. 1–2 days). Set them manually, or they’re consumed automatically when you resume after a logging gap. Unused rest days expire at the end of the week — they’re not an account you save up.',
      es: 'Los días de descanso <strong>congelan tu racha</strong> sin romperla. Tienes un presupuesto semanal a tu elección (p. ej. 1–2 días). Los configuras manualmente o se consumen automáticamente al volver tras un hueco. Los no usados caducan al final de la semana — no son una cuenta que acumulas.',
      fr: "Les jours de repos <strong>gèlent ta série</strong> sans la casser. Tu disposes d'un budget hebdomadaire que tu choisis (par ex. 1–2 jours). Tu les actives manuellement ou ils sont consommés automatiquement lorsque tu reprends après un trou. Les jours non utilisés expirent en fin de semaine — ce n'est pas un compte que tu accumules.",
      it: 'I giorni di riposo <strong>congelano lo streak</strong> senza romperlo. Hai un budget settimanale che scegli tu (es. 1–2 giorni). Li attivi manualmente o vengono consumati in automatico quando riprendi dopo un buco. Quelli non usati scadono a fine settimana — non sono un conto che accumuli.',
    },
    'faq18.q': { de: 'Was ist der Vacation Mode?', en: 'What is Vacation Mode?', es: '¿Qué es el modo Vacaciones?', fr: 'Qu’est-ce que le mode Vacances ?', it: 'Cos’è la Vacation Mode?' },
    'faq18.a': {
      de: 'Für längere Auszeiten (Urlaub, Geschäftsreise) planst du im <strong>Vacation Mode</strong> Zeiträume von mehreren Tagen. Jeder Tag im Vacation-Fenster wirkt wie ein Rest Day, ohne dein wöchentliches Rest-Day-Budget anzutasten. Vorlauf, Mindest- und Maximaldauer pro Vacation sind in der App definiert.',
      en: 'For longer breaks (holiday, business trip) you schedule multi-day windows in <strong>Vacation Mode</strong>. Each day in the vacation window acts like a rest day without touching your weekly rest-day budget. Lead time, min and max duration per vacation are defined in the app.',
      es: 'Para pausas más largas (vacaciones, viajes de trabajo) planificas ventanas de varios días en el <strong>modo Vacaciones</strong>. Cada día dentro actúa como un día de descanso sin tocar tu presupuesto semanal. La antelación, duración mínima y máxima por vacaciones están definidas en la app.',
      fr: "Pour des pauses plus longues (vacances, voyage d'affaires), tu planifies en <strong>mode Vacances</strong> des fenêtres de plusieurs jours. Chaque jour dans la fenêtre agit comme un jour de repos sans toucher à ton budget hebdo. Le délai, la durée min. et max. par vacances sont définis dans l'app.",
      it: 'Per pause più lunghe (vacanze, viaggi di lavoro) pianifichi finestre di più giorni nella <strong>Vacation Mode</strong>. Ogni giorno nella finestra agisce come un giorno di riposo senza toccare il budget settimanale. Anticipo, durata minima e massima per vacanza sono definiti nell’app.',
    },

    'faq19.q': { de: 'Was sind ARC-Sources / die Lern-Mediathek?', en: 'What are ARC-Sources / the Learning Library?', es: '¿Qué son las ARC-Sources / la biblioteca de aprendizaje?', fr: 'Qu’est-ce que les ARC-Sources / la bibliothèque ?', it: 'Cosa sono le ARC-Sources / la biblioteca?' },
    'faq19.a': {
      de: 'Jeder ARC und jedes Habit baut auf einer <strong>Wissensgrundlage</strong> auf – Büchern, Artikeln, Vorträgen oder eigens für ArcUp redaktionell aufbereiteten Beiträgen („ArcUp Originals"). In der Library kannst du diese Quellen direkt in der App lesen, durchsuchen, filtern und als Favoriten speichern. Du siehst zu jeder Quelle, welche ARCs und Habits darauf aufbauen.',
      en: 'Every ARC and every habit is built on a <strong>knowledge foundation</strong> — books, articles, talks or pieces produced editorially for ArcUp ("ArcUp Originals"). In the library you can read these sources directly in the app, search, filter and save them as favourites. For every source you see which ARCs and habits build on it.',
      es: 'Cada ARC y cada hábito se apoya en una <strong>base de conocimiento</strong> — libros, artículos, charlas o piezas redactadas editorialmente para ArcUp («ArcUp Originals»). En la biblioteca puedes leer estas fuentes directamente en la app, buscar, filtrar y guardar como favoritas. Para cada fuente ves qué ARCs y hábitos se apoyan en ella.',
      fr: "Chaque ARC et chaque habitude s'appuie sur une <strong>base de connaissance</strong> — livres, articles, conférences ou contenus rédigés éditorialement pour ArcUp (« ArcUp Originals »). Dans la bibliothèque tu lis ces sources directement dans l'app, tu cherches, filtres et enregistres en favoris. Pour chaque source tu vois quels ARC et habitudes s'y appuient.",
      it: 'Ogni ARC e ogni abitudine si basa su una <strong>fondamenta di conoscenza</strong> — libri, articoli, talk o contenuti redatti editorialmente per ArcUp («ArcUp Originals»). Nella biblioteca puoi leggere queste fonti direttamente nell’app, cercare, filtrare e salvarle nei preferiti. Per ogni fonte vedi quali ARC e abitudini si appoggiano su di essa.',
    },
    'faq20.q': { de: 'Was sind ArcUp Originals?', en: 'What are ArcUp Originals?', es: '¿Qué son los ArcUp Originals?', fr: 'Que sont les ArcUp Originals ?', it: 'Cosa sono gli ArcUp Originals?' },
    'faq20.a': {
      de: 'ArcUp Originals sind <strong>redaktionelle Eigenproduktionen</strong> zu etablierten, nicht urheberrechtlich geschützten Konzepten – zum Beispiel Zone-2-Cardio, Schlafhygiene oder Box-Breathing. Sie sind 4–8 Minuten Lesezeit lang, durchgehend in eigenen Worten verfasst und mit KI-Unterstützung erstellt sowie redaktionell freigegeben. Auf jedem Original ist diese KI-Unterstützung sichtbar gekennzeichnet.',
      en: 'ArcUp Originals are <strong>our own editorial productions</strong> on established, non-copyrighted concepts — e.g. Zone-2 cardio, sleep hygiene or box breathing. They’re 4–8 minutes long, written entirely in our own words, created with AI support and editorially released. The AI assistance is visibly labelled on every Original.',
      es: 'Los ArcUp Originals son <strong>producciones editoriales propias</strong> sobre conceptos establecidos y no protegidos por derechos de autor — p. ej. cardio Zona 2, higiene del sueño o box-breathing. De 4–8 minutos de lectura, escritos íntegramente con palabras propias, creados con apoyo de IA y aprobados editorialmente. La asistencia de IA está marcada visiblemente en cada Original.',
      fr: "Les ArcUp Originals sont nos <strong>productions éditoriales propres</strong> sur des concepts établis et non protégés par le droit d'auteur — par ex. cardio Zone 2, hygiène du sommeil ou box breathing. 4–8 minutes de lecture, intégralement en mots propres, créés avec assistance IA et validés éditorialement. L'assistance IA est marquée visiblement sur chaque Original.",
      it: 'Gli ArcUp Originals sono <strong>produzioni editoriali nostre</strong> su concetti consolidati e non protetti da copyright — es. cardio Zona 2, igiene del sonno o box breathing. 4–8 minuti di lettura, scritti interamente con parole nostre, creati con supporto IA e approvati editorialmente. Il supporto IA è marcato visibilmente su ogni Original.',
    },
    'faq21.q': { de: 'Was sind die Affiliate-Links in der Library?', en: 'What are the affiliate links in the library?', es: '¿Qué son los enlaces de afiliado en la biblioteca?', fr: 'Que sont les liens affiliés dans la bibliothèque ?', it: 'Cosa sono i link affiliati nella biblioteca?' },
    'faq21.a': {
      de: 'Bei einigen Quellen findest du im Abschnitt „Quellen mit ähnlichen Inhalten" Empfehlungs-Links zu Büchern bei Amazon. Diese sind mit einem <strong>Sternchen (*)</strong> gekennzeichnet und transparent als Werbung ausgewiesen: <em>„Als Amazon-Partner verdient ArcUp an qualifizierten Käufen."</em> Du zahlst dadurch keinen Cent mehr. Affiliate-Vergütungen beeinflussen unsere Empfehlungen nicht.',
      en: 'On some sources you’ll find recommendation links to books on Amazon in the section "Sources with similar content". They are marked with an <strong>asterisk (*)</strong> and transparently labelled as advertising: <em>"As an Amazon Associate, ArcUp earns from qualifying purchases."</em> You don’t pay a cent more. Affiliate compensation does not influence our recommendations.',
      es: 'En algunas fuentes encuentras enlaces de recomendación a libros en Amazon, en la sección «Fuentes con contenido similar». Están marcados con un <strong>asterisco (*)</strong> y señalados de forma transparente como publicidad: <em>«Como afiliado de Amazon, ArcUp obtiene ingresos por compras cualificadas.»</em> No pagas ni un céntimo más. La comisión no influye en nuestras recomendaciones.',
      fr: "Sur certaines sources tu trouves des liens de recommandation vers des livres sur Amazon, dans la section « Sources au contenu similaire ». Ils sont marqués d'un <strong>astérisque (*)</strong> et signalés de manière transparente comme publicité : <em>« En tant que partenaire Amazon, ArcUp est rémunéré pour les achats remplissant les conditions requises. »</em> Tu ne paies pas un centime de plus. La rémunération n'influence pas nos recommandations.",
      it: 'Su alcune fonti trovi link di consiglio a libri su Amazon, nella sezione «Fonti con contenuti simili». Sono marcati con un <strong>asterisco (*)</strong> e segnalati in modo trasparente come pubblicità: <em>«In qualità di affiliato Amazon, ArcUp riceve un guadagno dagli acquisti idonei.»</em> Non paghi un centesimo in più. La commissione non influenza i nostri consigli.',
    },

    'faq22.q': { de: 'Was ist im kostenlosen Tarif enthalten?', en: 'What’s included in the free plan?', es: '¿Qué incluye el plan gratuito?', fr: 'Qu’est-ce que le plan gratuit comprend ?', it: 'Cosa include il piano gratuito?' },
    'faq22.a': {
      de: 'Der <strong>Free-Tarif</strong> umfasst:<ul><li>Tracking aller Habits aus der kuratierten Bibliothek</li><li>Ein aktiver ARC gleichzeitig</li><li>Compass mit Wheel of Life und Vision-Texten</li><li>Zugriff auf die Lern-Mediathek</li><li>Selbst-Assessments (Rating-Updates für Life Areas)</li></ul>',
      en: 'The <strong>Free plan</strong> includes:<ul><li>Tracking of all habits from the curated library</li><li>One active ARC at a time</li><li>Compass with Wheel of Life and vision texts</li><li>Access to the Learning Library</li><li>Self-assessments (rating updates per life area)</li></ul>',
      es: 'El plan <strong>Free</strong> incluye:<ul><li>Tracking de todos los hábitos de la biblioteca curada</li><li>Un ARC activo a la vez</li><li>Compass con Wheel of Life y textos de visión</li><li>Acceso a la biblioteca de aprendizaje</li><li>Autoevaluaciones (actualizar puntuación por área)</li></ul>',
      fr: "Le plan <strong>Free</strong> comprend :<ul><li>Le suivi de toutes les habitudes de la bibliothèque sélectionnée</li><li>Un ARC actif à la fois</li><li>Le Compass avec Wheel of Life et textes de vision</li><li>L'accès à la bibliothèque d'apprentissage</li><li>Les auto-évaluations (mise à jour des notes par life area)</li></ul>",
      it: 'Il piano <strong>Free</strong> include:<ul><li>Tracciamento di tutte le abitudini della biblioteca curata</li><li>Un ARC attivo alla volta</li><li>Compass con Wheel of Life e testi di visione</li><li>Accesso alla biblioteca di apprendimento</li><li>Autovalutazioni (aggiornamento punteggi per life area)</li></ul>',
    },
    'faq23.q': { de: 'Was bekomme ich zusätzlich mit Pro?', en: 'What do I additionally get with Pro?', es: '¿Qué obtengo además con Pro?', fr: 'Que m’apporte Pro en plus ?', it: 'Cosa ottengo in più con Pro?' },
    'faq23.a': {
      de: 'Mit <strong>Pro</strong> schaltest du frei:<ul><li>Mehrere ARCs parallel</li><li>Selbst erstellte ARCs (Wizard) und Habits</li><li><strong>AI ARC Generator</strong> – aus einem Satz baut die KI einen kompletten ARC für dich</li><li>Goal-Tracking und Journaling</li><li>Insights mit Heatmaps, Trends, Korrelationen und 90-Tage-Profilen</li><li>Premium-Content in der Library</li><li>Teilen von ARC-Ergebnissen als Bildkachel</li></ul>',
      en: 'With <strong>Pro</strong> you unlock:<ul><li>Multiple parallel ARCs</li><li>Self-made ARCs (wizard) and habits</li><li><strong>AI ARC generator</strong> — from one sentence the AI builds a complete ARC for you</li><li>Goal tracking and journaling</li><li>Insights with heatmaps, trends, correlations and 90-day profiles</li><li>Premium content in the library</li><li>Sharing ARC results as image tiles</li></ul>',
      es: 'Con <strong>Pro</strong> desbloqueas:<ul><li>Varios ARCs en paralelo</li><li>ARCs y hábitos propios (asistente)</li><li><strong>AI ARC Generator</strong> — desde una frase la IA construye un ARC completo</li><li>Goal-tracking y journaling</li><li>Insights con heatmaps, tendencias, correlaciones y perfiles de 90 días</li><li>Contenido premium en la biblioteca</li><li>Compartir resultados de ARC como imagen</li></ul>',
      fr: "Avec <strong>Pro</strong> tu débloques :<ul><li>Plusieurs ARC en parallèle</li><li>ARC et habitudes personnalisés (assistant)</li><li><strong>AI ARC Generator</strong> — à partir d'une phrase, l'IA construit un ARC complet pour toi</li><li>Suivi d'objectifs et journaling</li><li>Insights avec heatmaps, tendances, corrélations et profils 90 jours</li><li>Contenus premium dans la bibliothèque</li><li>Partage des résultats d'ARC sous forme d'image</li></ul>",
      it: 'Con <strong>Pro</strong> sblocchi:<ul><li>Più ARC in parallelo</li><li>ARC e abitudini personali (wizard)</li><li><strong>AI ARC Generator</strong> — da una frase l’IA costruisce un ARC completo</li><li>Goal tracking e journaling</li><li>Insights con heatmap, trend, correlazioni e profili 90 giorni</li><li>Contenuti premium nella biblioteca</li><li>Condivisione dei risultati ARC come immagine</li></ul>',
    },
    'faq24.q': { de: 'Was kostet Pro?', en: 'How much does Pro cost?', es: '¿Cuánto cuesta Pro?', fr: 'Combien coûte Pro ?', it: 'Quanto costa Pro?' },
    'faq24.a': {
      de: 'Stand bei Vertragserstellung der AGB:<ul><li><strong>Pro Monat</strong> – € 6,99 (monatliche automatische Verlängerung)</li><li><strong>Pro Jahr</strong> – € 49,99 (jährliche Verlängerung, bester Preis)</li><li><strong>Pro Lifetime</strong> – € 149,99 einmalig, unbegrenzt</li></ul>Die jeweils aktuellen Preise findest du in der App im Bildschirm „Subscription".',
      en: 'As of the date the terms were drafted:<ul><li><strong>Pro Monthly</strong> — € 6.99 (auto-renews monthly)</li><li><strong>Pro Yearly</strong> — € 49.99 (annual renewal, best price)</li><li><strong>Pro Lifetime</strong> — € 149.99 one-time, unlimited</li></ul>The current prices are shown in the app on the "Subscription" screen.',
      es: 'A fecha de redacción de los términos:<ul><li><strong>Pro Mensual</strong> — € 6,99 (renovación mensual automática)</li><li><strong>Pro Anual</strong> — € 49,99 (renovación anual, mejor precio)</li><li><strong>Pro Lifetime</strong> — € 149,99 pago único, ilimitado</li></ul>Los precios actuales aparecen en la app, pantalla «Subscription».',
      fr: "À la date de rédaction des CGU :<ul><li><strong>Pro Mensuel</strong> — € 6,99 (renouvellement mensuel automatique)</li><li><strong>Pro Annuel</strong> — € 49,99 (renouvellement annuel, meilleur prix)</li><li><strong>Pro Lifetime</strong> — € 149,99 paiement unique, illimité</li></ul>Les prix actuels sont visibles dans l'app, écran « Subscription ».",
      it: 'Alla data di stesura delle Condizioni:<ul><li><strong>Pro Mensile</strong> — € 6,99 (rinnovo mensile automatico)</li><li><strong>Pro Annuale</strong> — € 49,99 (rinnovo annuale, miglior prezzo)</li><li><strong>Pro Lifetime</strong> — € 149,99 una tantum, illimitato</li></ul>I prezzi correnti sono nell’app, schermata «Subscription».',
    },
    'faq25.q': { de: 'Kann ich mein Pro-Abo jederzeit kündigen?', en: 'Can I cancel my Pro subscription at any time?', es: '¿Puedo cancelar Pro en cualquier momento?', fr: 'Puis-je résilier Pro à tout moment ?', it: 'Posso cancellare Pro in qualsiasi momento?' },
    'faq25.a': {
      de: 'Ja. Monats- und Jahresabos kündigst du im Stripe Customer Portal (über die App erreichbar) oder in den Abo-Einstellungen deines App Stores – spätestens 24 Stunden vor Ende der laufenden Periode. Du behältst Pro-Zugang bis zum Ende der bereits bezahlten Periode. Lifetime ist eine Einmalzahlung ohne Verlängerung.',
      en: 'Yes. Cancel monthly and yearly subscriptions in the Stripe Customer Portal (accessible from the app) or in your app store’s subscription settings — at the latest 24 hours before the end of the current period. You keep Pro access until the end of the already paid period. Lifetime is a one-time payment with no renewal.',
      es: 'Sí. Las suscripciones mensuales y anuales se cancelan en el Stripe Customer Portal (accesible desde la app) o en los ajustes de tu App Store — como máximo 24 horas antes del fin del período actual. Conservas el acceso Pro hasta el final del período ya pagado. Lifetime es un pago único sin renovación.',
      fr: "Oui. Tu résilies les abonnements mensuels et annuels dans le Stripe Customer Portal (accessible depuis l'app) ou dans les paramètres d'abonnement de ton App Store — au plus tard 24 h avant la fin de la période en cours. Tu conserves l'accès Pro jusqu'à la fin de la période déjà payée. Lifetime est un paiement unique sans renouvellement.",
      it: 'Sì. Cancelli gli abbonamenti mensili e annuali nello Stripe Customer Portal (accessibile dall’app) o nelle impostazioni dello store — al più tardi 24 ore prima della fine del periodo in corso. Mantieni l’accesso Pro fino al termine del periodo già pagato. Lifetime è un pagamento una tantum senza rinnovo.',
    },

    // ─── FAQ v2 — 26–40 (Withdrawal, AI, Insights, Settings, Privacy, Tech) ─
    'faq26.q': { de: 'Habe ich ein Widerrufsrecht?', en: 'Do I have a right of withdrawal?', es: '¿Tengo derecho de desistimiento?', fr: 'Ai-je un droit de rétractation ?', it: 'Ho diritto di recesso?' },
    'faq26.a': {
      de: 'Verbraucher haben 14 Tage Widerrufsrecht ab Vertragsabschluss. <strong>Aber:</strong> Wenn du der sofortigen Bereitstellung von Pro vor Ablauf der Frist ausdrücklich zustimmst (das geschieht im Checkout), erlischt dein Widerrufsrecht mit vollständiger Vertragserfüllung. Details in unseren AGB.',
      en: 'Consumers have a 14-day right of withdrawal from contract conclusion. <strong>However:</strong> if you expressly consent to immediate provision of Pro before the deadline expires (this happens at checkout), your right of withdrawal lapses upon full performance of the contract. Details in our terms.',
      es: 'Los consumidores tienen 14 días de derecho de desistimiento desde la celebración del contrato. <strong>Pero:</strong> si aceptas expresamente la activación inmediata de Pro antes del fin del plazo (ocurre en el checkout), tu derecho de desistimiento se extingue con la ejecución completa del contrato. Detalles en nuestros términos.',
      fr: "Les consommateurs disposent d'un droit de rétractation de 14 jours à compter de la conclusion du contrat. <strong>Mais :</strong> si tu acceptes expressément la mise à disposition immédiate de Pro avant l'expiration du délai (cela se fait au checkout), ton droit de rétractation s'éteint avec l'exécution complète du contrat. Détails dans nos CGU.",
      it: 'I consumatori hanno 14 giorni di diritto di recesso dalla conclusione del contratto. <strong>Tuttavia:</strong> se acconsenti espressamente all’attivazione immediata di Pro prima della scadenza del termine (avviene al checkout), il diritto di recesso si estingue con la completa esecuzione del contratto. Dettagli nelle nostre Condizioni.',
    },

    'faq27.q': { de: 'Wie funktioniert der AI ARC Generator?', en: 'How does the AI ARC Generator work?', es: '¿Cómo funciona el AI ARC Generator?', fr: 'Comment fonctionne le AI ARC Generator ?', it: 'Come funziona l’AI ARC Generator?' },
    'faq27.a': {
      de: 'Im Pro-Tarif beschreibst du dein Ziel in einem Satz – zum Beispiel <em>„Ich will über 6 Wochen eine Morgenroutine etablieren und besser schlafen."</em> Die KI (Claude von Anthropic) baut daraus einen vollständigen ARC-Entwurf inklusive passender Habits, Zielwerte, Theorie und Tipps. Du kannst alles vor dem Speichern frei bearbeiten. Nur dein Prompt wird übertragen – <strong>keine</strong> persönlichen App-Daten.',
      en: 'On Pro you describe your goal in one sentence — e.g. <em>"I want to build a morning routine and sleep better over 6 weeks."</em> The AI (Claude by Anthropic) creates a complete ARC draft for you, including matching habits, targets, theory and tips. You can edit everything freely before saving. Only your prompt is transmitted — <strong>no</strong> personal app data.',
      es: 'En Pro describes tu objetivo en una frase — p. ej. <em>«Quiero construir una rutina matutina y dormir mejor en 6 semanas.»</em> La IA (Claude de Anthropic) crea un borrador completo de ARC con hábitos, objetivos, teoría y consejos. Puedes editarlo todo antes de guardar. Solo se transmite tu prompt — <strong>ningún</strong> dato personal de la app.',
      fr: "Sur Pro tu décris ton objectif en une phrase — par ex. <em>« Je veux construire une routine matinale et mieux dormir sur 6 semaines. »</em> L'IA (Claude d'Anthropic) crée un brouillon d'ARC complet avec habitudes, cibles, théorie et conseils. Tu peux tout modifier avant d'enregistrer. Seul ton prompt est transmis — <strong>aucune</strong> donnée personnelle de l'app.",
      it: 'Su Pro descrivi il tuo obiettivo in una frase — es. <em>«Voglio costruire una routine mattutina e dormire meglio in 6 settimane.»</em> L’IA (Claude di Anthropic) crea una bozza completa di ARC con abitudini, target, teoria e consigli. Puoi modificare tutto prima di salvare. Viene trasmesso solo il tuo prompt — <strong>nessun</strong> dato personale dall’app.',
    },

    'faq28.q': { de: 'Welche Insights bekomme ich?', en: 'What insights do I get?', es: '¿Qué insights obtengo?', fr: 'Quels insights ai-je ?', it: 'Quali insights ottengo?' },
    'faq28.a': {
      de: 'Mit Pro siehst du drei Bereiche:<ul><li><strong>Habits-Tab</strong> – Completion-Heatmap, Werteverlauf, Streaks und Sub-Habit-Rollups pro Habit</li><li><strong>ARCs-Tab</strong> – Erfolgsrate, durchschnittliche Completion, Life-Area-Verteilung über alle ARCs</li><li><strong>Overall-Tab</strong> – dein 90-Tage-Profil mit perfekten Tagen, aktiver Zeit, Life Balance und Top-Habits</li></ul>Alle Zahlen entstehen aus deinen echten Logs – keine geschönten Statistiken.',
      en: 'With Pro you see three areas:<ul><li><strong>Habits tab</strong> — completion heatmap, value history, streaks and sub-habit roll-ups per habit</li><li><strong>ARCs tab</strong> — success rate, average completion, life-area distribution across all ARCs</li><li><strong>Overall tab</strong> — your 90-day profile with perfect days, active time, life balance and top habits</li></ul>All numbers come from your real logs — no embellished stats.',
      es: 'Con Pro ves tres áreas:<ul><li><strong>Pestaña Habits</strong> — heatmap de cumplimiento, evolución, rachas y rollups de subhábitos por hábito</li><li><strong>Pestaña ARCs</strong> — tasa de éxito, cumplimiento medio, distribución por life area</li><li><strong>Pestaña Overall</strong> — tu perfil de 90 días con días perfectos, tiempo activo, life balance y top hábitos</li></ul>Todos los números vienen de tus logs reales — sin estadísticas maquilladas.',
      fr: "Avec Pro tu vois trois zones :<ul><li><strong>Onglet Habits</strong> — heatmap de complétion, historique, séries et rollups de sous-habitudes par habitude</li><li><strong>Onglet ARCs</strong> — taux de succès, complétion moyenne, répartition par life area</li><li><strong>Onglet Overall</strong> — ton profil 90 jours avec jours parfaits, temps actif, life balance et top habitudes</li></ul>Tous les chiffres viennent de tes logs réels — pas de stats embellies.",
      it: 'Con Pro vedi tre aree:<ul><li><strong>Tab Habits</strong> — heatmap di completamento, andamento, streak e rollup di sotto-abitudini per ogni abitudine</li><li><strong>Tab ARCs</strong> — tasso di successo, completamento medio, distribuzione per life area</li><li><strong>Tab Overall</strong> — il tuo profilo 90 giorni con giorni perfetti, tempo attivo, life balance e top abitudini</li></ul>Tutti i numeri vengono dai tuoi log reali — niente statistiche abbellite.',
    },
    'faq29.q': { de: 'Was ist das Goal- und Journal-System?', en: 'What is the goal and journal system?', es: '¿Qué es el sistema de goals y journal?', fr: 'Qu’est-ce que le système goals et journal ?', it: 'Cos’è il sistema goal e journal?' },
    'faq29.a': {
      de: 'Im Compass schreibst du pro Life Area eine <strong>Vision</strong> (langfristig), legst <strong>Goals</strong> mit Fälligkeit an (Weekly / Monthly / Yearly) und kannst <strong>Journal-Einträge</strong> in vier Typen führen (Thought, Learning, Gratitude, Wins &amp; Losses). Beide Funktionen sind Pro-Features; nach Pro-Auslauf bleiben bestehende Einträge sichtbar, nur das Erstellen neuer Einträge erfordert wieder Pro.',
      en: 'In the Compass you write a <strong>vision</strong> per life area (long-term), set <strong>goals</strong> with a due date (weekly / monthly / yearly) and keep <strong>journal entries</strong> in four types (Thought, Learning, Gratitude, Wins &amp; Losses). Both are Pro features; after Pro expires existing entries remain visible — only creating new ones requires Pro again.',
      es: 'En el Compass escribes una <strong>visión</strong> por life area (largo plazo), defines <strong>goals</strong> con fecha (semanal / mensual / anual) y llevas <strong>entradas de journal</strong> en cuatro tipos (Pensamiento, Aprendizaje, Gratitud, Logros y Pérdidas). Ambas son funciones Pro; al caducar Pro las entradas existentes siguen visibles — solo crear nuevas requiere Pro de nuevo.',
      fr: "Dans le Compass tu écris une <strong>vision</strong> par life area (long terme), tu fixes des <strong>goals</strong> avec échéance (hebdo / mensuel / annuel) et tu tiens des <strong>entrées de journal</strong> en quatre types (Pensée, Apprentissage, Gratitude, Victoires &amp; Pertes). Les deux sont des fonctions Pro ; après expiration de Pro, les entrées existantes restent visibles — seule la création de nouvelles exige à nouveau Pro.",
      it: 'Nel Compass scrivi una <strong>vision</strong> per life area (a lungo termine), imposti <strong>goal</strong> con scadenza (settimanale / mensile / annuale) e tieni <strong>voci di journal</strong> in quattro tipi (Pensiero, Apprendimento, Gratitudine, Vittorie &amp; Sconfitte). Entrambe sono funzioni Pro; alla scadenza di Pro le voci esistenti restano visibili — solo la creazione di nuove richiede di nuovo Pro.',
    },

    'faq30.q': { de: 'Welche App-Designs gibt es?', en: 'What app designs are available?', es: '¿Qué diseños de app hay?', fr: 'Quels designs d’app sont disponibles ?', it: 'Quali design dell’app ci sono?' },
    'faq30.a': {
      de: 'Vier Themes stehen zur Wahl: <strong>Dark Green</strong> (fokussiert, hoher Kontrast), <strong>Dark Blue</strong> (kühl, ruhig), <strong>Light Rose</strong> (warm, weich) und <strong>Light Sand</strong> (cremig, hell). Wechseln ist jederzeit möglich.',
      en: 'Four themes are available: <strong>Dark Green</strong> (focused, high contrast), <strong>Dark Blue</strong> (cool, calm), <strong>Light Rose</strong> (warm, soft) and <strong>Light Sand</strong> (creamy, bright). You can switch at any time.',
      es: 'Cuatro temas disponibles: <strong>Dark Green</strong> (focalizado, alto contraste), <strong>Dark Blue</strong> (frío, tranquilo), <strong>Light Rose</strong> (cálido, suave) y <strong>Light Sand</strong> (cremoso, claro). Puedes cambiar cuando quieras.',
      fr: "Quatre thèmes au choix : <strong>Dark Green</strong> (focus, fort contraste), <strong>Dark Blue</strong> (frais, calme), <strong>Light Rose</strong> (chaud, doux) et <strong>Light Sand</strong> (crémeux, lumineux). Tu peux changer à tout moment.",
      it: 'Quattro temi disponibili: <strong>Dark Green</strong> (focalizzato, alto contrasto), <strong>Dark Blue</strong> (freddo, calmo), <strong>Light Rose</strong> (caldo, morbido) e <strong>Light Sand</strong> (cremoso, chiaro). Puoi cambiare in qualsiasi momento.',
    },
    'faq31.q': { de: 'Funktioniert ArcUp mit imperialen Einheiten?', en: 'Does ArcUp work with imperial units?', es: '¿ArcUp funciona con unidades imperiales?', fr: 'ArcUp fonctionne-t-il avec les unités impériales ?', it: 'ArcUp funziona con le unità imperiali?' },
    'faq31.a': {
      de: 'Ja. Du wählst bei der Registrierung zwischen <strong>Metric</strong> (km, kg, l, °C) und <strong>Imperial</strong> (mi, lb, fl oz, °F). Intern werden alle Werte in metrischen Einheiten gespeichert und nur bei der Anzeige umgerechnet – ein späterer Wechsel ist daher sicher und ändert nichts an deinen historischen Daten.',
      en: 'Yes. At sign-up you choose between <strong>Metric</strong> (km, kg, l, °C) and <strong>Imperial</strong> (mi, lb, fl oz, °F). Internally all values are stored in metric and only converted on display — switching later is safe and doesn’t change your historical data.',
      es: 'Sí. En el registro eliges entre <strong>Métrico</strong> (km, kg, l, °C) e <strong>Imperial</strong> (mi, lb, fl oz, °F). Internamente todo se guarda en métrico y solo se convierte al mostrar — cambiar después es seguro y no altera tus datos históricos.',
      fr: "Oui. À l'inscription tu choisis entre <strong>Métrique</strong> (km, kg, l, °C) et <strong>Impérial</strong> (mi, lb, fl oz, °F). En interne, toutes les valeurs sont stockées en métrique et converties à l'affichage — changer plus tard est sûr et ne modifie pas tes données historiques.",
      it: 'Sì. In fase di registrazione scegli tra <strong>Metrico</strong> (km, kg, l, °C) e <strong>Imperiale</strong> (mi, lb, fl oz, °F). Internamente tutto è salvato in metrico e convertito solo alla visualizzazione — cambiare in seguito è sicuro e non altera i tuoi dati storici.',
    },
    'faq32.q': { de: 'In welchen Sprachen ist ArcUp verfügbar?', en: 'Which languages is ArcUp available in?', es: '¿En qué idiomas está disponible ArcUp?', fr: 'Dans quelles langues ArcUp est-il disponible ?', it: 'In quali lingue è disponibile ArcUp?' },
    'faq32.a': {
      de: 'Aktuell in fünf Sprachen: <strong>Englisch, Deutsch, Spanisch, Französisch, Italienisch</strong>. Die Sprache lässt sich im Profil jederzeit ändern.',
      en: 'Currently in five languages: <strong>English, German, Spanish, French, Italian</strong>. The language can be changed in your profile at any time.',
      es: 'Actualmente en cinco idiomas: <strong>inglés, alemán, español, francés, italiano</strong>. El idioma se puede cambiar en el perfil en cualquier momento.',
      fr: "Actuellement en cinq langues : <strong>anglais, allemand, espagnol, français, italien</strong>. La langue peut être changée dans le profil à tout moment.",
      it: 'Attualmente in cinque lingue: <strong>inglese, tedesco, spagnolo, francese, italiano</strong>. La lingua si può cambiare nel profilo in qualsiasi momento.',
    },
    'faq33.q': { de: 'Wie funktionieren die Push-Erinnerungen?', en: 'How do push reminders work?', es: '¿Cómo funcionan los recordatorios push?', fr: 'Comment fonctionnent les rappels push ?', it: 'Come funzionano i promemoria push?' },
    'faq33.a': {
      de: 'Du kannst bis zu drei tägliche Erinnerungen einstellen (Morgens, Mittags, Abends). Eine Erinnerung wird <strong>nur dann</strong> ausgelöst, wenn mindestens eines deiner aktiven Habits diesem Zeitslot zugeordnet ist – sonst bleibt sie still. Benachrichtigungen feuern in deiner Geräte-Zeitzone.',
      en: 'You can set up to three daily reminders (morning, midday, evening). A reminder is fired <strong>only</strong> if at least one of your active habits is assigned to that time slot — otherwise it stays silent. Notifications fire in your device’s time zone.',
      es: 'Puedes configurar hasta tres recordatorios diarios (mañana, mediodía, noche). Un recordatorio se dispara <strong>solo</strong> si al menos uno de tus hábitos activos está asignado a ese tramo — si no, permanece en silencio. Las notificaciones se disparan en la zona horaria de tu dispositivo.',
      fr: "Tu peux configurer jusqu'à trois rappels quotidiens (matin, midi, soir). Un rappel n'est déclenché <strong>que si</strong> au moins une de tes habitudes actives est rattachée à ce créneau — sinon il reste silencieux. Les notifications partent dans le fuseau horaire de ton appareil.",
      it: 'Puoi impostare fino a tre promemoria giornalieri (mattina, mezzogiorno, sera). Un promemoria scatta <strong>solo</strong> se almeno una delle tue abitudini attive è assegnata a quella fascia — altrimenti resta in silenzio. Le notifiche partono nel fuso orario del tuo dispositivo.',
    },

    'faq34.q': { de: 'Was passiert mit meinen Daten?', en: 'What happens to my data?', es: '¿Qué pasa con mis datos?', fr: 'Que deviennent mes données ?', it: 'Cosa succede ai miei dati?' },
    'faq34.a': {
      de: 'Deine Daten liegen in einer von uns betriebenen Supabase-Postgres-Datenbank (Region EU – Stockholm). Sämtliche Zeilen sind durch Row-Level-Security an deine User-ID gebunden – andere Nutzer:innen sehen nichts von dir. Details findest du in der Datenschutzerklärung.',
      en: 'Your data lives in a Supabase Postgres database we operate (EU region — Stockholm). All rows are bound to your user ID via row-level security — other users can’t see anything of yours. Details in the privacy policy.',
      es: 'Tus datos están en una base de datos Postgres de Supabase operada por nosotros (región UE — Estocolmo). Todas las filas están ligadas a tu user ID con row-level security — otros usuarios no pueden ver nada tuyo. Detalles en la política de privacidad.',
      fr: "Tes données sont stockées dans une base Postgres Supabase que nous exploitons (région UE — Stockholm). Toutes les lignes sont liées à ton user ID par row-level security — les autres utilisateurs ne voient rien de toi. Détails dans la politique de confidentialité.",
      it: 'I tuoi dati risiedono in un database Postgres Supabase gestito da noi (regione UE — Stoccolma). Tutte le righe sono legate al tuo user ID con row-level security — gli altri utenti non vedono nulla. Dettagli nell’informativa privacy.',
    },
    'faq35.q': { de: 'Kann ich meine Daten exportieren?', en: 'Can I export my data?', es: '¿Puedo exportar mis datos?', fr: 'Puis-je exporter mes données ?', it: 'Posso esportare i miei dati?' },
    'faq35.a': {
      de: 'Ja. Im Profil unter <strong>„Export My Data"</strong> bekommst du ein <strong>vollständiges ZIP-Archiv</strong> aller deiner Daten – Habits, ARCs, Logs, Goals, Journal-Einträge und Cover-Bilder. Aus Performance-Gründen ist der Export auf einmal pro 24 Stunden begrenzt.',
      en: 'Yes. In your profile under <strong>"Export My Data"</strong> you get a <strong>full ZIP archive</strong> of all your data — habits, ARCs, logs, goals, journal entries and cover images. For performance reasons the export is limited to once per 24 hours.',
      es: 'Sí. En el perfil, en <strong>«Export My Data»</strong>, obtienes un <strong>archivo ZIP completo</strong> con todos tus datos — hábitos, ARCs, logs, goals, entradas de diario e imágenes de portada. Por rendimiento el export está limitado a una vez cada 24 horas.',
      fr: "Oui. Dans ton profil, sous <strong>« Export My Data »</strong>, tu obtiens une <strong>archive ZIP complète</strong> de toutes tes données — habitudes, ARC, logs, goals, entrées de journal et images de couverture. Pour des raisons de performance, l'export est limité à une fois toutes les 24 heures.",
      it: 'Sì. Nel profilo, in <strong>«Export My Data»</strong>, ottieni un <strong>archivio ZIP completo</strong> di tutti i tuoi dati — abitudini, ARC, log, goal, voci di journal e immagini di copertina. Per motivi di performance l’export è limitato a una volta ogni 24 ore.',
    },
    'faq36.q': { de: 'Kann ich mein Konto zurücksetzen oder löschen?', en: 'Can I reset or delete my account?', es: '¿Puedo restablecer o eliminar mi cuenta?', fr: 'Puis-je réinitialiser ou supprimer mon compte ?', it: 'Posso resettare o eliminare il mio account?' },
    'faq36.a': {
      de: 'Zwei Optionen in den Account-Einstellungen:<ul><li><strong>Reset Account</strong> – setzt deinen Fortschritt zurück (Habits, Streaks, XP, ARCs, Journals), behält Profil und Pro-Abo</li><li><strong>Delete Account</strong> – löscht dein Konto und sämtliche Daten unwiderruflich</li></ul>Beide Aktionen erfordern eine explizite Bestätigung (Tippen von „RESET" bzw. „DELETE").',
      en: 'Two options in the account settings:<ul><li><strong>Reset Account</strong> — resets your progress (habits, streaks, XP, ARCs, journals), keeps profile and Pro subscription</li><li><strong>Delete Account</strong> — irreversibly deletes your account and all data</li></ul>Both actions require explicit confirmation (typing "RESET" or "DELETE").',
      es: 'Dos opciones en los ajustes de cuenta:<ul><li><strong>Reset Account</strong> — restablece tu progreso (hábitos, rachas, XP, ARCs, diarios), mantiene perfil y suscripción Pro</li><li><strong>Delete Account</strong> — elimina tu cuenta y todos los datos de forma irreversible</li></ul>Ambas requieren confirmación explícita (escribir «RESET» o «DELETE»).',
      fr: "Deux options dans les paramètres du compte :<ul><li><strong>Reset Account</strong> — réinitialise ta progression (habitudes, séries, XP, ARC, journaux), conserve le profil et l'abonnement Pro</li><li><strong>Delete Account</strong> — supprime ton compte et toutes les données de manière irréversible</li></ul>Les deux actions exigent une confirmation explicite (saisie de « RESET » ou « DELETE »).",
      it: 'Due opzioni nelle impostazioni account:<ul><li><strong>Reset Account</strong> — resetta i tuoi progressi (abitudini, streak, XP, ARC, journal), mantiene profilo e abbonamento Pro</li><li><strong>Delete Account</strong> — cancella account e tutti i dati in modo irreversibile</li></ul>Entrambe richiedono conferma esplicita (digitare «RESET» o «DELETE»).',
    },
    'faq37.q': { de: 'Ist ArcUp DSGVO-konform?', en: 'Is ArcUp GDPR-compliant?', es: '¿ArcUp cumple el RGPD?', fr: 'ArcUp est-il conforme au RGPD ?', it: 'ArcUp è conforme al GDPR?' },
    'faq37.a': {
      de: 'ArcUp ist nach europäischem Recht aufgebaut: Anbieter mit Sitz in Österreich, Datenhaltung in der EU, Auftragsverarbeitungs­vereinbarungen mit allen Dienstleistern (Supabase, Stripe, Anthropic), klar getrennte Drittlandsübermittlungs­garantien. Die vollständige Datenschutzerklärung erläutert Datenkategorien, Rechtsgrundlagen, Empfänger, Speicherdauern und deine Betroffenenrechte (Auskunft, Berichtigung, Löschung, Widerspruch, Datenübertragbarkeit).',
      en: 'ArcUp is built under European law: provider based in Austria, data hosted in the EU, data processing agreements with all providers (Supabase, Stripe, Anthropic), clearly separated third-country transfer safeguards. The full privacy policy explains data categories, legal bases, recipients, retention periods and your data-subject rights (access, rectification, erasure, objection, portability).',
      es: 'ArcUp está construido bajo derecho europeo: proveedor con sede en Austria, datos alojados en la UE, contratos de encargado del tratamiento con todos los proveedores (Supabase, Stripe, Anthropic), garantías de transferencia a terceros países claramente separadas. La política de privacidad completa explica categorías de datos, bases jurídicas, destinatarios, plazos y tus derechos como interesado (acceso, rectificación, supresión, oposición, portabilidad).',
      fr: "ArcUp est construit sous le droit européen : fournisseur basé en Autriche, données hébergées dans l'UE, accords de sous-traitance avec tous les prestataires (Supabase, Stripe, Anthropic), garanties de transfert hors UE clairement séparées. La politique de confidentialité complète explique les catégories de données, bases légales, destinataires, durées et tes droits (accès, rectification, effacement, opposition, portabilité).",
      it: 'ArcUp è costruito sul diritto europeo: fornitore con sede in Austria, dati ospitati in UE, accordi di responsabile del trattamento con tutti i fornitori (Supabase, Stripe, Anthropic), garanzie di trasferimento extra-UE chiaramente separate. L’informativa completa spiega categorie di dati, basi giuridiche, destinatari, tempi di conservazione e i tuoi diritti (accesso, rettifica, cancellazione, opposizione, portabilità).',
    },
    'faq38.q': { de: 'Werden meine Daten für KI-Training verwendet?', en: 'Is my data used for AI training?', es: '¿Mis datos se usan para entrenar IA?', fr: 'Mes données sont-elles utilisées pour entraîner l’IA ?', it: 'I miei dati vengono usati per l’addestramento dell’IA?' },
    'faq38.a': {
      de: 'Nein. Inhalte vom Typ „ArcUp Original" werden <strong>vorab und kuratorisch</strong> mit KI-Unterstützung erstellt – ohne Bezug zu individuellen Nutzerprofilen. Wenn du den AI ARC Generator nutzt, geht <strong>ausschließlich dein eingetippter Prompt</strong> an Anthropic – keine App-Daten, keine personenbezogenen Informationen.',
      en: 'No. "ArcUp Original" content is created <strong>in advance and curatorially</strong> with AI support — independent of individual user profiles. When you use the AI ARC Generator, <strong>only your typed prompt</strong> is sent to Anthropic — no app data, no personal information.',
      es: 'No. Los contenidos «ArcUp Original» se crean <strong>de antemano y de forma curatorial</strong> con apoyo de IA — sin relación con perfiles de usuario individuales. Cuando usas el AI ARC Generator, <strong>solo tu prompt</strong> se envía a Anthropic — sin datos de la app, sin información personal.',
      fr: "Non. Les contenus « ArcUp Original » sont créés <strong>en amont et de manière curatoriale</strong> avec assistance IA — indépendamment des profils utilisateurs individuels. Quand tu utilises l'AI ARC Generator, <strong>seul ton prompt</strong> est envoyé à Anthropic — pas de données app, pas d'informations personnelles.",
      it: 'No. I contenuti «ArcUp Original» sono creati <strong>in anticipo e in modo curatoriale</strong> con supporto IA — indipendentemente dai profili utente. Quando usi l’AI ARC Generator, <strong>solo il tuo prompt</strong> viene inviato ad Anthropic — nessun dato dell’app, nessuna informazione personale.',
    },

    'faq39.q': { de: 'Auf welchen Plattformen läuft ArcUp?', en: 'Which platforms does ArcUp run on?', es: '¿En qué plataformas funciona ArcUp?', fr: 'Sur quelles plateformes fonctionne ArcUp ?', it: 'Su quali piattaforme funziona ArcUp?' },
    'faq39.a': {
      de: 'ArcUp ist eine native mobile App für <strong>iOS</strong> und <strong>Android</strong>, gebaut mit React Native und Expo. Du brauchst kein Webkonto und keinen Browser, um die App zu nutzen.',
      en: 'ArcUp is a native mobile app for <strong>iOS</strong> and <strong>Android</strong>, built with React Native and Expo. You don’t need a web account or a browser to use the app.',
      es: 'ArcUp es una app móvil nativa para <strong>iOS</strong> y <strong>Android</strong>, construida con React Native y Expo. No necesitas cuenta web ni navegador para usarla.',
      fr: "ArcUp est une app mobile native pour <strong>iOS</strong> et <strong>Android</strong>, construite avec React Native et Expo. Aucun compte web ni navigateur n'est nécessaire pour utiliser l'app.",
      it: 'ArcUp è un’app mobile nativa per <strong>iOS</strong> e <strong>Android</strong>, costruita con React Native ed Expo. Non serve un account web né un browser per usarla.',
    },
    'faq40.q': { de: 'Was tun bei Fragen, Bugs oder Wünschen?', en: 'What to do with questions, bugs or feature requests?', es: '¿Qué hago con preguntas, bugs o sugerencias?', fr: 'Que faire pour les questions, bugs ou suggestions ?', it: 'Cosa fare per domande, bug o richieste di funzionalità?' },
    'faq40.a': {
      de: 'In der App findest du unter „Feedback" ein direktes Eingabeformular für Bugs, Feature-Wünsche oder Vorschläge für neue ARCs, Habits und Quellen. Jede Nachricht landet direkt im Inbox der Entwicklung – wir lesen alles.',
      en: 'In the app, under "Feedback", you’ll find a direct input form for bugs, feature requests or suggestions for new ARCs, habits and sources. Every message lands directly in the development inbox — we read everything.',
      es: 'En la app, en «Feedback», encuentras un formulario directo para bugs, sugerencias de funciones o propuestas de nuevos ARCs, hábitos y fuentes. Cada mensaje llega directamente al buzón de desarrollo — leemos todo.',
      fr: "Dans l'app, sous « Feedback », tu trouves un formulaire direct pour les bugs, demandes de fonctionnalités ou suggestions de nouveaux ARC, habitudes et sources. Chaque message arrive directement dans la boîte de réception du développement — on lit tout.",
      it: 'Nell’app, in «Feedback», trovi un modulo diretto per bug, richieste di funzionalità o proposte di nuovi ARC, abitudini e fonti. Ogni messaggio arriva direttamente nella inbox di sviluppo — leggiamo tutto.',
    },
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
