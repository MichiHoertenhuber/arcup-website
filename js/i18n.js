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
      de: 'iOS &amp; Android · Jetzt verfügbar',
      en: 'iOS &amp; Android · Available now',
      es: 'iOS y Android · Ya disponible',
      fr: 'iOS et Android · Disponible maintenant',
      it: 'iOS e Android · Ora disponibile',
    },
    'hero.headline1': { de: 'Building', en: 'Building', es: 'Construir', fr: 'Construire', it: 'Costruire' },
    'hero.headline2': { de: 'better',   en: 'better',   es: 'mejores',   fr: 'de meilleures', it: 'migliori' },
    'hero.headline3': { de: 'habits.',  en: 'habits.',  es: 'hábitos.',  fr: 'habitudes.',    it: 'abitudini.' },
    'hero.sub': {
      de: 'Verbinde deine langfristige Vision mit dem, was du heute tust.',
      en: 'Connect your long-term vision with what you do today.',
      es: 'Conecta tu visión a largo plazo con lo que haces hoy.',
      fr: "Relie ta vision à long terme à ce que tu fais aujourd'hui.",
      it: 'Collega la tua visione a lungo termine con ciò che fai oggi.',
    },
    'hero.rotPrefix': { de: 'Für', en: 'For', es: 'Para', fr: 'Pour', it: 'Per' },
    'hero.ctaPrimary': {
      de: 'App kostenlos laden', en: 'Get the app for free', es: 'Descargar gratis',
      fr: "Télécharger gratuitement", it: "Scarica gratis",
    },
    'hero.ctaSecondary': {
      de: 'So funktioniert ArcUp', en: 'How ArcUp works', es: 'Cómo funciona ArcUp',
      fr: 'Comment fonctionne ArcUp', it: 'Come funziona ArcUp',
    },
    'hero.trust1': { de: 'Made in Austria', en: 'Made in Austria', es: 'Made in Austria', fr: 'Made in Austria', it: 'Made in Austria' },
    'hero.trust2': { de: 'EU-Hosting · DSGVO',      en: 'EU hosting · GDPR',      es: 'Hosting UE · RGPD',    fr: 'Hébergement UE · RGPD',  it: 'Hosting UE · GDPR' },
    'hero.trust3': { de: 'Kein Abo-Zwang', en: 'No subscription required', es: 'Sin suscripción obligatoria', fr: 'Sans abonnement obligatoire', it: 'Nessun abbonamento obbligatorio' },
    'hero.trust4': { de: 'Keine Werbung, keine Tracker', en: 'No ads, no trackers', es: 'Sin anuncios, sin rastreadores', fr: 'Pas de pub, pas de trackers', it: 'Niente pubblicità, niente tracker' },
    'hero.trust5': { de: 'Voller Datenexport jederzeit', en: 'Full data export any time', es: 'Exportación completa de datos cuando quieras', fr: 'Export complet de tes données à tout moment', it: 'Export completo dei dati in qualsiasi momento' },

    'hero.altHome':  { de: 'ArcUp Home — Tageserfüllung, Wochenerfüllung, Level und aktive ARCs', en: 'ArcUp Home — daily and weekly completion, level and active ARCs', es: 'ArcUp Inicio — cumplimiento diario y semanal, nivel y ARCs activos', fr: "ArcUp Accueil — achèvement quotidien et hebdomadaire, niveau et ARC actifs", it: "ArcUp Home — completamento giornaliero e settimanale, livello e ARC attivi" },
    'hero.altARCs':  { de: 'ARCademy — kuratierte ARCs', en: 'ARCademy — curated ARCs', es: 'ARCademy — ARCs curados', fr: 'ARCademy — ARC sélectionnés', it: 'ARCademy — ARC selezionati' },
    'hero.altRef':   { de: 'Reflect — Wheel of Life', en: 'Reflect — Wheel of Life', es: 'Reflect — Rueda de la vida', fr: 'Reflect — Roue de la vie', it: 'Reflect — Ruota della vita' },

    // ─── MANIFESTO ───────────────────────────────────────
    'mani.overline': { de: 'Was daraus folgt', en: 'What follows from this', es: 'Lo que se sigue', fr: 'Ce qui en découle', it: 'Cosa ne consegue' },
    'mani.title': {
      de: 'Vier Prinzipien,<br />die Verhalten <em>messbar</em> machen.',
      en: 'Four principles<br />that make behaviour <em>measurable</em>.',
      es: 'Cuatro principios<br />que hacen el comportamiento <em>medible</em>.',
      fr: 'Quatre principes<br />qui rendent le comportement <em>mesurable</em>.',
      it: 'Quattro principi<br />che rendono il comportamento <em>misurabile</em>.',
    },
    'p1.h': { de: 'Strukturiert statt beliebig.', en: 'Structured, not arbitrary.', es: 'Estructurado, no arbitrario.', fr: 'Structuré, pas arbitraire.', it: 'Strutturato, non arbitrario.' },
    'p1.b': {
      de: 'Gewohnheiten sind keine Freitext-Notizen. Jede Gewohnheit hat einen Zielwert, eine Richtung (≥ oder ≤) und eine Einheit.',
      en: "Habits aren't free-text notes. Each habit has a target value, a direction (≥ or ≤) and a unit.",
      es: 'Los hábitos no son notas libres. Cada uno tiene valor objetivo, dirección (≥ o ≤) y unidad.',
      fr: "Les habitudes ne sont pas des notes libres. Chacune a une valeur cible, une direction (≥ ou ≤) et une unité.",
      it: "Le abitudini non sono note libere. Ognuna ha un valore obiettivo, una direzione (≥ o ≤) e un'unità.",
    },
    'p2.h': { de: 'Befristet statt endlos.', en: 'Time-boxed, not endless.', es: 'Con plazo, no sin fin.', fr: 'Limité dans le temps, pas sans fin.', it: 'A tempo, non infinito.' }, // _x:'Zeit-geboxte Anstrengung.', en: 'Time-boxed effort.', es: 'Esfuerzo con plazo.', fr: 'Effort limité dans le temps.', it: 'Sforzo a tempo definito.' },
    'p2.b': {
      de: 'Echte Verhaltensänderung passiert in fokussierten Phasen. Ein ARC ist eine Verpflichtung über 1 bis 12 Wochen — kein endloser Streak.',
      en: 'Real behaviour change happens in focused phases. An ARC is a 1- to 12-week commitment — not a "forever streak".',
      es: 'El cambio real ocurre en fases enfocadas. Un ARC es un compromiso de 1 a 12 semanas — no una «racha eterna».',
      fr: "Le vrai changement arrive par phases focalisées. Un ARC est un engagement de 1 à 12 semaines — pas une « série éternelle ».",
      it: 'Il vero cambiamento avviene per fasi focalizzate. Un ARC è un impegno di 1 a 12 settimane — non una «serie eterna».',
    },
    'p3.h': { de: 'Belegt statt behauptet.', en: 'Proven, not claimed.', es: 'Probado, no afirmado.', fr: 'Prouvé, pas affirmé.', it: 'Provato, non affermato.' },
    'p3.b': {
      de: 'Jede Empfehlung beruht auf einem belegbaren Lerninhalt — Buch, Studie, Vortrag oder eigene Recherche. Wir behaupten nichts, was wir nicht stützen können.',
      en: 'Every recommendation cites learning content: a book, a study, a talk, a creator. We claim nothing without evidence.',
      es: 'Cada recomendación tiene un contenido de aprendizaje: un libro, un estudio, una charla, un creador. No afirmamos nada sin prueba.',
      fr: "Chaque recommandation cite un contenu d'apprentissage : livre, étude, conférence, créateur. Rien n'est affirmé sans preuve.",
      it: 'Ogni raccomandazione si basa su un contenuto di apprendimento: un libro, uno studio, una conferenza, un creator. Non affermiamo nulla senza prove.',
    },
    'p4.h': { de: 'Steigern statt wiederholen.', en: 'Progress, not repetition.', es: 'Progresar, no repetir.', fr: 'Progresser, pas répéter.', it: 'Progredire, non ripetere.' },
    'p4.b': {
      de: 'Ziele wachsen linear über die ARC-Dauer — von 1 auf 5 km, von 5 auf 20 Minuten. Wachstum passiert durch Steigerung, nicht durch Wiederholung.',
      en: 'Targets grow linearly across the ARC — from 1 to 5 km, from 5 to 20 minutes. Growth happens through progression, not repetition.',
      es: 'Los objetivos crecen linealmente durante el ARC — de 1 a 5 km, de 5 a 20 minutos. El crecimiento ocurre por progresión, no por repetición.',
      fr: "Les objectifs croissent linéairement sur la durée de l'ARC — de 1 à 5 km, de 5 à 20 minutes. La croissance vient de la progression, pas de la répétition.",
      it: "Gli obiettivi crescono linearmente lungo l'ARC — da 1 a 5 km, da 5 a 20 minuti. La crescita avviene per progressione, non per ripetizione.",
    },

    // ─── ARC EXAMPLES ────────────────────────────────────
    'arcs.overline': { de: 'Konkret', en: 'Concretely', es: 'En concreto', fr: 'Concrètement', it: 'In concreto' },
    'arcs.title':    { de: 'So sieht ein ARC aus.', en: 'What an ARC looks like.', es: 'Cómo se ve un ARC.', fr: 'À quoi ressemble un ARC.', it: 'Com’è fatto un ARC.' },
    'arcs.sub':      { de: 'Drei reale ARCs aus der Sammlung — jeweils mit Dauer, Lebensbereich und den Gewohnheiten, die du tatsächlich trackst.', en: 'Three real ARCs from the library — each with duration, life area and the habits you actually track.', es: 'Tres ARCs reales de la biblioteca — con duración, área de vida y los hábitos que realmente registras.', fr: "Trois ARC réels de la bibliothèque — avec durée, domaine de vie et les habitudes que tu suis vraiment.", it: 'Tre ARC reali dalla biblioteca — con durata, area di vita e le abitudini che tracci davvero.' },

    // ARC 1 — Baseline (Growth, 2 weeks) — from supabase seed_arcs_basic
    'arc1.area': { de: 'Growth', en: 'Growth', es: 'Growth', fr: 'Growth', it: 'Growth' },
    'arc1.dur':  { de: '2 Wochen', en: '2 weeks', es: '2 semanas', fr: '2 semaines', it: '2 settimane' },
    'arc1.h':    { de: 'Baseline', en: 'Baseline', es: 'Baseline', fr: 'Baseline', it: 'Baseline' },
    'arc1.b':    { de: 'Vierzehn Tage ehrliches Tracking — sieh dich selbst, bevor du dich änderst.', en: 'Fourteen days of honest tracking — see yourself before you change yourself.', es: 'Catorce días de seguimiento honesto — verte antes de cambiarte.', fr: "Quatorze jours de suivi honnête — te voir avant de te changer.", it: 'Quattordici giorni di tracciamento onesto — vediti prima di cambiarti.' },
    'arc1.h1':   { de: 'Mood Check-In · 1×/Tag', en: 'Mood Check-In · 1×/day', es: 'Mood Check-In · 1×/día', fr: 'Mood Check-In · 1×/jour', it: 'Mood Check-In · 1×/giorno' },
    'arc1.h2':   { de: 'Sleep ≥ 7 h', en: 'Sleep ≥ 7 h', es: 'Sueño ≥ 7 h', fr: 'Sommeil ≥ 7 h', it: 'Sonno ≥ 7 h' },
    'arc1.h3':   { de: 'Water Intake ≥ 1,5 l', en: 'Water Intake ≥ 1.5 l', es: 'Agua ≥ 1,5 l', fr: 'Eau ≥ 1,5 l', it: 'Acqua ≥ 1,5 l' },
    'arc1.h4':   { de: 'Steps ≥ 4.000', en: 'Steps ≥ 4,000', es: 'Pasos ≥ 4.000', fr: 'Pas ≥ 4 000', it: 'Passi ≥ 4.000' },
    'arc1.h5':   { de: 'Compass Review · 1×/Woche', en: 'Compass Review · 1×/week', es: 'Compass Review · 1×/semana', fr: 'Compass Review · 1×/semaine', it: 'Compass Review · 1×/settimana' },

    // ARC 2 — Sleep First (Body, 3 weeks) — from supabase seed_arcs_basic
    'arc2.area': { de: 'Body', en: 'Body', es: 'Body', fr: 'Body', it: 'Body' },
    'arc2.dur':  { de: '3 Wochen', en: '3 weeks', es: '3 semanas', fr: '3 semaines', it: '3 settimane' },
    'arc2.h':    { de: 'Sleep First', en: 'Sleep First', es: 'Sleep First', fr: 'Sleep First', it: 'Sleep First' },
    'arc2.b':    { de: 'Drei Wochen, um die eine Gewohnheit in den Griff zu bekommen, auf der alle anderen aufbauen.', en: 'Three weeks to fix the one habit everything else stands on.', es: 'Tres semanas para arreglar el único hábito sobre el que se sostienen los demás.', fr: "Trois semaines pour réparer l'unique habitude sur laquelle reposent toutes les autres.", it: 'Tre settimane per sistemare l’unica abitudine su cui tutte le altre poggiano.' },
    'arc2.h1':   { de: 'Sleep ≥ 7,5 h', en: 'Sleep ≥ 7.5 h', es: 'Sueño ≥ 7,5 h', fr: 'Sommeil ≥ 7,5 h', it: 'Sonno ≥ 7,5 h' },
    'arc2.h2':   { de: 'Consistent Wake Time', en: 'Consistent Wake Time', es: 'Hora de despertar constante', fr: 'Heure de réveil constante', it: 'Orario di sveglia costante' },
    'arc2.h3':   { de: 'Tech-Free Hour vor dem Bett', en: 'Tech-Free Hour Before Bed', es: 'Hora sin pantallas antes de dormir', fr: 'Heure sans écran avant le coucher', it: 'Ora senza schermi prima di dormire' },
    'arc2.h4':   { de: 'Bedtime Routine', en: 'Bedtime Routine', es: 'Rutina nocturna', fr: 'Routine du coucher', it: 'Routine serale' },
    'arc2.h5':   { de: 'Sunlight Exposure ≥ 10 min · morgens', en: 'Sunlight Exposure ≥ 10 min · morning', es: 'Luz solar ≥ 10 min · por la mañana', fr: 'Lumière du soleil ≥ 10 min · matin', it: 'Esposizione al sole ≥ 10 min · mattina' },

    // ARC 3 — Quiet Mind (Mind, 3 weeks) — from supabase seed_arcs_basic
    'arc3.area': { de: 'Mind', en: 'Mind', es: 'Mind', fr: 'Mind', it: 'Mind' },
    'arc3.dur':  { de: '3 Wochen', en: '3 weeks', es: '3 semanas', fr: '3 semaines', it: '3 settimane' },
    'arc3.h':    { de: 'Quiet Mind', en: 'Quiet Mind', es: 'Quiet Mind', fr: 'Quiet Mind', it: 'Quiet Mind' },
    'arc3.b':    { de: 'Stille als bewusste tägliche Praxis — drei Wochen, in denen sie zum Normalzustand wird.', en: 'Stillness as a deliberate daily practice — three weeks for it to become the default.', es: 'La quietud como práctica diaria deliberada — tres semanas para que sea el modo por defecto.', fr: 'Le calme comme pratique quotidienne délibérée — trois semaines pour qu’il devienne le réglage par défaut.', it: 'La quiete come pratica quotidiana deliberata — tre settimane perché diventi default.' },
    'arc3.h1':   { de: 'Meditation · 5 → 15 min (progressiv)', en: 'Meditation · 5 → 15 min (progressive)', es: 'Meditación · 5 → 15 min (progresivo)', fr: 'Méditation · 5 → 15 min (progressif)', it: 'Meditazione · 5 → 15 min (progressivo)' },
    'arc3.h2':   { de: 'Breathwork ≥ 5 min', en: 'Breathwork ≥ 5 min', es: 'Respiración ≥ 5 min', fr: 'Respiration ≥ 5 min', it: 'Respirazione ≥ 5 min' },
    'arc3.h3':   { de: 'Time in Nature ≥ 20 min', en: 'Time in Nature ≥ 20 min', es: 'Tiempo en la naturaleza ≥ 20 min', fr: 'Temps dans la nature ≥ 20 min', it: 'Tempo nella natura ≥ 20 min' },
    'arc3.h4':   { de: 'Mood Check-In · 1×/Tag', en: 'Mood Check-In · 1×/day', es: 'Mood Check-In · 1×/día', fr: 'Mood Check-In · 1×/jour', it: 'Mood Check-In · 1×/giorno' },
    'arc3.h5':   { de: 'Sleep ≥ 7,5 h', en: 'Sleep ≥ 7.5 h', es: 'Sueño ≥ 7,5 h', fr: 'Sommeil ≥ 7,5 h', it: 'Sonno ≥ 7,5 h' },

    // ─── THE APP (4 showcases) ───────────────────────────
    'sys.overline': { de: 'In der App', en: 'Inside the app', es: 'Dentro de la app', fr: 'Dans l’app', it: 'Dentro l’app' },
    'sys.title':    { de: 'Vier Tabs. Eine klare Logik.', en: 'Four tabs. One clear logic.', es: 'Cuatro pestañas. Una lógica clara.', fr: 'Quatre onglets. Une logique claire.', it: 'Quattro tab. Una logica chiara.' },
    'sys.sub':      { de: 'Drei Ebenen, vier Tabs — jeder erfüllt genau eine Aufgabe. Keine überladenen Screens, keine Multifunktions-Buttons.', en: 'Three layers, four tabs — each does exactly one job. No overloaded screens, no multi-function buttons.', es: 'Tres niveles, cuatro pestañas — cada una hace una sola cosa. Pantallas claras, sin botones multifunción.', fr: 'Trois niveaux, quatre onglets — chacun a une seule tâche. Pas d’écrans surchargés, pas de boutons multifonctions.', it: 'Tre livelli, quattro tab — ognuno fa una sola cosa. Schermate pulite, niente pulsanti multifunzione.' },

    // 01 Home
    'sc1.num':   { de: '01 — Home', en: '01 — Home', es: '01 — Inicio', fr: '01 — Accueil', it: '01 — Home' },
    'sc1.h':     { de: 'Heute. Numerisch. Ehrlich.', en: 'Today. Numeric. Honest.', es: 'Hoy. Numérico. Honesto.', fr: "Aujourd'hui. Chiffré. Honnête.", it: 'Oggi. Numerico. Onesto.' },
    'sc1.b':     { de: 'Drei Ringe für Tag, Woche und Level. Eine Liste deiner heutigen Gewohnheiten — mit dem konkreten Zielwert, nicht mit einer Checkbox. Aktive ARCs zeigen, wo du gerade stehst.', en: "Three rings for day, week and level. A list of today's habits — with concrete target values, not checkboxes. Active ARCs show where you currently stand.", es: 'Tres anillos para día, semana y nivel. Una lista de tus hábitos de hoy — con valor objetivo concreto, no casillas. Los ARCs activos muestran dónde estás.', fr: 'Trois anneaux pour le jour, la semaine et le niveau. Une liste de vos habitudes du jour — avec une valeur cible concrète, pas une case à cocher. Les ARC actifs montrent où vous en êtes.', it: 'Tre anelli per giorno, settimana e livello. Una lista delle tue abitudini di oggi — con valore obiettivo concreto, non caselle. Gli ARC attivi mostrano dove sei.' },
    'sc1.li1':   { de: 'Tages- und Wochenerfüllung als Prozent, proportional zum Zielwert', en: 'Daily and weekly completion as a percentage, proportional to the target', es: 'Cumplimiento diario y semanal en porcentaje, proporcional al objetivo', fr: 'Complétion quotidienne et hebdomadaire en pourcentage, proportionnelle à la cible', it: 'Completamento giornaliero e settimanale in percentuale, proporzionale al target' },
    'sc1.li2':   { de: 'Level, Streak und aktive ARC-Karte mit Tag X von Y', en: 'Level, streak and active-ARC card showing day X of Y', es: 'Nivel, racha y tarjeta de ARC activo con día X de Y', fr: 'Niveau, série et carte d’ARC actif jour X sur Y', it: 'Livello, streak e card di ARC attivo con giorno X di Y' },
    'sc1.li3':   { de: 'Logbuch öffnet sich in einem Tap — nur der heutige Tag, keine Rückdatierung', en: 'The logbook opens in one tap — only today, no back-dating', es: 'El registro se abre en un toque — solo hoy, sin retroactividad', fr: "Le journal s'ouvre en un tap — uniquement aujourd'hui, pas d'antidatage", it: "Il logbook si apre con un tap — solo oggi, niente retrodatazione" },
    'sc1.li4':   { de: 'Live-Timer (Stoppuhr oder Pomodoro) für Lese-, Meditations- und Deep-Work-Gewohnheiten', en: 'Live timer (stopwatch or Pomodoro) for reading, meditation and deep-work habits', es: 'Timer en vivo (cronómetro o Pomodoro) para hábitos de lectura, meditación y deep work', fr: "Timer en direct (chrono ou Pomodoro) pour les habitudes de lecture, méditation et deep work", it: 'Timer live (cronometro o Pomodoro) per abitudini di lettura, meditazione e deep work' },
    'sc1.li5':   { de: 'Rest Days und Vacation Mode — Auszeiten brechen deinen Streak nicht', en: 'Rest days and Vacation Mode — time off does not break your streak', es: 'Días de descanso y modo Vacaciones — las pausas no rompen tu racha', fr: 'Jours de repos et mode Vacances — les pauses ne cassent pas ta série', it: 'Giorni di riposo e Vacation Mode — le pause non rompono il tuo streak' },
    'sc1.alt':   { de: 'ArcUp Home — Tages-, Wochen- und Level-Ringe mit aktivem ARC Morning Mastery', en: 'ArcUp Home — daily, weekly and level rings with active ARC Morning Mastery', es: 'ArcUp Inicio — anillos de día, semana y nivel con ARC Morning Mastery', fr: "ArcUp Accueil — anneaux jour, semaine et niveau avec ARC Morning Mastery actif", it: 'ArcUp Home — anelli giorno, settimana e livello con ARC Morning Mastery attivo' },

    // 02 ARCademy
    'sc2.num': { de: '02 — ARCademy', en: '02 — ARCademy', es: '02 — ARCademy', fr: '02 — ARCademy', it: '02 — ARCademy' },
    'sc2.h':   { de: 'Wähle, baue oder lass generieren.', en: 'Pick one, build one, or have one generated.', es: 'Elige, crea o haz que se genere.', fr: 'Choisissez, créez ou laissez générer.', it: 'Scegli, crea o lascia generare.' },
    'sc2.b':   { de: 'Eine kuratierte Sammlung an ARCs zwischen 1 und 12 Wochen. Schwierigkeit, Lebensbereich, Lerninhalt, Dauer — alles filterbar. Plus zwei Wege, eigene Pfade zu gehen.', en: 'A curated library of ARCs from 1 to 12 weeks. Difficulty, life area, learning content, duration — all filterable. Plus two ways to go your own path.', es: 'Una biblioteca curada de ARCs de 1 a 12 semanas. Dificultad, área, contenido de aprendizaje, duración — todo filtrable. Y dos vías para crear el tuyo.', fr: "Une bibliothèque sélectionnée d'ARC de 1 à 12 semaines. Difficulté, domaine, contenu d'apprentissage, durée — tout filtrable. Plus deux façons de tracer votre propre chemin.", it: 'Una biblioteca curata di ARC da 1 a 12 settimane. Difficoltà, area, contenuto di apprendimento, durata — tutto filtrabile. E due modi per fare la tua strada.' },
    'sc2.li1': { de: 'Kuratierte ARCs mit Theorie, Tipps, Cover und primärem Lerninhalt', en: 'Curated ARCs with theory, tips, cover and primary learning content', es: 'ARCs curados con teoría, consejos, portada y contenido de aprendizaje primario', fr: "ARC sélectionnés avec théorie, conseils, couverture et contenu d'apprentissage principal", it: 'ARC curati con teoria, consigli, copertina e contenuto di apprendimento primario' },
    'sc2.li2': { de: 'KI-Generator: Ziel in einem Satz beschreiben, fertigen ARC erhalten — editierbar', en: 'AI generator: describe your goal in one sentence, receive a ready ARC — editable', es: 'Generador IA: describe tu meta en una frase, recibe un ARC listo — editable', fr: "Générateur IA : décrivez votre objectif en une phrase, recevez un ARC prêt — éditable", it: "Generatore IA: descrivi il tuo obiettivo in una frase, ricevi un ARC pronto — modificabile" },
    'sc2.li3': { de: 'Selfmade-ARCs aus kuratierten Gewohnheiten per Drei-Schritte-Wizard <span class="pro-pill">Pro</span>', en: 'Self-made ARCs from curated habits via a three-step wizard <span class="pro-pill">Pro</span>', es: 'ARCs propios a partir de hábitos curados con asistente de tres pasos <span class="pro-pill">Pro</span>', fr: "ARC personnalisés à partir d'habitudes sélectionnées via un assistant en trois étapes <span class=\"pro-pill\">Pro</span>", it: 'ARC personali da abitudini curate tramite procedura guidata in tre passi <span class="pro-pill">Pro</span>' },
    'sc2.alt': { de: 'ARCademy — Beliebte ARCs Productivity Reset und Quadrant II Architect mit Suche und Filter', en: 'ARCademy — popular ARCs Productivity Reset and Quadrant II Architect with search and filter', es: 'ARCademy — ARCs populares Productivity Reset y Quadrant II Architect con búsqueda y filtros', fr: "ARCademy — ARC populaires Productivity Reset et Quadrant II Architect avec recherche et filtres", it: 'ARCademy — ARC popolari Productivity Reset e Quadrant II Architect con ricerca e filtri' },

    // 03 Discover
    'sc3.num': { de: '03 — Discover · Lerninhalte', en: '03 — Discover · Learning Content', es: '03 — Discover · Contenidos de aprendizaje', fr: "03 — Discover · Contenus d'apprentissage", it: '03 — Discover · Contenuti di apprendimento' },
    'sc3.h':   { de: 'Wissen, kompakt aufbereitet.', en: 'Knowledge, distilled.', es: 'Conocimiento, destilado.', fr: 'Le savoir, condensé.', it: 'Conoscenza, distillata.' },
    'sc3.b':   { de: 'Discover hat zwei Tabs — Lerninhalte und Gewohnheiten. Im Lerninhalte-Tab steht hinter jeder Gewohnheit und jedem ARC ein redaktionelles Briefing: selbst geschrieben, in 4 bis 8 Minuten lesbar, direkt verknüpft.', en: 'Discover has two tabs — Learning Content and Habits. In the Learning Content tab, every habit and ARC is backed by an editorial briefing: written by us, readable in 4 to 8 minutes, directly linked.', es: 'Discover tiene dos pestañas — Contenidos de aprendizaje y Hábitos. En Contenidos de aprendizaje, detrás de cada hábito y cada ARC hay un briefing editorial: escrito por nosotros, legible en 4 a 8 minutos, directamente vinculado.', fr: "Discover a deux onglets — Contenus d'apprentissage et Habitudes. Dans Contenus d'apprentissage, chaque habitude et chaque ARC est appuyé par un briefing éditorial : écrit par nous, lisible en 4 à 8 minutes, directement lié.", it: 'Discover ha due tab — Contenuti di apprendimento e Abitudini. Nel tab Contenuti di apprendimento, dietro ogni abitudine e ogni ARC c’è un briefing editoriale: scritto da noi, leggibile in 4–8 minuti, collegato direttamente.' },
    'sc3.li1': { de: 'Redaktionelle Briefings zu etablierten Konzepten: Trainingswissenschaft, Schlafhygiene, Atemtechniken, Lerntheorie, Fokus', en: 'Editorial briefings on established concepts: training science, sleep hygiene, breath techniques, learning theory, focus', es: 'Briefings editoriales sobre conceptos establecidos: ciencia del entrenamiento, higiene del sueño, técnicas de respiración, teoría del aprendizaje, foco', fr: "Briefings éditoriaux sur des concepts établis : science de l'entraînement, hygiène du sommeil, techniques de respiration, théorie de l'apprentissage, concentration", it: "Briefing editoriali su concetti consolidati: scienza dell'allenamento, igiene del sonno, tecniche di respirazione, teoria dell'apprendimento, focus" },
    'sc3.li2': { de: 'Klare These pro Lerninhalt, direkt anwendbar — keine Reproduktion geschützter Inhalte', en: 'Clear thesis per piece of learning content, directly applicable — no reproduction of protected content', es: 'Una tesis clara por contenido de aprendizaje, directamente aplicable — sin reproducir contenido protegido', fr: "Une thèse claire par contenu d'apprentissage, directement applicable — pas de reproduction de contenu protégé", it: 'Una tesi chiara per contenuto di apprendimento, direttamente applicabile — nessuna riproduzione di contenuti protetti' }, // _x:'Kein „im Buch lernst du…" — die Kernideen direkt destilliert, 4–8 Minuten Lesedauer', en: 'No "you’ll learn in the book…" — core ideas distilled directly, 4–8 minutes to read', es: 'Nada de «en el libro aprenderás…» — ideas centrales destiladas, 4–8 minutos de lectura', fr: "Pas de « vous apprendrez dans le livre » — les idées clés distillées, 4–8 min de lecture", it: 'Niente «nel libro imparerai…» — idee chiave distillate, 4–8 minuti di lettura' },
    'sc3.li3': { de: 'Optionale Buch- und Talk-Empfehlungen mit *-Markierung als Affiliate-Links — ohne Mehrkosten für dich', en: 'Optional book and talk recommendations marked with * as affiliate links — at no extra cost to you', es: 'Recomendaciones opcionales de libros y charlas marcadas con * como enlaces de afiliado — sin coste adicional para ti', fr: "Recommandations optionnelles de livres et conférences marquées d’un * comme liens affiliés — sans surcoût pour vous", it: 'Consigli opzionali su libri e talk marcati con * come link affiliati — nessun costo aggiuntivo per te' },
    'sc3b.num': { de: '03 — Discover · Gewohnheiten', en: '03 — Discover · Habits', es: '03 — Discover · Hábitos', fr: '03 — Discover · Habitudes', it: '03 — Discover · Abitudini' },
    'sc3b.h':   { de: 'Gewohnheiten in einer klaren Hierarchie.', en: 'Habits in a clear hierarchy.', es: 'Hábitos en una jerarquía clara.', fr: 'Des habitudes dans une hiérarchie claire.', it: 'Abitudini in una gerarchia chiara.' },
    'sc3b.b':   { de: 'Der zweite Discover-Tab: über 120 kuratierte Gewohnheiten, sauber in Ober- und Unterkategorien strukturiert. Du trackst „Long Run = 12 km" — die Insights summieren das automatisch unter <em>Laufen</em> und <em>Ausdauertraining</em> mit.', en: 'The second Discover tab: over 120 curated habits, neatly structured into parent and child categories. You track "Long Run = 12 km" — your insights automatically roll it up under <em>Running</em> and <em>Endurance training</em>.', es: 'La segunda pestaña de Discover: más de 120 hábitos curados, organizados con claridad en categorías padre e hija. Registras «Long Run = 12 km» — los insights lo agregan automáticamente bajo <em>Correr</em> y <em>Entrenamiento de resistencia</em>.', fr: "Le second onglet Discover : plus de 120 habitudes sélectionnées, organisées proprement en catégories parentes et enfants. Tu suis « Long Run = 12 km » — les insights l'agrègent automatiquement sous <em>Course</em> et <em>Endurance</em>.", it: 'Il secondo tab di Discover: oltre 120 abitudini curate, organizzate con chiarezza in categorie padre e figlie. Tracci «Long Run = 12 km» — gli insights lo aggregano automaticamente sotto <em>Corsa</em> e <em>Allenamento di resistenza</em>.' },
    'sc3b.li1': { de: 'Über 120 kuratierte Gewohnheiten in einer Baum-Struktur — durchsuchbar und filterbar', en: 'Over 120 curated habits in a tree structure — searchable and filterable', es: 'Más de 120 hábitos curados en estructura de árbol — buscables y filtrables', fr: "Plus de 120 habitudes sélectionnées dans une arborescence — recherchables et filtrables", it: 'Oltre 120 abitudini curate in una struttura ad albero — ricercabili e filtrabili' },
    'sc3b.li2': { de: 'Sub-Gewohnheits-Rollup: einmal tracken, mehrfach gezählt — von Long Run bis Ausdauertraining', en: 'Sub-habit roll-up: track once, count multiple times — from Long Run up to Endurance training', es: 'Roll-up de sub-hábitos: registras una vez, cuenta varias veces — de Long Run a Entrenamiento de resistencia', fr: 'Roll-up des sous-habitudes : suivre une fois, compter plusieurs fois — du Long Run à l’endurance', it: 'Roll-up dei sotto-habit: tracci una volta, conta più volte — dal Long Run fino all’allenamento di resistenza' },
    'sc3b.li3': { de: 'Eigene Gewohnheiten per Wizard erstellen — Einheit, Richtung, Intervall frei wählen <span class="pro-pill">Pro</span>', en: 'Create custom habits via wizard — pick your own unit, direction and interval <span class="pro-pill">Pro</span>', es: 'Crear hábitos propios con asistente — elige unidad, dirección e intervalo <span class="pro-pill">Pro</span>', fr: "Créer ses propres habitudes via l'assistant — choisis l'unité, la direction et l'intervalle <span class=\"pro-pill\">Pro</span>", it: 'Creare abitudini personali con il wizard — scegli unità, direzione e intervallo <span class="pro-pill">Pro</span>' },
    'sc3b.alt': { de: 'Discover — Gewohnheiten-Sammlung mit kuratierter Hierarchie (Screenshot folgt)', en: 'Discover — Habit library with curated hierarchy (screenshot pending)', es: 'Discover — Biblioteca de hábitos con jerarquía curada (captura pendiente)', fr: 'Discover — Bibliothèque d’habitudes avec hiérarchie sélectionnée (capture à venir)', it: 'Discover — Biblioteca delle abitudini con gerarchia curata (screenshot in arrivo)' },

    'sc3.alt': { de: 'Discover — Lerninhalte mit redaktionellen ArcUp-Original-Briefings', en: 'Discover — Learning Content with editorial ArcUp Original briefings', es: 'Discover — Contenidos de aprendizaje con briefings editoriales ArcUp Original', fr: "Discover — Contenus d'apprentissage avec briefings éditoriaux ArcUp Original", it: 'Discover — Contenuti di apprendimento con briefing editoriali ArcUp Original' },

    // 04 Reflect
    'sc4.num': { de: '04 — Reflect', en: '04 — Reflect', es: '04 — Reflect', fr: '04 — Reflect', it: '04 — Reflect' },
    'sc4.h':   { de: 'Deine Lebensbereiche im Blick.', en: 'Your life areas at a glance.', es: 'Tus áreas de vida de un vistazo.', fr: 'Tes domaines de vie en un coup d’œil.', it: 'Le tue aree di vita a colpo d’occhio.' }, // _x:'Der Compass. Dein Wheel of Life.', en: 'The Compass. Your Wheel of Life.', es: 'El Compass. Tu Wheel of Life.', fr: 'Le Compass. Votre Wheel of Life.', it: 'Il Compass. La tua Wheel of Life.' },
    'sc4.b':   { de: 'Bewerte deine fünf Lebensbereiche von 1 bis 10. Sieh, wo Balance fehlt. Schreibe Vision, Ziele und Tagebuch — paginiert, durchsuchbar, jederzeit editierbar.', en: 'Rate your five life areas from 1 to 10. See where balance is missing. Write vision, goals and journal — paginated, searchable, always editable.', es: 'Puntúa tus cinco áreas de 1 a 10. Ve dónde falta equilibrio. Escribe visión, metas y diario — paginado, buscable, siempre editable.', fr: 'Notez vos cinq domaines de 1 à 10. Voyez où le déséquilibre se cache. Écrivez vision, objectifs et journal — paginé, cherchable, toujours éditable.', it: 'Valuta le tue cinque aree da 1 a 10. Vedi dove manca equilibrio. Scrivi visione, obiettivi e diario — paginato, ricercabile, sempre modificabile.' },
    'sc4.li1': { de: 'Interaktiver Radar über Body, Mind, Growth, Relationships, Leisure', en: 'Interactive radar across Body, Mind, Growth, Relationships, Leisure', es: 'Radar interactivo sobre Cuerpo, Mente, Crecimiento, Relaciones, Ocio', fr: 'Radar interactif sur Corps, Esprit, Croissance, Relations, Loisirs', it: 'Radar interattivo su Corpo, Mente, Crescita, Relazioni, Tempo libero' },
    'sc4.li2': { de: 'Vision-Statement pro Bereich <span class="pro-pill">Pro</span>', en: 'Vision statement per area <span class="pro-pill">Pro</span>', es: 'Declaración de visión por área <span class="pro-pill">Pro</span>', fr: "Énoncé de vision par domaine <span class=\"pro-pill\">Pro</span>", it: 'Dichiarazione di visione per area <span class="pro-pill">Pro</span>' },
    'sc4.liGoals': { de: 'Ziele mit Fälligkeit pro Bereich — wöchentlich, monatlich, jährlich <span class="pro-pill">Pro</span>', en: 'Goals with due dates per area — weekly, monthly, yearly <span class="pro-pill">Pro</span>', es: 'Objetivos con fecha por área — semanal, mensual, anual <span class="pro-pill">Pro</span>', fr: "Objectifs avec échéance par domaine — hebdo, mensuel, annuel <span class=\"pro-pill\">Pro</span>", it: 'Obiettivi con scadenza per area — settimanale, mensile, annuale <span class="pro-pill">Pro</span>' },
    'sc4.li3': { de: 'Tagebuch in vier Typen: Gedanke, Lernen, Dankbarkeit, Erfolge &amp; Verluste <span class="pro-pill">Pro</span>', en: 'Journal in four types: Thought, Learning, Gratitude, Wins &amp; Losses <span class="pro-pill">Pro</span>', es: 'Diario en cuatro tipos: Pensamiento, Aprendizaje, Gratitud, Logros y pérdidas <span class="pro-pill">Pro</span>', fr: "Journal en quatre types : Pensée, Apprentissage, Gratitude, Victoires et pertes <span class=\"pro-pill\">Pro</span>", it: 'Diario in quattro tipi: Pensiero, Apprendimento, Gratitudine, Vittorie e perdite <span class="pro-pill">Pro</span>' },
    'sc4.li4': { de: 'Insights mit Heatmaps, 90-Tage-Profil und Gewohnheits-Korrelationen <span class="pro-pill">Pro</span>', en: 'Insights with heatmaps, 90-day profile and habit correlations <span class="pro-pill">Pro</span>', es: 'Insights con heatmaps, perfil de 90 días y correlaciones entre hábitos <span class="pro-pill">Pro</span>', fr: 'Insights avec heatmaps, profil 90 jours et corrélations entre habitudes <span class="pro-pill">Pro</span>', it: 'Insights con heatmap, profilo 90 giorni e correlazioni tra abitudini <span class="pro-pill">Pro</span>' },
    'sc4.alt': { de: 'Reflect — Wheel-of-Life-Radar mit Bewertung 37 von 50 über fünf Lebensbereiche', en: 'Reflect — Wheel-of-Life radar showing 37 out of 50 across five life areas', es: 'Reflect — radar Wheel of Life con 37 de 50 en cinco áreas', fr: "Reflect — radar Wheel of Life à 37 sur 50 sur cinq domaines", it: 'Reflect — radar Wheel of Life con 37 su 50 sulle cinque aree' },

    // ─── AREAS ───────────────────────────────────────────
    'areas.overline': { de: 'Der Rahmen', en: 'The framework', es: 'El marco', fr: 'Le cadre', it: 'La cornice' },
    'areas.title':    { de: 'Das große Ganze<br />im Blick.', en: 'The big picture,<br />in focus.', es: 'La imagen completa,<br />a la vista.', fr: "La vue d'ensemble,<br />toujours en vue.", it: 'Il quadro generale,<br />sempre in vista.' },
    'areas.sub':      { de: 'Jeder Lerninhalt, jede Gewohnheit und jeder ARC gehört zu genau einem Lebensbereich. Das hält den Fokus klar und verhindert „passt-überall"-Inhalte.', en: 'Every piece of learning content, habit and ARC belongs to exactly one life area. That keeps the focus sharp and prevents "fits anywhere" content.', es: 'Cada contenido de aprendizaje, cada hábito y cada ARC pertenece a exactamente una área de vida. Eso mantiene el foco nítido y evita el contenido «encaja en todas partes».', fr: "Chaque contenu d'apprentissage, chaque habitude et chaque ARC appartient à un seul domaine de vie. Cela garde le focus clair et évite le contenu « utile partout ».", it: 'Ogni contenuto di apprendimento, ogni abitudine e ogni ARC appartiene a una sola area di vita. Così il focus resta nitido e si evitano contenuti «buoni per tutto».' }, // _x:'...Das hält den Compass scharf...', en: 'Every source, habit and ARC belongs to exactly one area. That keeps the Compass sharp and prevents "fits anywhere" content.', es: 'Cada fuente, hábito y ARC pertenece a una sola área. Eso mantiene el Compass afilado y evita el contenido «encaja en todas partes».', fr: "Chaque source, habitude et ARC appartient à un seul domaine. Cela garde le Compass net et évite le contenu « utile partout ».", it: 'Ogni fonte, abitudine e ARC appartiene a una sola area. Così il Compass resta nitido e si evitano contenuti «buoni per tutto».' },

    'a1.h': { de: 'Body', en: 'Body', es: 'Cuerpo', fr: 'Corps', it: 'Corpo' },
    'a1.d': { de: 'Ausdauer, Kraft, Mobility, Schlaf, Ernährung, Recovery.', en: 'Endurance, strength, mobility, sleep, nutrition, recovery.', es: 'Resistencia, fuerza, movilidad, sueño, nutrición, recuperación.', fr: 'Endurance, force, mobilité, sommeil, nutrition, récupération.', it: 'Resistenza, forza, mobilità, sonno, nutrizione, recupero.' },
    'a1.q': { de: 'Was trägt dich durch dein Leben?', en: 'What carries you through your life?', es: '¿Qué te sostiene en tu vida?', fr: 'Qu’est-ce qui vous porte à travers la vie ?', it: 'Cosa ti porta avanti nella vita?' },

    'a2.h': { de: 'Mind', en: 'Mind', es: 'Mente', fr: 'Esprit', it: 'Mente' },
    'a2.d': { de: 'Meditation, Fokus, Stress-Regulation, Resilienz.', en: 'Meditation, focus, stress regulation, resilience.', es: 'Meditación, foco, regulación del estrés, resiliencia.', fr: 'Méditation, concentration, régulation du stress, résilience.', it: 'Meditazione, focus, regolazione dello stress, resilienza.' },
    'a2.q': { de: 'Wer bist du, wenn es leise wird?', en: 'Who are you when it gets quiet?', es: '¿Quién eres cuando se hace el silencio?', fr: 'Qui êtes-vous quand le silence se fait ?', it: 'Chi sei quando cala il silenzio?' },

    'a3.h': { de: 'Growth', en: 'Growth', es: 'Crecimiento', fr: 'Croissance', it: 'Crescita' },
    'a3.d': { de: 'Lesen, Lernen, Deep Work, Karriere, Finanzen.', en: 'Reading, learning, deep work, career, finance.', es: 'Lectura, aprendizaje, deep work, carrera, finanzas.', fr: 'Lecture, apprentissage, deep work, carrière, finances.', it: 'Lettura, apprendimento, deep work, carriera, finanze.' },
    'a3.q': { de: 'Was lernst du, das dich verändert?', en: 'What are you learning that changes you?', es: '¿Qué aprendes que te transforma?', fr: "Qu'apprenez-vous qui vous transforme ?", it: 'Cosa stai imparando che ti trasforma?' },

    'a4.h': { de: 'Relationships', en: 'Relationships', es: 'Relaciones', fr: 'Relations', it: 'Relazioni' },
    'a4.d': { de: 'Partnerschaft, Familie, Freunde, Netzwerk, Repair.', en: 'Partnership, family, friends, network, repair.', es: 'Pareja, familia, amigos, red, reparación.', fr: 'Couple, famille, amis, réseau, réparation.', it: 'Coppia, famiglia, amici, rete, riparazione.' },
    'a4.q': { de: 'Wer steht dir wirklich nahe?', en: 'Who is really close to you?', es: '¿Quién está realmente cerca de ti?', fr: 'Qui te tient vraiment à cœur ?', it: 'Chi ti è davvero vicino?' },

    'a5.h': { de: 'Leisure', en: 'Leisure', es: 'Ocio', fr: 'Loisirs', it: 'Tempo libero' },
    'a5.d': { de: 'Hobbys, Natur, Kreativität, Spiel, Digital Detox.', en: 'Hobbies, nature, creativity, play, digital detox.', es: 'Aficiones, naturaleza, creatividad, juego, detox digital.', fr: 'Loisirs, nature, créativité, jeu, détox numérique.', it: 'Hobby, natura, creatività, gioco, detox digitale.' },
    'a5.q': { de: 'Was tust du, wenn niemand zusieht?', en: 'What do you do when nobody is watching?', es: '¿Qué haces cuando nadie mira?', fr: 'Que faites-vous quand personne ne regarde ?', it: 'Cosa fai quando nessuno guarda?' },

    // ─── COMPARE ─────────────────────────────────────────
    'cmp.over': { de: 'Der Unterschied', en: 'The difference', es: 'La diferencia', fr: 'La différence', it: 'La differenza' },
    'cmp.h':    { de: 'Echte Werte,<br />kein Abhaken.', en: 'Real values,<br />not box-ticking.', es: 'Valores reales,<br />nada de casillas.', fr: 'De vraies valeurs,<br />pas de cases à cocher.', it: 'Valori veri,<br />niente spunte.' },
    'cmp.sub':  { de: 'Andere fragen: „Hast du heute Sport gemacht?" ArcUp fragt: „Wie viele Kilometer? Wie viele Minuten? Wie schnell?" — und alles, was du einträgst, bleibt messbar.', en: 'Others ask: "Did you do sport today?" ArcUp asks: "How many kilometres? How many minutes? How fast?" — and every value you log stays measurable later on.', es: 'Otros preguntan: «¿Hiciste deporte hoy?» ArcUp pregunta: «¿Cuántos kilómetros? ¿Cuántos minutos? ¿A qué velocidad?» — y cada valor que registras sigue siendo medible después.', fr: 'Les autres demandent « t’as fait du sport aujourd’hui ? » ArcUp demande « combien de kilomètres ? combien de minutes ? à quelle vitesse ? » — et chaque valeur saisie reste mesurable plus tard.', it: 'Gli altri chiedono: «Hai fatto sport oggi?» ArcUp chiede: «Quanti chilometri? Quanti minuti? A che velocità?» — e ogni valore inserito resta misurabile in seguito.' },

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
    'not.over': { de: 'Was wir bewusst weggelassen haben', en: 'What we deliberately left out', es: 'Lo que dejamos fuera a propósito', fr: 'Ce que nous avons volontairement laissé de côté', it: 'Ciò che abbiamo lasciato fuori di proposito' },
    'not.h':    { de: 'Was ArcUp <em>nicht</em> ist.', en: 'What ArcUp is <em>not</em>.', es: 'Lo que ArcUp <em>no</em> es.', fr: "Ce qu’ArcUp <em>n'est pas</em>.", it: 'Cosa ArcUp <em>non</em> è.' },
    'not.sub':  { de: 'Genauso wichtig wie die Features: was nicht in der App ist — und warum.', en: 'Just as important as the features: what is not in the app — and why.', es: 'Tan importante como las funciones: lo que no está en la app — y por qué.', fr: "Aussi important que les fonctionnalités : ce qui n'est pas dans l'app — et pourquoi.", it: 'Importante quanto le funzioni: ciò che non c’è nell’app — e perché.' },

    'not1.h': { de: 'Kein To-Do-Manager.', en: 'Not a to-do manager.', es: 'No es un gestor de tareas.', fr: 'Pas un gestionnaire de tâches.', it: 'Non è un gestore di to-do.' },
    'not1.b': { de: 'Gewohnheiten sind keine Aufgaben mit Deadline. Ziele haben einen eigenen Platz.', en: 'Habits are not deadlined tasks. Goals have their own place.', es: 'Los hábitos no son tareas con fecha. Las metas tienen su propio lugar.', fr: 'Les habitudes ne sont pas des tâches à échéance. Les objectifs ont leur propre espace.', it: 'Le abitudini non sono task con scadenza. Gli obiettivi hanno il loro spazio.' },

    'not2.h': { de: 'Kein generischer Gewohnheits-Tracker.', en: 'Not a generic habit tracker.', es: 'No es un tracker de hábitos genérico.', fr: 'Pas un tracker d’habitudes générique.', it: 'Non è un tracker di abitudini generico.' },
    'not2.b': { de: 'Nicht „heute Sport gemacht ja/nein". Sondern „heute 5,2 km gelaufen". Numerisch, immer.', en: 'Not "did sport today yes/no". But "ran 5.2 km today". Numeric, always.', es: 'No «hice deporte sí/no». Sino «corrí 5,2 km hoy». Numérico, siempre.', fr: "Pas « fait du sport oui/non ». Mais « couru 5,2 km aujourd'hui ». Chiffré, toujours.", it: 'Non «fatto sport sì/no». Ma «corsi 5,2 km oggi». Numerico, sempre.' },

    'not3.h': { de: 'Kein Social Network.', en: 'Not a social network.', es: 'No es una red social.', fr: 'Pas un réseau social.', it: 'Non è un social network.' },
    'not3.b': { de: 'Keine Follower, keine Likes, keine Posts. Deine Insights sind privat.', en: 'No followers, no likes, no posts. Your insights are private.', es: 'Sin seguidores, sin likes, sin publicaciones. Tus insights son privados.', fr: 'Pas de followers, de likes, ni de posts. Vos insights sont privés.', it: 'Niente follower, like o post. I tuoi insights sono privati.' },

    'not4.h': { de: 'Kein Streak um jeden Preis.', en: 'No streak at any cost.', es: 'No racha a cualquier precio.', fr: 'Pas de série à tout prix.', it: 'Niente streak a tutti i costi.' },
    'not4.b': { de: 'Streaks gibt es, aber Rest-Days sind eingebaut. Es gibt keine Streak-Shields.', en: 'Streaks exist, but rest days are built in. No streak shields.', es: 'Hay rachas, pero los días de descanso están integrados. Sin escudos de racha.', fr: 'Les séries existent, mais les jours de repos sont prévus. Pas de « boucliers de série ».', it: 'Le streak ci sono, ma i giorni di riposo sono integrati. Niente streak shield.' },

    'not5.h': { de: 'Kein Vendor-Lock-in.', en: 'No vendor lock-in.', es: 'Sin vendor lock-in.', fr: 'Pas de vendor lock-in.', it: 'Nessun vendor lock-in.' },
    'not5.b': { de: 'Voller ZIP-Export deiner Daten jederzeit. Konto-Reset und -Löschung mit einem Tap. Deine Daten gehören dir.', en: 'Full ZIP export of your data any time. Account reset and deletion with one tap. Your data is yours.', es: 'Exportación ZIP completa de tus datos cuando quieras. Reset y eliminación de cuenta con un toque. Tus datos son tuyos.', fr: "Export ZIP complet de tes données à tout moment. Réinitialisation et suppression du compte en un tap. Tes données t’appartiennent.", it: 'Export ZIP completo dei tuoi dati in qualsiasi momento. Reset e cancellazione account con un tap. I tuoi dati sono tuoi.' },

    'not6.h': { de: 'Kein Dark Pattern.', en: 'No dark patterns.', es: 'Sin dark patterns.', fr: 'Pas de dark patterns.', it: 'Niente dark pattern.' },
    'not6.b': { de: 'Keine Werbung, keine Tracker, kein Notification-Spam. EU-Hosting, DSGVO.', en: 'No ads, no trackers, no notification spam. EU hosting, GDPR.', es: 'Sin anuncios, sin rastreadores, sin spam de notificaciones. Hosting UE, RGPD.', fr: 'Pas de pub, pas de trackers, pas de spam de notifications. Hébergement UE, RGPD.', it: 'Niente pubblicità, niente tracker, niente spam di notifiche. Hosting UE, GDPR.' },

    // ─── FOUNDER NOTE ────────────────────────────────────
    'founder.over': { de: 'Hinter ArcUp', en: 'Behind ArcUp', es: 'Detrás de ArcUp', fr: 'Derrière ArcUp', it: 'Dietro ad ArcUp' },
    'founder.h':    { de: 'Hi, ich bin Michael.', en: 'Hi, I’m Michael.', es: 'Hola, soy Michael.', fr: 'Salut, je suis Michael.', it: 'Ciao, sono Michael.' },
    'founder.b1':   { de: 'ArcUp ist mein Versuch, ein System für persönliche Entwicklung zu bauen, das hält, was es verspricht — strukturiert, numerisch, durchdacht. Kein Streak-Casino, kein Social-Feed, kein Notification-Spam.', en: 'ArcUp is my attempt to build a personal-development system that means what it says — structured, numeric, considered. No streak casino, no social feed, no notification spam.', es: 'ArcUp es mi intento de construir un sistema de desarrollo personal que cumple lo que promete — estructurado, numérico, pensado. Sin casino de rachas, sin feed social, sin spam de notificaciones.', fr: "ArcUp est ma tentative de construire un système de développement personnel qui tient vraiment ses promesses — structuré, chiffré, réfléchi. Pas de casino de séries, pas de fil social, pas de spam de notifications.", it: 'ArcUp è il mio tentativo di costruire un sistema di sviluppo personale che mantiene quel che promette — strutturato, numerico, ragionato. Niente casinò di streak, niente feed social, niente spam di notifiche.' },
    'founder.b2':   { de: 'Solo gebaut, in Österreich. Kein VC, keine Werbung, keine Tracker. Wenn dir etwas fehlt oder du einen Bug findest: das Feedback-Formular in der App landet direkt bei mir.', en: 'Built solo, in Austria. No VC, no ads, no trackers. If something is missing or you find a bug, the feedback form in the app lands straight in my inbox.', es: 'Construido en solitario, en Austria. Sin VC, sin anuncios, sin rastreadores. Si te falta algo o encuentras un bug, el formulario de feedback en la app me llega directamente.', fr: "Construit en solo, en Autriche. Pas de VC, pas de pub, pas de trackers. S'il te manque quelque chose ou si tu trouves un bug, le formulaire de feedback dans l'app arrive directement chez moi.", it: 'Costruito da solo, in Austria. Niente VC, niente pubblicità, niente tracker. Se ti manca qualcosa o trovi un bug, il modulo di feedback nell’app arriva direttamente da me.' },

    // ─── PRICING ─────────────────────────────────────────
    'pr.over': { de: 'Was es kostet', en: 'What it costs', es: 'Cuánto cuesta', fr: 'Le prix', it: 'Quanto costa' },
    'pr.h':    { de: 'Free oder Pro. Du entscheidest.', en: 'Free or Pro. You decide.', es: 'Free o Pro. Tú decides.', fr: 'Free ou Pro. À vous de choisir.', it: 'Free o Pro. Decidi tu.' },
    'pr.sub':  { de: 'Alle Kernfunktionen sind kostenlos. Pro schaltet die Tiefe frei — mehrere parallele ARCs, Insights mit Gewohnheits-Korrelationen, Tagebuch, Ziele und KI-Generator.', en: 'All core features are free. Pro unlocks the depth — multiple parallel ARCs, Insights with habit correlations, Journal, Goals and AI generator.', es: 'Las funciones esenciales son gratis. Pro desbloquea la profundidad — varios ARCs en paralelo, Insights con correlaciones, Diario, Metas y generador IA.', fr: "Toutes les fonctions essentielles sont gratuites. Pro débloque la profondeur — plusieurs ARC en parallèle, Insights avec corrélations, Journal, Objectifs et générateur IA.", it: "Tutte le funzioni principali sono gratis. Pro sblocca la profondità — più ARC in parallelo, Insights con correlazioni, Diario, Obiettivi e generatore IA." },

    // Feature labels — mirrored 1:1 from the app's subscription screen (src/locales/*.ts → subscription.features.*)
    'pf.oneActiveArc':   { de: 'Ein aktiver ARC',              en: 'One active ARC',              es: 'Un ARC activo',               fr: 'Un ARC actif',               it: 'Un ARC attivo' },
    'pf.evidenceBasedHabits': { de: 'Fundierte Gewohnheiten',  en: 'Evidence-Based Habits',       es: 'Hábitos fundamentados',       fr: 'Habitudes fondées',          it: 'Abitudini fondate' },
    'pf.lifeAreas':      { de: 'Lebensbereiche &amp; Vision',   en: 'Life Areas &amp; Vision',     es: 'Áreas de vida y Visión',      fr: 'Domaines de vie &amp; Vision', it: 'Aree di vita e Visione' },
    'pf.lessons':        { de: 'Lerninhalte',                   en: 'Lessons',                     es: 'Contenidos de aprendizaje',   fr: "Contenus d'apprentissage",   it: 'Contenuti di apprendimento' },
    'pf.shareResults':   { de: 'Erfolge teilen',                en: 'Share Results',               es: 'Compartir resultados',        fr: 'Partager les résultats',     it: 'Condividi i risultati' },
    'pf.multipleArcs':   { de: 'Mehrere aktive ARCs',           en: 'Multiple Active ARCs',        es: 'Varios ARCs activos',         fr: 'Plusieurs ARCs actifs',      it: 'Più ARC attivi' },
    'pf.premiumContent': { de: 'Premium-Inhalte',               en: 'Premium Content',             es: 'Contenido Premium',           fr: 'Contenu Premium',            it: 'Contenuto Premium' },
    'pf.insights':       { de: 'Insights',                       en: 'Insights',                    es: 'Insights',                    fr: 'Insights',                   it: 'Insights' },
    'pf.goalTracking':   { de: 'Ziel-Tracking',                 en: 'Goal Tracking',               es: 'Seguimiento de objetivos',    fr: 'Suivi des objectifs',        it: 'Tracciamento obiettivi' },
    'pf.journaling':     { de: 'Tagebuch schreiben',           en: 'Journaling',                  es: 'Diario',                      fr: 'Journal',                    it: 'Diario' },
    'pf.customArcs':     { de: 'Eigene ARCs',                   en: 'Custom ARCs',                 es: 'ARCs personalizados',         fr: 'ARCs personnalisés',         it: 'ARC personalizzati' },
    'pf.customHabits':   { de: 'Eigene Gewohnheiten',          en: 'Custom Habits',               es: 'Hábitos personalizados',      fr: 'Habitudes personnalisées',   it: 'Abitudini personalizzate' },
    'pf.aiGenerator':    { de: 'KI-Generator für ARCs',         en: 'AI ARC Generator',            es: 'Generador IA de ARCs',        fr: "Générateur IA d'ARCs",       it: 'Generatore IA di ARC' },

    'pr.free.name':  { de: 'Free', en: 'Free', es: 'Free', fr: 'Free', it: 'Free' },
    'pr.free.tag':   { de: 'Für immer kostenlos.', en: 'Free forever.', es: 'Gratis para siempre.', fr: 'Gratuit pour toujours.', it: 'Gratis per sempre.' },
    'pr.free.cta':   { de: 'Kostenlos starten', en: 'Start for free', es: 'Empezar gratis', fr: 'Commencer gratuitement', it: 'Inizia gratis' },

    'pr.pro.flag':            { de: 'Pro', en: 'Pro', es: 'Pro', fr: 'Pro', it: 'Pro' },
    'pr.pro.name':            { de: 'Pro', en: 'Pro', es: 'Pro', fr: 'Pro', it: 'Pro' },
    'pr.pro.tag':             { de: 'Alle Features. Drei Wege, Pro zu bekommen.', en: 'All features. Three ways to get Pro.', es: 'Todas las funciones. Tres formas de obtener Pro.', fr: 'Toutes les fonctions. Trois façons d’obtenir Pro.', it: 'Tutte le funzioni. Tre modi per ottenere Pro.' },
    'pr.pro.monthly.unit':    { de: '/ Monat', en: '/ month', es: '/ mes', fr: '/ mois', it: '/ mese' },
    'pr.pro.monthly.label':   { de: 'monatlich · jederzeit kündbar', en: 'monthly · cancel any time', es: 'mensual · cancela cuando quieras', fr: 'mensuel · résiliable à tout moment', it: 'mensile · cancellabile in qualsiasi momento' },
    'pr.pro.yearly.unit':     { de: '/ Jahr', en: '/ year', es: '/ año', fr: '/ an', it: '/ anno' },
    'pr.pro.yearly.label':    { de: 'jährlich · spart ca. 40 %', en: 'yearly · saves about 40%', es: 'anual · ahorra ~40 %', fr: 'annuel · économise environ 40 %', it: 'annuale · risparmia circa il 40 %' },
    'pr.pro.lifetime.unit':   { de: 'einmalig', en: 'one-time', es: 'pago único', fr: 'paiement unique', it: 'una tantum' },
    'pr.pro.lifetime.label':  { de: 'Lifetime · unbegrenzt', en: 'Lifetime · unlimited', es: 'Lifetime · ilimitado', fr: 'Lifetime · illimité', it: 'Lifetime · illimitato' },
    'pr.pro.cta':             { de: 'Pro holen', en: 'Get Pro', es: 'Obtener Pro', fr: 'Obtenir Pro', it: 'Ottieni Pro' },


    // ─── FAQ ─────────────────────────────────────────────
    'faq.over': { de: 'FAQ', en: 'FAQ', es: 'FAQ', fr: 'FAQ', it: 'FAQ' },
    'faq.h':    { de: 'Häufige Fragen.', en: 'Frequently asked questions.', es: 'Preguntas frecuentes.', fr: 'Questions fréquentes.', it: 'Domande frequenti.' },
    // Old faq1–faq12 keys removed — replaced by faq01–faq40 (see FAQ v2 section below).

    // ─── CTA ─────────────────────────────────────────────
    'cta.h':   { de: 'Starte einen <em>ARC</em>,<br />keinen Vorsatz.', en: 'Start an <em>ARC</em>,<br />not a resolution.', es: 'Empieza un <em>ARC</em>,<br />no un propósito.', fr: 'Lancez un <em>ARC</em>,<br />pas une résolution.', it: 'Lancia un <em>ARC</em>,<br />non un buon proposito.' },
    'cta.sub': { de: 'Hör auf, Häkchen zu sammeln. Fang an, dich wirklich zu sehen.', en: 'Stop collecting checkmarks. Start seeing yourself for real.', es: 'Deja de coleccionar casillas. Empieza a verte de verdad.', fr: 'Arrête de collectionner les cases cochées. Commence à te voir vraiment.', it: 'Smetti di collezionare spunte. Inizia a vederti davvero.' },
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
      de: 'Antworten auf die Fragen, die uns am häufigsten zu Gewohnheiten, ARCs, den Lerninhalten, Pricing und Datenschutz gestellt werden.',
      en: 'Answers to the questions we get asked most about habits, ARCs, Learning Content, pricing and privacy.',
      es: 'Respuestas a las preguntas más frecuentes sobre hábitos, ARCs, los contenidos de aprendizaje, precios y privacidad.',
      fr: "Réponses aux questions qu'on nous pose le plus souvent sur les habitudes, les ARC, les contenus d'apprentissage, les tarifs et la confidentialité.",
      it: 'Risposte alle domande più frequenti su abitudini, ARC, contenuti di apprendimento, prezzi e privacy.',
    },
    'faq.legalHint': {
      de: 'Du suchst rechtliche Informationen?',
      en: 'Looking for legal information?',
      es: '¿Buscas información legal?',
      fr: 'Vous cherchez des informations légales ?',
      it: 'Cerchi informazioni legali?',
    },
    'faq.allCta': {
      de: 'Alle 26 Fragen ansehen →',
      en: 'See all 26 questions →',
      es: 'Ver las 26 preguntas →',
      fr: 'Voir les 26 questions →',
      it: 'Vedi tutte le 26 domande →',
    },

    // ─── FAQ v2 — SECTION LABELS ─────────────────────────
    'faqs.basics':     { de: 'Grundlagen', en: 'Basics', es: 'Conceptos básicos', fr: 'Notions de base', it: 'Nozioni di base' },
    'faqs.arcsHabits': { de: 'ARCs &amp; Gewohnheiten im Detail', en: 'ARCs &amp; habits in detail', es: 'ARCs y hábitos en detalle', fr: 'ARC et habitudes en détail', it: 'ARC e abitudini in dettaglio' },
    'faqs.tracking':   { de: 'Tracking &amp; Logging', en: 'Tracking &amp; logging', es: 'Seguimiento y registro', fr: 'Suivi et journal', it: 'Tracciamento e log' },
    'faqs.streaks':    { de: 'Streaks &amp; Rest Days', en: 'Streaks &amp; rest days', es: 'Rachas y días de descanso', fr: 'Streaks et jours de repos', it: 'Streak e giorni di riposo' },
    'faqs.library':    { de: 'Lerninhalte', en: 'Learning Content', es: 'Contenidos de aprendizaje', fr: "Contenus d'apprentissage", it: 'Contenuti di apprendimento' },
    'faqs.freePro':    { de: 'Free vs Pro', en: 'Free vs Pro', es: 'Free vs Pro', fr: 'Free vs Pro', it: 'Free vs Pro' },
    'faqs.insights':   { de: 'Insights &amp; Reflexion', en: 'Insights &amp; reflection', es: 'Insights y reflexión', fr: 'Insights et réflexion', it: 'Insights e riflessione' },
    'faqs.privacy':    { de: 'Daten &amp; Datenschutz', en: 'Data &amp; privacy', es: 'Datos y privacidad', fr: 'Données et confidentialité', it: 'Dati e privacy' },

    // ─── FAQ v2 — 01–10 (Basics, ARCs & Habits) ──────────
    'faq03.q': { de: 'Was ist ein ARC?', en: 'What is an ARC?', es: '¿Qué es un ARC?', fr: "Qu'est-ce qu'un ARC ?", it: "Cos'è un ARC?" },
    'faq03.a': {
      de: 'Ein ARC ist eine <strong>zeitlich begrenzte Challenge</strong> von 1 bis 12 Wochen, die mehrere Gewohnheiten zu einem fokussierten Vorhaben bündelt – zum Beispiel „Tiefer schlafen in 4 Wochen" oder „30 Tage Atem-Reset". Jeder ARC hat ein klares Versprechen, eine Theorie (das <em>Warum</em>), praktische Tipps (das <em>Wie</em>) und 3–6 konkrete Gewohnheiten mit individuellen Zielen. ARCs haben einen Anfang und ein Ende – im Gegensatz zu endlosen Tracking-Streaks.',
      en: 'An ARC is a <strong>time-boxed challenge</strong> of 1 to 12 weeks that bundles several habits into one focused project — for example "Sleep deeper in 4 weeks" or "30-day breath reset". Every ARC has a clear promise, a theory (the <em>why</em>), practical tips (the <em>how</em>) and 3–6 concrete habits with individual targets. ARCs have a start and an end — unlike endless tracking streaks.',
      es: 'Un ARC es un <strong>reto limitado en el tiempo</strong> de 1 a 12 semanas que agrupa varios hábitos en un proyecto enfocado — por ejemplo «Dormir mejor en 4 semanas» o «30 días de reset de respiración». Cada ARC tiene una promesa clara, una teoría (el <em>porqué</em>), consejos prácticos (el <em>cómo</em>) y de 3 a 6 hábitos concretos con objetivos individuales. Los ARCs tienen inicio y final — a diferencia de las rachas infinitas.',
      fr: "Un ARC est un <strong>défi limité dans le temps</strong> de 1 à 12 semaines qui regroupe plusieurs habitudes dans un projet focalisé — par exemple « Mieux dormir en 4 semaines » ou « 30 jours de reset respiration ». Chaque ARC a une promesse claire, une théorie (le <em>pourquoi</em>), des conseils pratiques (le <em>comment</em>) et de 3 à 6 habitudes concrètes avec des objectifs individuels. Les ARC ont un début et une fin — contrairement aux séries infinies.",
      it: "Un ARC è una <strong>sfida a tempo limitato</strong> di 1 a 12 settimane che riunisce più abitudini in un progetto focalizzato — per esempio «Dormire meglio in 4 settimane» o «30 giorni di reset del respiro». Ogni ARC ha una promessa chiara, una teoria (il <em>perché</em>), consigli pratici (il <em>come</em>) e 3–6 abitudini concrete con obiettivi individuali. Gli ARC hanno un inizio e una fine — a differenza degli streak infiniti.",
    },
    'faq04.q': { de: 'Was sind die fünf Life Areas?', en: 'What are the five life areas?', es: '¿Cuáles son las cinco life areas?', fr: 'Quelles sont les cinq life areas ?', it: 'Quali sono le cinque life area?' },
    'faq04.a': {
      de: 'ArcUp arbeitet mit genau fünf Lebensbereichen:<ul><li><strong>Body</strong> – Sport, Schlaf, Ernährung, Recovery</li><li><strong>Mind</strong> – Meditation, Achtsamkeit, Stress-Regulation</li><li><strong>Growth</strong> – Lernen, Lesen, Karriere, Ziele</li><li><strong>Relationships</strong> – Quality Time, Active Listening, Familienrituale</li><li><strong>Leisure</strong> – Hobbys, Naturzeit, kreative Aktivitäten</li></ul>Du bewertest jeden Bereich regelmäßig auf einer Skala von 1–10 (Wheel of Life), schreibst eine persönliche Vision dazu und siehst auf einen Blick, wo gerade die Balance fehlt.',
      en: 'ArcUp works with exactly five life areas:<ul><li><strong>Body</strong> — sport, sleep, nutrition, recovery</li><li><strong>Mind</strong> — meditation, mindfulness, stress regulation</li><li><strong>Growth</strong> — learning, reading, career, goal setting</li><li><strong>Relationships</strong> — quality time, active listening, family rituals</li><li><strong>Leisure</strong> — hobbies, time in nature, creative activities</li></ul>You rate each area regularly on a scale of 1–10 (Wheel of Life), write a personal vision and see at a glance where balance is missing.',
      es: 'ArcUp trabaja con exactamente cinco áreas de vida:<ul><li><strong>Body</strong> — deporte, sueño, nutrición, recuperación</li><li><strong>Mind</strong> — meditación, atención plena, regulación del estrés</li><li><strong>Growth</strong> — aprendizaje, lectura, carrera, metas</li><li><strong>Relationships</strong> — tiempo de calidad, escucha activa, rituales familiares</li><li><strong>Leisure</strong> — aficiones, naturaleza, actividades creativas</li></ul>Puntúas cada área regularmente del 1 al 10 (Wheel of Life), escribes una visión personal y ves de un vistazo dónde falta equilibrio.',
      fr: "ArcUp s'appuie sur exactement cinq domaines de vie :<ul><li><strong>Body</strong> — sport, sommeil, nutrition, récupération</li><li><strong>Mind</strong> — méditation, pleine conscience, gestion du stress</li><li><strong>Growth</strong> — apprentissage, lecture, carrière, objectifs</li><li><strong>Relationships</strong> — temps de qualité, écoute active, rituels familiaux</li><li><strong>Leisure</strong> — loisirs, nature, activités créatives</li></ul>Tu notes chaque domaine régulièrement de 1 à 10 (Wheel of Life), tu écris une vision personnelle et tu vois d'un coup d'œil où l'équilibre manque.",
      it: 'ArcUp lavora con esattamente cinque aree di vita:<ul><li><strong>Body</strong> — sport, sonno, nutrizione, recupero</li><li><strong>Mind</strong> — meditazione, mindfulness, regolazione dello stress</li><li><strong>Growth</strong> — apprendimento, lettura, carriera, obiettivi</li><li><strong>Relationships</strong> — tempo di qualità, ascolto attivo, rituali familiari</li><li><strong>Leisure</strong> — hobby, natura, attività creative</li></ul>Valuti ogni area regolarmente da 1 a 10 (Wheel of Life), scrivi una visione personale e vedi a colpo d’occhio dove manca equilibrio.',
    },
    'faq06.q': { de: 'Wie unterscheiden sich Gewohnheiten, ARCs und Ziele?', en: 'What is the difference between habits, ARCs and goals?', es: '¿En qué se diferencian hábitos, ARCs y objetivos?', fr: 'Quelle est la différence entre habitudes, ARC et objectifs ?', it: 'Qual è la differenza tra abitudini, ARC e obiettivi?' },
    'faq06.a': {
      de: '<ul><li><strong>Gewohnheiten</strong> sind die atomaren, messbaren Einheiten – z. B. „Laufen in km".</li><li><strong>ARCs</strong> bündeln Gewohnheiten zu einer zeitlich begrenzten Challenge mit konkreten Zielwerten.</li><li><strong>Ziele</strong> sind separate, einmalige Vorhaben mit Fälligkeitsdatum („Bis Ende Mai 5 km am Stück laufen") und gehören zum jeweiligen Lebensbereich.</li></ul>Ziele sind Aufgaben mit Deadline. Gewohnheiten sind die Messskala, auf der dein Verhalten sichtbar wird.',
      en: '<ul><li><strong>Habits</strong> are the atomic, measurable units — e.g. "running in km".</li><li><strong>ARCs</strong> bundle habits into a time-boxed challenge with concrete targets.</li><li><strong>Goals</strong> are separate, one-off projects with a due date ("Run 5 km in one go by end of May") and live inside their life area.</li></ul>Goals are tasks with deadlines. Habits are the scale on which your behaviour becomes visible.',
      es: '<ul><li><strong>Hábitos</strong> son las unidades atómicas medibles — por ejemplo «correr en km».</li><li><strong>ARCs</strong> agrupan hábitos en un reto limitado en el tiempo con objetivos concretos.</li><li><strong>Objetivos</strong> son proyectos separados, únicos, con fecha límite («Correr 5 km de un tirón antes de fin de mayo») y pertenecen a su área de vida.</li></ul>Los objetivos son tareas con fecha. Los hábitos son la escala en la que se hace visible tu comportamiento.',
      fr: "<ul><li><strong>Habitudes</strong> sont les unités atomiques, mesurables — par exemple « course en km ».</li><li><strong>ARC</strong> regroupent des habitudes dans un défi limité dans le temps avec des objectifs concrets.</li><li><strong>Objectifs</strong> sont des projets séparés et ponctuels avec une échéance (« Courir 5 km d'une traite d'ici fin mai ») et vivent dans leur domaine de vie.</li></ul>Les objectifs sont des tâches avec date butoir. Les habitudes sont l'échelle sur laquelle ton comportement devient visible.",
      it: '<ul><li><strong>Abitudini</strong> sono le unità atomiche misurabili — es. «corsa in km».</li><li><strong>ARC</strong> riuniscono abitudini in una sfida a tempo limitato con obiettivi concreti.</li><li><strong>Obiettivi</strong> sono progetti separati e una tantum con scadenza («Correre 5 km filati entro fine maggio») e vivono nella loro area di vita.</li></ul>Gli obiettivi sono compiti con scadenza. Le abitudini sono la scala su cui il tuo comportamento diventa visibile.',
    },
    'faq08.q': { de: 'Was bedeutet „Above" und „Below" bei einer Gewohnheit?', en: 'What do "Above" and "Below" mean for a habit?', es: '¿Qué significan «Above» y «Below» en un hábito?', fr: 'Que signifient « Above » et « Below » pour une habitude ?', it: 'Cosa significano «Above» e «Below» per un’abitudine?' },
    'faq08.a': {
      de: '<ul><li><strong>≥ (Above):</strong> Der Zielwert ist eine Untergrenze – du erreichst ihn, wenn dein Wert ihn trifft oder überschreitet. Beispiel: 10.000 Schritte.</li><li><strong>≤ (Below):</strong> Der Zielwert ist eine Obergrenze – du erreichst ihn, wenn dein Wert ihn nicht überschreitet. Beispiel: maximal 2 Stunden Bildschirmzeit.</li></ul>',
      en: '<ul><li><strong>≥ (Above):</strong> the target is a lower bound — you hit it when your value meets or exceeds it. Example: 10,000 steps.</li><li><strong>≤ (Below):</strong> the target is an upper bound — you hit it when your value doesn’t exceed it. Example: max. 2 hours of screen time.</li></ul>',
      es: '<ul><li><strong>≥ (Above):</strong> el objetivo es un límite inferior — lo alcanzas si tu valor lo iguala o supera. Ejemplo: 10.000 pasos.</li><li><strong>≤ (Below):</strong> el objetivo es un límite superior — lo alcanzas si tu valor no lo supera. Ejemplo: máximo 2 horas de pantalla.</li></ul>',
      fr: "<ul><li><strong>≥ (Above) :</strong> la cible est une limite basse — tu l'atteins si ta valeur l'égale ou la dépasse. Exemple : 10 000 pas.</li><li><strong>≤ (Below) :</strong> la cible est une limite haute — tu l'atteins si ta valeur ne la dépasse pas. Exemple : max. 2 h d'écran.</li></ul>",
      it: "<ul><li><strong>≥ (Above):</strong> l'obiettivo è un limite inferiore — lo raggiungi se il tuo valore lo eguaglia o lo supera. Esempio: 10.000 passi.</li><li><strong>≤ (Below):</strong> l'obiettivo è un limite superiore — lo raggiungi se il tuo valore non lo supera. Esempio: max. 2 ore di schermo.</li></ul>",
    },
    'faq09.q': { de: 'Was ist der Unterschied zwischen Daily- und Weekly-Gewohnheiten?', en: 'What is the difference between daily and weekly habits?', es: '¿Cuál es la diferencia entre hábitos diarios y semanales?', fr: 'Quelle est la différence entre habitudes quotidiennes et hebdomadaires ?', it: "Qual è la differenza tra abitudini giornaliere e settimanali?" },
    'faq09.a': {
      de: 'Daily-Gewohnheiten werden <strong>pro Tag</strong> geprüft (z. B. 10 min Meditation täglich). Weekly-Gewohnheiten akkumulieren <strong>über die ganze ARC-Woche</strong> (z. B. 3 Krafttrainings pro Woche). Bei Weekly-Gewohnheiten zählt jede Eintragung in die Wochensumme; das Ziel ist erreicht, sobald die Summe es trifft.',
      en: 'Daily habits are checked <strong>per day</strong> (e.g. 10 min meditation daily). Weekly habits accumulate <strong>over the whole ARC week</strong> (e.g. 3 strength sessions per week). With weekly habits, every entry adds to the weekly sum; the target is hit as soon as the sum reaches it.',
      es: 'Los hábitos diarios se evalúan <strong>por día</strong> (p. ej. 10 min de meditación al día). Los semanales se acumulan <strong>durante toda la semana del ARC</strong> (p. ej. 3 sesiones de fuerza por semana). En los semanales cada entrada suma al total; el objetivo se cumple cuando la suma lo alcanza.',
      fr: "Les habitudes quotidiennes sont vérifiées <strong>par jour</strong> (par ex. 10 min de méditation par jour). Les hebdomadaires s'accumulent <strong>sur toute la semaine de l'ARC</strong> (par ex. 3 séances de musculation par semaine). Pour les hebdomadaires, chaque saisie compte dans la somme hebdo ; la cible est atteinte dès que la somme l'atteint.",
      it: "Le abitudini giornaliere si verificano <strong>per giorno</strong> (es. 10 min di meditazione al giorno). Le settimanali si accumulano <strong>sull'intera settimana dell'ARC</strong> (es. 3 sessioni di forza a settimana). Nelle settimanali ogni inserimento conta nella somma; l'obiettivo è raggiunto appena la somma lo tocca.",
    },
    // ─── FAQ v2 — 11–20 (Multiple ARCs, Tracking, Streaks, Learning Content) ─
    'faq11.q': { de: 'Kann ich gleichzeitig mehrere ARCs aktiv haben?', en: 'Can I have multiple ARCs active at the same time?', es: '¿Puedo tener varios ARCs activos a la vez?', fr: 'Puis-je avoir plusieurs ARC actifs en même temps ?', it: 'Posso avere più ARC attivi contemporaneamente?' },
    'faq11.a': {
      de: 'Im <strong>Free-Tarif</strong> kannst du <strong>einen ARC</strong> gleichzeitig laufen lassen. Im <strong>Pro-Tarif</strong> sind parallele ARCs möglich. Achtung: Wenn zwei aktive ARCs dieselbe Gewohnheit mit unterschiedlicher Zielrichtung (einmal ≥, einmal ≤) verlangen, wird das Starten geblockt – das wäre ein logischer Widerspruch.',
      en: 'On the <strong>Free plan</strong> you can run <strong>one ARC</strong> at a time. On <strong>Pro</strong>, parallel ARCs are possible. Caveat: if two active ARCs require the same habit with opposite directions (once ≥, once ≤), starting is blocked — that would be a logical contradiction.',
      es: 'En el plan <strong>Free</strong> puedes tener <strong>un ARC</strong> activo a la vez. Con <strong>Pro</strong> son posibles varios en paralelo. Atención: si dos ARCs activos requieren el mismo hábito con direcciones opuestas (una ≥, otra ≤), el inicio se bloquea — sería una contradicción lógica.',
      fr: "Avec le plan <strong>Free</strong>, tu peux faire tourner <strong>un seul ARC</strong> à la fois. Avec <strong>Pro</strong>, plusieurs ARC en parallèle sont possibles. Attention : si deux ARC actifs demandent la même habitude avec des directions opposées (une fois ≥, une fois ≤), le démarrage est bloqué — ce serait une contradiction logique.",
      it: 'Nel piano <strong>Free</strong> puoi avere <strong>un ARC</strong> attivo alla volta. Con <strong>Pro</strong> sono possibili più ARC in parallelo. Attenzione: se due ARC attivi richiedono la stessa abitudine con direzioni opposte (una ≥, una ≤), l’avvio viene bloccato — sarebbe una contraddizione logica.',
    },

    'faq12.q': { de: 'Wie tracke ich meine Gewohnheiten?', en: 'How do I track my habits?', es: '¿Cómo registro mis hábitos?', fr: 'Comment suivre mes habitudes ?', it: 'Come traccio le mie abitudini?' },
    'faq12.a': {
      de: 'Du tippst auf den <strong>+ Track</strong>-Button auf dem Home-Screen und öffnest dein Logbook. Dort trägst du für jede aktive Gewohnheit den Wert des Tages ein – per Stepper oder Slider. Zusätzlich gibt es einen <strong>Timer</strong> (Stoppuhr oder Pomodoro), mit dem du Zeit-basierte Gewohnheiten live mitlaufen lassen kannst.',
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
    'faq14.q': { de: 'Was bedeutet die Prozentzahl bei jeder Gewohnheit?', en: 'What does the percentage on each habit mean?', es: '¿Qué significa el porcentaje en cada hábito?', fr: 'Que signifie le pourcentage sur chaque habitude ?', it: 'Cosa significa la percentuale su ogni abitudine?' },
    'faq14.a': {
      de: 'Das ist deine <strong>proportionale Completion</strong> für diesen Tag. Bei Above-Gewohnheiten: <code>Wert ÷ Ziel × 100</code>, gekappt bei 100 %. Hast du 7 von 10 Gläsern Wasser getrunken, sind das 70 %. Bei Below-Gewohnheiten ist die Logik binär – entweder unter dem Limit (100 %) oder darüber (0 %). Die Prozente der Gewohnheiten werden zur <strong>Daily Completion</strong> gemittelt.',
      en: 'That’s your <strong>proportional completion</strong> for the day. For Above habits: <code>value ÷ target × 100</code>, capped at 100 %. Drink 7 of 10 glasses of water → 70 %. For Below habits the logic is binary — either under the limit (100 %) or over it (0 %). The habit percentages average into your <strong>Daily Completion</strong>.',
      es: 'Es tu <strong>cumplimiento proporcional</strong> del día. Para hábitos Above: <code>valor ÷ objetivo × 100</code>, con tope al 100 %. Si bebiste 7 de 10 vasos de agua → 70 %. En hábitos Below la lógica es binaria — por debajo del límite (100 %) o por encima (0 %). Los porcentajes se promedian en la <strong>Daily Completion</strong>.',
      fr: "C'est ton <strong>achèvement proportionnel</strong> pour la journée. Pour les habitudes Above : <code>valeur ÷ cible × 100</code>, plafonné à 100 %. 7 verres d'eau sur 10 → 70 %. Pour les habitudes Below, la logique est binaire — soit sous la limite (100 %), soit au-dessus (0 %). Les pourcentages sont moyennés dans ta <strong>Daily Completion</strong>.",
      it: 'È il tuo <strong>completamento proporzionale</strong> della giornata. Per Above: <code>valore ÷ obiettivo × 100</code>, fino a 100 %. 7 bicchieri d’acqua su 10 → 70 %. Per Below la logica è binaria — sotto al limite (100 %) o sopra (0 %). Le percentuali si mediano nella <strong>Daily Completion</strong>.',
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
      de: 'Rest Days <strong>frieren deinen Streak ein</strong>, ohne ihn zu brechen. Du bekommst pro Woche ein selbst gewähltes Budget (z. B. 1–2 Tage). Du kannst sie manuell setzen oder sie werden automatisch verbraucht, wenn du nach einer Tracking-Pause wieder einsteigst. Nicht verbrauchte Rest Days verfallen am Wochenende – sie sind kein Konto, das du ansparst.',
      en: 'Rest days <strong>freeze your streak</strong> without breaking it. You get a self-chosen weekly budget (e.g. 1–2 days). Set them manually, or they’re consumed automatically when you resume after a logging gap. Unused rest days expire at the end of the week — they’re not an account you save up.',
      es: 'Los días de descanso <strong>congelan tu racha</strong> sin romperla. Tienes un presupuesto semanal a tu elección (p. ej. 1–2 días). Los configuras manualmente o se consumen automáticamente al volver tras un hueco. Los no usados caducan al final de la semana — no son una cuenta que acumulas.',
      fr: "Les jours de repos <strong>gèlent ta série</strong> sans la casser. Tu disposes d'un budget hebdomadaire que tu choisis (par ex. 1–2 jours). Tu les actives manuellement ou ils sont consommés automatiquement lorsque tu reprends après un trou. Les jours non utilisés expirent en fin de semaine — ce n'est pas un compte que tu accumules.",
      it: 'I giorni di riposo <strong>congelano lo streak</strong> senza romperlo. Hai un budget settimanale che scegli tu (es. 1–2 giorni). Li attivi manualmente o vengono consumati in automatico quando riprendi dopo un buco. Quelli non usati scadono a fine settimana — non sono un conto che accumuli.',
    },
    'faq19.q': { de: 'Was sind die Lerninhalte?', en: 'What is the Learning Content?', es: '¿Qué son los contenidos de aprendizaje?', fr: "Que sont les contenus d'apprentissage ?", it: 'Cosa sono i contenuti di apprendimento?' },
    'faq19.a': {
      de: 'Jeder ARC und jede Gewohnheit baut auf einer <strong>Wissensgrundlage</strong> auf. Die Lerninhalte sind durchgehend <strong>redaktionelle Eigenproduktionen von ArcUp</strong> zu etablierten, nicht urheberrechtlich geschützten Konzepten – etwa Zone-2-Cardio, Schlafhygiene oder Box-Breathing. Es wird <strong>kein fremder Buch- oder Artikeltext reproduziert</strong>: Jeder Beitrag ist in eigenen Worten verfasst (KI-gestützt erstellt und sichtbar gekennzeichnet) und in 4–8 Minuten lesbar. Du kannst die Lerninhalte direkt in der App lesen, durchsuchen, filtern und als Favoriten speichern – und siehst zu jedem, welche ARCs und Gewohnheiten darauf aufbauen.',
      en: 'Every ARC and every habit is built on a <strong>knowledge foundation</strong>. The learning content is entirely <strong>ArcUp’s own editorial work</strong> on established, non-copyrighted concepts — e.g. Zone-2 cardio, sleep hygiene or box breathing. <strong>No third-party book or article text is reproduced</strong>: every piece is written in our own words (created with AI support and visibly labelled) and readable in 4–8 minutes. You can read learning content directly in the app, search, filter and save it as favourites — and for each item you see which ARCs and habits build on it.',
      es: 'Cada ARC y cada hábito se apoya en una <strong>base de conocimiento</strong>. Los contenidos de aprendizaje son íntegramente <strong>producción editorial propia de ArcUp</strong> sobre conceptos establecidos y no protegidos por derechos de autor — p. ej. cardio Zona 2, higiene del sueño o box-breathing. <strong>No se reproduce ningún texto de libros o artículos de terceros</strong>: cada pieza está escrita con palabras propias (creada con apoyo de IA y marcada de forma visible) y se lee en 4–8 minutos. Puedes leer los contenidos directamente en la app, buscar, filtrar y guardarlos como favoritos — y para cada uno ves qué ARCs y hábitos se apoyan en él.',
      fr: "Chaque ARC et chaque habitude s'appuie sur une <strong>base de connaissance</strong>. Les contenus d'apprentissage sont intégralement une <strong>production éditoriale propre à ArcUp</strong> sur des concepts établis et non protégés par le droit d'auteur — par ex. cardio Zone 2, hygiène du sommeil ou box breathing. <strong>Aucun texte de livre ou d'article tiers n'est reproduit</strong> : chaque contenu est rédigé en mots propres (créé avec assistance IA et signalé visiblement) et lisible en 4–8 minutes. Tu peux lire les contenus directement dans l'app, chercher, filtrer et enregistrer en favoris — et pour chacun tu vois quels ARC et habitudes s'y appuient.",
      it: 'Ogni ARC e ogni abitudine si basa su una <strong>base di conoscenza</strong>. I contenuti di apprendimento sono interamente <strong>produzione editoriale propria di ArcUp</strong> su concetti consolidati e non protetti da copyright — es. cardio Zona 2, igiene del sonno o box breathing. <strong>Nessun testo di libri o articoli di terzi viene riprodotto</strong>: ogni contenuto è scritto con parole nostre (creato con supporto IA e segnalato in modo visibile) e leggibile in 4–8 minuti. Puoi leggere i contenuti direttamente nell’app, cercare, filtrare e salvarli nei preferiti — e per ognuno vedi quali ARC e abitudini si appoggiano su di esso.',
    },
    'faq21.q': { de: 'Was sind die Affiliate-Links bei den Lerninhalten?', en: 'What are the affiliate links in Learning Content?', es: '¿Qué son los enlaces de afiliado en los contenidos de aprendizaje?', fr: "Que sont les liens affiliés dans les contenus d'apprentissage ?", it: 'Cosa sono i link affiliati nei contenuti di apprendimento?' },
    'faq21.a': {
      de: 'Die Lerninhalte selbst sind ArcUp-eigene Texte. Stammt ein Konzept aus einem Buch, findest du im Abschnitt <strong>„Verwandte Empfehlungen"</strong> einen Empfehlungs-Link zum Originalwerk bei Amazon – wir reproduzieren das Buch nicht, wir verweisen nur darauf. Diese Links sind mit einem <strong>Sternchen (*)</strong> gekennzeichnet und transparent als Werbung ausgewiesen: <em>„Als Amazon-Partner verdient ArcUp an qualifizierten Käufen."</em> Du zahlst dadurch keinen Cent mehr, und Affiliate-Vergütungen beeinflussen unsere Empfehlungen nicht.',
      en: 'The learning content itself is ArcUp’s own writing. Where a concept comes from a book, the section <strong>"Related recommendations"</strong> links to the original work on Amazon — we don’t reproduce the book, we only point to it. These links are marked with an <strong>asterisk (*)</strong> and transparently labelled as advertising: <em>"As an Amazon Associate, ArcUp earns from qualifying purchases."</em> You don’t pay a cent more, and affiliate compensation does not influence our recommendations.',
      es: 'Los contenidos de aprendizaje son textos propios de ArcUp. Cuando un concepto proviene de un libro, en la sección <strong>«Recomendaciones relacionadas»</strong> encontrarás un enlace a la obra original en Amazon — no reproducimos el libro, solo remitimos a él. Estos enlaces están marcados con un <strong>asterisco (*)</strong> y señalados de forma transparente como publicidad: <em>«Como afiliado de Amazon, ArcUp obtiene ingresos por compras cualificadas.»</em> No pagas ni un céntimo más, y la comisión no influye en nuestras recomendaciones.',
      fr: "Les contenus d'apprentissage sont des textes propres à ArcUp. Lorsqu'un concept provient d'un livre, la section <strong>« Recommandations associées »</strong> renvoie vers l'œuvre originale sur Amazon — nous ne reproduisons pas le livre, nous y renvoyons seulement. Ces liens sont marqués d'un <strong>astérisque (*)</strong> et signalés de manière transparente comme publicité : <em>« En tant que partenaire Amazon, ArcUp est rémunéré pour les achats remplissant les conditions requises. »</em> Tu ne paies pas un centime de plus, et la rémunération n'influence pas nos recommandations.",
      it: 'I contenuti di apprendimento sono testi propri di ArcUp. Quando un concetto proviene da un libro, nella sezione <strong>«Raccomandazioni correlate»</strong> trovi un link all’opera originale su Amazon — non riproduciamo il libro, ci limitiamo a rimandarvi. Questi link sono marcati con un <strong>asterisco (*)</strong> e segnalati in modo trasparente come pubblicità: <em>«In qualità di affiliato Amazon, ArcUp riceve un guadagno dagli acquisti idonei.»</em> Non paghi un centesimo in più e la commissione non influenza i nostri consigli.',
    },

    'faq22.q': { de: 'Was ist im kostenlosen Tarif enthalten?', en: 'What’s included in the free plan?', es: '¿Qué incluye el plan gratuito?', fr: 'Qu’est-ce que le plan gratuit comprend ?', it: 'Cosa include il piano gratuito?' },
    'faq22.a': {
      de: 'Der <strong>Free-Tarif</strong> umfasst:<ul><li>Tracking aller Gewohnheiten aus der kuratierten Sammlung</li><li>Einen aktiven ARC gleichzeitig</li><li>Lebensbereiche mit Wheel of Life und Vision-Texten</li><li>Zugriff auf die Lerninhalte</li><li>Selbstbewertung (regelmäßige Updates pro Lebensbereich)</li></ul>',
      en: 'The <strong>Free plan</strong> includes:<ul><li>Tracking of all habits from the curated library</li><li>One active ARC at a time</li><li>Life areas with Wheel of Life and vision texts</li><li>Access to Learning Content</li><li>Self-assessments (rating updates per life area)</li></ul>',
      es: 'El plan <strong>Free</strong> incluye:<ul><li>Tracking de todos los hábitos de la biblioteca curada</li><li>Un ARC activo a la vez</li><li>Áreas de vida con Wheel of Life y textos de visión</li><li>Acceso a los contenidos de aprendizaje</li><li>Autoevaluaciones (actualizar puntuación por área)</li></ul>',
      fr: "Le plan <strong>Free</strong> comprend :<ul><li>Le suivi de toutes les habitudes de la bibliothèque sélectionnée</li><li>Un ARC actif à la fois</li><li>Les domaines de vie avec Wheel of Life et textes de vision</li><li>L'accès aux contenus d'apprentissage</li><li>Les auto-évaluations (mise à jour des notes par domaine de vie)</li></ul>",
      it: 'Il piano <strong>Free</strong> include:<ul><li>Tracciamento di tutte le abitudini della biblioteca curata</li><li>Un ARC attivo alla volta</li><li>Aree di vita con Wheel of Life e testi di visione</li><li>Accesso ai contenuti di apprendimento</li><li>Autovalutazioni (aggiornamento punteggi per area di vita)</li></ul>',
    },
    'faq23.q': { de: 'Was bekomme ich zusätzlich mit Pro?', en: 'What do I additionally get with Pro?', es: '¿Qué obtengo además con Pro?', fr: 'Que m’apporte Pro en plus ?', it: 'Cosa ottengo in più con Pro?' },
    'faq23.a': {
      de: 'Mit <strong>Pro</strong> schaltest du frei:<ul><li>Mehrere ARCs parallel</li><li>Selbst erstellte ARCs (Wizard) und Gewohnheiten</li><li><strong>AI ARC Generator</strong> – aus einem Satz baut die KI einen kompletten ARC für dich</li><li>Ziel-Tracking und Tagebuch</li><li>Insights mit Heatmaps, Trends, Korrelationen und 90-Tage-Profilen</li><li>Premium-Content bei den Lerninhalten</li><li>Teilen von ARC-Ergebnissen als Bildkachel</li></ul>',
      en: 'With <strong>Pro</strong> you unlock:<ul><li>Multiple parallel ARCs</li><li>Self-made ARCs (wizard) and habits</li><li><strong>AI ARC generator</strong> — from one sentence the AI builds a complete ARC for you</li><li>Goal tracking and journaling</li><li>Insights with heatmaps, trends, correlations and 90-day profiles</li><li>Premium Learning Content</li><li>Sharing ARC results as image tiles</li></ul>',
      es: 'Con <strong>Pro</strong> desbloqueas:<ul><li>Varios ARCs en paralelo</li><li>ARCs y hábitos propios (asistente)</li><li><strong>AI ARC Generator</strong> — desde una frase la IA construye un ARC completo</li><li>Seguimiento de objetivos y diario</li><li>Insights con heatmaps, tendencias, correlaciones y perfiles de 90 días</li><li>Contenido premium en los contenidos de aprendizaje</li><li>Compartir resultados de ARC como imagen</li></ul>',
      fr: "Avec <strong>Pro</strong> tu débloques :<ul><li>Plusieurs ARC en parallèle</li><li>ARC et habitudes personnalisés (assistant)</li><li><strong>AI ARC Generator</strong> — à partir d'une phrase, l'IA construit un ARC complet pour toi</li><li>Suivi d'objectifs et journal</li><li>Insights avec heatmaps, tendances, corrélations et profils 90 jours</li><li>Contenus premium dans les contenus d'apprentissage</li><li>Partage des résultats d'ARC sous forme d'image</li></ul>",
      it: 'Con <strong>Pro</strong> sblocchi:<ul><li>Più ARC in parallelo</li><li>ARC e abitudini personali (wizard)</li><li><strong>AI ARC Generator</strong> — da una frase l’IA costruisce un ARC completo</li><li>Tracciamento obiettivi e diario</li><li>Insights con heatmap, trend, correlazioni e profili 90 giorni</li><li>Contenuti premium nei contenuti di apprendimento</li><li>Condivisione dei risultati ARC come immagine</li></ul>',
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
      de: 'Im Pro-Tarif beschreibst du dein Ziel in einem Satz – zum Beispiel <em>„Ich will über 6 Wochen eine Morgenroutine etablieren und besser schlafen."</em> Die KI (Claude von Anthropic) baut daraus einen vollständigen ARC-Entwurf inklusive passender Gewohnheiten, Zielwerte, Theorie und Tipps. Du kannst alles vor dem Speichern frei bearbeiten. Nur dein Prompt wird übertragen – <strong>keine</strong> persönlichen App-Daten.',
      en: 'On Pro you describe your goal in one sentence — e.g. <em>"I want to build a morning routine and sleep better over 6 weeks."</em> The AI (Claude by Anthropic) creates a complete ARC draft for you, including matching habits, targets, theory and tips. You can edit everything freely before saving. Only your prompt is transmitted — <strong>no</strong> personal app data.',
      es: 'En Pro describes tu objetivo en una frase — p. ej. <em>«Quiero construir una rutina matutina y dormir mejor en 6 semanas.»</em> La IA (Claude de Anthropic) crea un borrador completo de ARC con hábitos, objetivos, teoría y consejos. Puedes editarlo todo antes de guardar. Solo se transmite tu prompt — <strong>ningún</strong> dato personal de la app.',
      fr: "Sur Pro tu décris ton objectif en une phrase — par ex. <em>« Je veux construire une routine matinale et mieux dormir sur 6 semaines. »</em> L'IA (Claude d'Anthropic) crée un brouillon d'ARC complet avec habitudes, cibles, théorie et conseils. Tu peux tout modifier avant d'enregistrer. Seul ton prompt est transmis — <strong>aucune</strong> donnée personnelle de l'app.",
      it: 'Su Pro descrivi il tuo obiettivo in una frase — es. <em>«Voglio costruire una routine mattutina e dormire meglio in 6 settimane.»</em> L’IA (Claude di Anthropic) crea una bozza completa di ARC con abitudini, target, teoria e consigli. Puoi modificare tutto prima di salvare. Viene trasmesso solo il tuo prompt — <strong>nessun</strong> dato personale dall’app.',
    },

    'faq28.q': { de: 'Welche Insights bekomme ich?', en: 'What insights do I get?', es: '¿Qué insights obtengo?', fr: 'Quels insights ai-je ?', it: 'Quali insights ottengo?' },
    'faq28.a': {
      de: 'Mit Pro siehst du drei Bereiche:<ul><li><strong>Gewohnheiten-Tab</strong> – Completion-Heatmap, Werteverlauf, Streaks und Sub-Gewohnheits-Rollups pro Gewohnheit</li><li><strong>ARCs-Tab</strong> – Erfolgsrate, durchschnittliche Completion, Life-Area-Verteilung über alle ARCs</li><li><strong>Overall-Tab</strong> – dein 90-Tage-Profil mit perfekten Tagen, aktiver Zeit, Life Balance und Top-Gewohnheiten</li></ul>Alle Zahlen entstehen aus deinen echten Logs – keine geschönten Statistiken.',
      en: 'With Pro you see three areas:<ul><li><strong>Habits tab</strong> — completion heatmap, value history, streaks and sub-habit roll-ups per habit</li><li><strong>ARCs tab</strong> — success rate, average completion, life-area distribution across all ARCs</li><li><strong>Overall tab</strong> — your 90-day profile with perfect days, active time, life balance and top habits</li></ul>All numbers come from your real logs — no embellished stats.',
      es: 'Con Pro ves tres áreas:<ul><li><strong>Pestaña Hábitos</strong> — heatmap de cumplimiento, evolución, rachas y rollups de subhábitos por hábito</li><li><strong>Pestaña ARCs</strong> — tasa de éxito, cumplimiento medio, distribución por life area</li><li><strong>Pestaña Overall</strong> — tu perfil de 90 días con días perfectos, tiempo activo, life balance y top hábitos</li></ul>Todos los números vienen de tus logs reales — sin estadísticas maquilladas.',
      fr: "Avec Pro tu vois trois zones :<ul><li><strong>Onglet Habitudes</strong> — heatmap de complétion, historique, séries et rollups de sous-habitudes par habitude</li><li><strong>Onglet ARCs</strong> — taux de succès, complétion moyenne, répartition par life area</li><li><strong>Onglet Overall</strong> — ton profil 90 jours avec jours parfaits, temps actif, life balance et top habitudes</li></ul>Tous les chiffres viennent de tes logs réels — pas de stats embellies.",
      it: 'Con Pro vedi tre aree:<ul><li><strong>Tab Abitudini</strong> — heatmap di completamento, andamento, streak e rollup di sotto-abitudini per ogni abitudine</li><li><strong>Tab ARCs</strong> — tasso di successo, completamento medio, distribuzione per life area</li><li><strong>Tab Overall</strong> — il tuo profilo 90 giorni con giorni perfetti, tempo attivo, life balance e top abitudini</li></ul>Tutti i numeri vengono dai tuoi log reali — niente statistiche abbellite.',
    },
    'faq29.q': { de: 'Was ist das Ziel- und Tagebuch-System?', en: 'What is the goal and journal system?', es: '¿Qué es el sistema de objetivos y diario?', fr: 'Qu’est-ce que le système objectifs et journal ?', it: 'Cos’è il sistema obiettivi e diario?' },
    'faq29.a': {
      de: 'In jedem Lebensbereich schreibst du eine langfristige <strong>Vision</strong>, legst <strong>Ziele</strong> mit Fälligkeit an (wöchentlich, monatlich, jährlich) und führst <strong>Tagebuch-Einträge</strong> in vier Typen (Gedanke, Lernen, Dankbarkeit, Erfolge &amp; Verluste). Ziele und Tagebuch sind Pro-Features; läuft Pro aus, bleiben bestehende Einträge sichtbar — nur das Erstellen neuer Einträge braucht wieder Pro.',
      en: 'In each life area you write a long-term <strong>vision</strong>, set <strong>goals</strong> with a due date (weekly, monthly, yearly) and keep <strong>journal entries</strong> in four types (Thought, Learning, Gratitude, Wins &amp; Losses). Goals and journal are Pro features; when Pro expires existing entries remain visible — only creating new ones requires Pro again.',
      es: 'En cada área de vida escribes una <strong>visión</strong> a largo plazo, defines <strong>objetivos</strong> con fecha (semanal, mensual, anual) y llevas <strong>entradas de diario</strong> en cuatro tipos (Pensamiento, Aprendizaje, Gratitud, Logros y Pérdidas). Objetivos y diario son funciones Pro; al caducar Pro las entradas existentes siguen visibles — solo crear nuevas vuelve a requerir Pro.',
      fr: "Dans chaque domaine de vie tu écris une <strong>vision</strong> à long terme, tu fixes des <strong>objectifs</strong> avec échéance (hebdo, mensuel, annuel) et tu tiens des <strong>entrées de journal</strong> en quatre types (Pensée, Apprentissage, Gratitude, Victoires &amp; Pertes). Objectifs et journal sont des fonctions Pro ; après expiration de Pro, les entrées existantes restent visibles — seule la création de nouvelles exige à nouveau Pro.",
      it: 'In ogni area di vita scrivi una <strong>visione</strong> a lungo termine, imposti <strong>obiettivi</strong> con scadenza (settimanale, mensile, annuale) e tieni <strong>voci di diario</strong> in quattro tipi (Pensiero, Apprendimento, Gratitudine, Vittorie &amp; Sconfitte). Obiettivi e diario sono funzioni Pro; alla scadenza di Pro le voci esistenti restano visibili — solo la creazione di nuove richiede di nuovo Pro.',
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
      de: 'Ja. Im Profil unter <strong>„Export My Data"</strong> bekommst du ein <strong>vollständiges ZIP-Archiv</strong> aller deiner Daten – Gewohnheiten, ARCs, Logs, Ziele, Tagebuch-Einträge und Cover-Bilder. Aus Performance-Gründen ist der Export auf einmal pro 24 Stunden begrenzt.',
      en: 'Yes. In your profile under <strong>"Export My Data"</strong> you get a <strong>full ZIP archive</strong> of all your data — habits, ARCs, logs, goals, journal entries and cover images. For performance reasons the export is limited to once per 24 hours.',
      es: 'Sí. En el perfil, en <strong>«Export My Data»</strong>, obtienes un <strong>archivo ZIP completo</strong> con todos tus datos — hábitos, ARCs, logs, objetivos, entradas de diario e imágenes de portada. Por rendimiento el export está limitado a una vez cada 24 horas.',
      fr: "Oui. Dans ton profil, sous <strong>« Export My Data »</strong>, tu obtiens une <strong>archive ZIP complète</strong> de toutes tes données — habitudes, ARC, logs, objectifs, entrées de journal et images de couverture. Pour des raisons de performance, l'export est limité à une fois toutes les 24 heures.",
      it: 'Sì. Nel profilo, in <strong>«Export My Data»</strong>, ottieni un <strong>archivio ZIP completo</strong> di tutti i tuoi dati — abitudini, ARC, log, obiettivi, voci di diario e immagini di copertina. Per motivi di performance l’export è limitato a una volta ogni 24 ore.',
    },
    'faq36.q': { de: 'Kann ich mein Konto zurücksetzen oder löschen?', en: 'Can I reset or delete my account?', es: '¿Puedo restablecer o eliminar mi cuenta?', fr: 'Puis-je réinitialiser ou supprimer mon compte ?', it: 'Posso resettare o eliminare il mio account?' },
    'faq36.a': {
      de: 'Zwei Optionen in den Account-Einstellungen:<ul><li><strong>Reset Account</strong> – setzt deinen Fortschritt zurück (Gewohnheiten, Streaks, XP, ARCs, Tagebücher), behält Profil und Pro-Abo</li><li><strong>Delete Account</strong> – löscht dein Konto und sämtliche Daten unwiderruflich</li></ul>Beide Aktionen erfordern eine explizite Bestätigung (Tippen von „RESET" bzw. „DELETE").',
      en: 'Two options in the account settings:<ul><li><strong>Reset Account</strong> — resets your progress (habits, streaks, XP, ARCs, journals), keeps profile and Pro subscription</li><li><strong>Delete Account</strong> — irreversibly deletes your account and all data</li></ul>Both actions require explicit confirmation (typing "RESET" or "DELETE").',
      es: 'Dos opciones en los ajustes de cuenta:<ul><li><strong>Reset Account</strong> — restablece tu progreso (hábitos, rachas, XP, ARCs, diarios), mantiene perfil y suscripción Pro</li><li><strong>Delete Account</strong> — elimina tu cuenta y todos los datos de forma irreversible</li></ul>Ambas requieren confirmación explícita (escribir «RESET» o «DELETE»).',
      fr: "Deux options dans les paramètres du compte :<ul><li><strong>Reset Account</strong> — réinitialise ta progression (habitudes, séries, XP, ARC, journaux), conserve le profil et l'abonnement Pro</li><li><strong>Delete Account</strong> — supprime ton compte et toutes les données de manière irréversible</li></ul>Les deux actions exigent une confirmation explicite (saisie de « RESET » ou « DELETE »).",
      it: 'Due opzioni nelle impostazioni account:<ul><li><strong>Reset Account</strong> — resetta i tuoi progressi (abitudini, streak, XP, ARC, diario), mantiene profilo e abbonamento Pro</li><li><strong>Delete Account</strong> — cancella account e tutti i dati in modo irreversibile</li></ul>Entrambe richiedono conferma esplicita (digitare «RESET» o «DELETE»).',
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
