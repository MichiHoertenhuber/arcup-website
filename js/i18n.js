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
      de: 'Pick your ARC, lock in, and finish stronger.',
      en: 'Pick your ARC, lock in, and finish stronger.',
      es: 'Pick your ARC, lock in, and finish stronger.',
      fr: 'Pick your ARC, lock in, and finish stronger.',
      it: 'Pick your ARC, lock in, and finish stronger.',
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
    'hero.trust4': { de: 'Keine personalisierte Werbung, keine Tracker', en: 'No personalized ads, no trackers', es: 'Sin publicidad personalizada, sin rastreadores', fr: 'Pas de pub personnalisée, pas de trackers', it: 'Niente pubblicità personalizzata, niente tracker' },
    'hero.trust5': { de: 'Voller Datenexport jederzeit', en: 'Full data export any time', es: 'Exportación completa de datos cuando quieras', fr: 'Export complet de tes données à tout moment', it: 'Export completo dei dati in qualsiasi momento' },

    'hero.altHome':  { de: 'ArcUp Home — Tageserfüllung, Wochenerfüllung, Level und aktive ARCs', en: 'ArcUp Home — daily and weekly completion, level and active ARCs', es: 'ArcUp Inicio — cumplimiento diario y semanal, nivel y ARCs activos', fr: "ArcUp Accueil — achèvement quotidien et hebdomadaire, niveau et ARC actifs", it: "ArcUp Home — completamento giornaliero e settimanale, livello e ARC attivi" },
    'hero.altARCs':  { de: 'ARCademy — ausgewählte ARCs', en: 'ARCademy — selected ARCs', es: 'ARCademy — ARCs seleccionados', fr: 'ARCademy — ARC sélectionnés', it: 'ARCademy — ARC selezionati' },
    'hero.altRef':   { de: 'Compass — Lebensrad', en: 'Compass — Wheel of Life', es: 'Compass — Rueda de la vida', fr: 'Compass — Roue de la vie', it: 'Compass — Ruota della vita' },

    // ─── MANIFESTO ───────────────────────────────────────
    'mani.overline': { de: 'Was uns leitet', en: 'What guides us', es: 'Lo que nos guía', fr: 'Ce qui nous guide', it: 'Ciò che ci guida' },
    'mani.title': {
      de: 'Vier Prinzipien,<br />die den <em>Unterschied</em> machen.',
      en: 'Four principles<br />that make the <em>difference</em>.',
      es: 'Cuatro principios<br />que marcan la <em>diferencia</em>.',
      fr: 'Quatre principes<br />qui font la <em>différence</em>.',
      it: 'Quattro principi<br />che fanno la <em>differenza</em>.',
    },
    'p1.h': { de: 'Strukturiert statt beliebig.', en: 'Structured, not arbitrary.', es: 'Estructurado, no arbitrario.', fr: 'Structuré, pas arbitraire.', it: 'Strutturato, non arbitrario.' },
    'p1.b': {
      de: 'Gewohnheiten sind keine Freitext-Notizen, sondern klar definiert: ein messbarer Zielwert mit Richtung (≥ oder ≤) und Einheit — oder ein klares Ja/Nein, wo das der ehrlichere Maßstab ist. Und sie bauen aufeinander auf — ein Zone-2-Lauf zählt automatisch auch für die übergeordnete Gewohnheit Ausdauertraining.',
      en: "Habits aren't free-text notes — they're clearly defined: a measurable target with a direction (≥ or ≤) and a unit, or a plain yes/no where that's the more honest measure. And they nest: a Zone 2 run automatically counts toward its parent habit, endurance training.",
      es: 'Los hábitos no son notas libres, sino claramente definidos: un valor objetivo medible con dirección (≥ o ≤) y unidad, o un simple sí/no cuando ese es el criterio más honesto. Y se anidan: una carrera en Zona 2 cuenta automáticamente también para su hábito superior, el entrenamiento de resistencia.',
      fr: "Les habitudes ne sont pas des notes libres, mais clairement définies : une valeur cible mesurable avec une direction (≥ ou ≤) et une unité, ou un simple oui/non quand c'est la mesure la plus honnête. Et elles s'emboîtent : une course en Zone 2 compte automatiquement aussi pour son habitude parente, l'entraînement d'endurance.",
      it: "Le abitudini non sono note libere, ma definite con chiarezza: un valore obiettivo misurabile con direzione (≥ o ≤) e unità, oppure un semplice sì/no dove è la misura più onesta. E si annidano: una corsa in Zona 2 conta automaticamente anche per la sua abitudine superiore, l'allenamento di resistenza.",
    },
    'p2.h': { de: 'Selbstbestimmt statt vorgeschrieben.', en: 'Self-directed, not prescribed.', es: 'Autodirigido, no impuesto.', fr: 'Choisi, pas imposé.', it: 'Scelto da te, non imposto.' }, // _x:'Anfang und Ende statt Endlos.', en: 'A finish line, not a forever streak.', es: 'Principio y final, no sin fin.', fr: 'Un début et une fin, pas sans fin.', it: 'Un inizio e una fine, non all’infinito.' },
    'p2.b': {
      de: 'Du entscheidest, woran du arbeitest: einen fertigen ARC starten, im Assistenten einen eigenen bauen oder per KI aus einem Satz generieren — mit deinen Zielwerten. ArcUp gibt die Struktur, die Richtung gibst du.',
      en: 'You decide what you work on: start a ready-made ARC, build your own in the wizard, or generate one from a single sentence with AI — with your own target values. ArcUp gives the structure, you set the direction.',
      es: 'Tú decides en qué trabajas: empezar un ARC listo, crear el tuyo en el asistente o generar uno desde una frase con IA — con tus propios valores objetivo. ArcUp pone la estructura, tú pones la dirección.',
      fr: "C'est toi qui choisis sur quoi tu travailles : lancer un ARC prêt à l'emploi, en construire un dans l'assistant ou en générer un à partir d'une phrase avec l'IA — avec tes propres valeurs cibles. ArcUp donne la structure, toi la direction.",
      it: 'Decidi tu su cosa lavorare: avviare un ARC pronto, costruirne uno nella procedura guidata o generarne uno da una frase con l’IA — con i tuoi valori obiettivo. ArcUp dà la struttura, la direzione la dai tu.',
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
      de: 'Wachstum passiert auf zwei Ebenen: Zielwerte steigen linear über die ARC-Dauer — von 1 auf 5 km, von 5 auf 20 Minuten. Und der ARC selbst wächst in Stufen — du startest schlank und schaltest neue Gewohnheiten erst frei, wenn du eine Woche stark abschließt. Gesteigert, nicht wiederholt.',
      en: 'Growth happens on two levels: targets rise linearly across the ARC — from 1 to 5 km, from 5 to 20 minutes. And the ARC itself grows in stages — you start lean and unlock new habits only once you finish a week strong. Progression, not repetition.',
      es: 'El crecimiento ocurre en dos niveles: los objetivos suben linealmente durante el ARC — de 1 a 5 km, de 5 a 20 minutos. Y el propio ARC crece por etapas — empiezas ligero y desbloqueas nuevos hábitos solo al terminar una semana con fuerza. Progresar, no repetir.',
      fr: "La croissance se joue à deux niveaux : les objectifs augmentent linéairement sur la durée de l'ARC — de 1 à 5 km, de 5 à 20 minutes. Et l'ARC lui-même grandit par niveaux — tu démarres léger et ne débloques de nouvelles habitudes qu'en réussissant une semaine forte. Progresser, pas répéter.",
      it: "La crescita avviene su due piani: gli obiettivi salgono linearmente lungo l'ARC — da 1 a 5 km, da 5 a 20 minuti. E l'ARC stesso cresce per livelli — parti snello e sblocchi nuove abitudini solo completando una settimana forte. Progredire, non ripetere.",
    },

    // ─── ARC EXAMPLES ────────────────────────────────────
    'arcs.overline': { de: 'Konkret', en: 'Concretely', es: 'En concreto', fr: 'Concrètement', it: 'In concreto' },
    'arcs.title':    { de: 'So sehen unsere ARCs aus.', en: 'What our ARCs look like.', es: 'Así son nuestros ARC.', fr: 'À quoi ressemblent nos ARC.', it: 'Ecco i nostri ARC.' },
    'arcs.sub':      { de: 'Vier reale ARCs aus der Sammlung — jeweils mit Dauer, Lebensbereich und den echten Gewohnheiten, Werttypen und Zielwerten, die du trackst. Einer baut sich in Stufen auf.', en: 'Four real ARCs from the library — each with duration, life area and the actual habits, value types and targets you track. One builds up in stages.', es: 'Cuatro ARCs reales de la biblioteca — cada uno con duración, área de vida y los hábitos, tipos de valor y objetivos reales que registras. Uno se construye por etapas.', fr: "Quatre ARC réels de la bibliothèque — chacun avec durée, domaine de vie et les habitudes, types de valeur et objectifs réels que tu suis. L'un se construit par niveaux.", it: 'Quattro ARC reali dalla biblioteca — ognuno con durata, area di vita e le abitudini, i tipi di valore e gli obiettivi reali che tracci. Uno si costruisce per livelli.' },

    // ARC — the real Classic Winter ARC (Body, 8 weeks, Hard) — Supabase arc id 20
    'arc1.area': { de: 'Körper', en: 'Body', es: 'Cuerpo', fr: 'Corps', it: 'Corpo' },
    'arc1.dur':  { de: '8 Wochen', en: '8 weeks', es: '8 semanas', fr: '8 semaines', it: '8 settimane' },
    'arc1.diff': { de: 'Schwer', en: 'Hard', es: 'Difícil', fr: 'Difficile', it: 'Difficile' },
    'arc1.h':    { de: 'Classic Winter ARC', en: 'Classic Winter ARC', es: 'Classic Winter ARC', fr: 'Classic Winter ARC', it: 'Classic Winter ARC' },
    'arc1.b':    { de: 'Acht Wochen Lock-in für die dunkle Jahreszeit — trainieren, erholen, lesen und Ablenkung rausschneiden, und das Jahr im Vorsprung beenden.', en: 'Eight weeks to lock in over the dark season — train, recover, read and cut the noise, and end the year ahead of where you started.', es: 'Ocho semanas de bloqueo en la estación oscura — entrenar, recuperar, leer y cortar el ruido, y terminar el año por delante.', fr: "Huit semaines de lock-in pour la saison sombre — t'entraîner, récupérer, lire et couper le bruit, et finir l'année en avance.", it: 'Otto settimane di lock-in nella stagione buia — allenarti, recuperare, leggere e tagliare il rumore, e finire l’anno in vantaggio.' },
    'arc1.h1':   { de: 'Ausdauertraining ≥ 180 min/Woche', en: 'Endurance Training ≥ 180 min/week', es: 'Entrenamiento de resistencia ≥ 180 min/semana', fr: "Entraînement d'endurance ≥ 180 min/semaine", it: 'Allenamento di resistenza ≥ 180 min/settimana' },
    'arc1.h2':   { de: 'Krafttraining ≥ 90 min/Woche', en: 'Strength Training ≥ 90 min/week', es: 'Entrenamiento de fuerza ≥ 90 min/semana', fr: 'Renforcement musculaire ≥ 90 min/semaine', it: 'Allenamento di forza ≥ 90 min/settimana' },
    'arc1.h3':   { de: 'Dehnen ≥ 10 min', en: 'Stretching ≥ 10 min', es: 'Estiramientos ≥ 10 min', fr: 'Étirements ≥ 10 min', it: 'Stretching ≥ 10 min' },
    'arc1.h4':   { de: 'Kältereiz · täglich', en: 'Cold Exposure · daily', es: 'Exposición al frío · a diario', fr: 'Exposition au froid · chaque jour', it: 'Esposizione al freddo · ogni giorno' },
    'arc1.h5':   { de: 'Früh aufstehen · 5×/Woche', en: 'Wake Up Early · 5×/week', es: 'Levantarse temprano · 5×/semana', fr: 'Se lever tôt · 5×/semaine', it: 'Svegliarsi presto · 5×/settimana' },
    'arc1.h6':   { de: 'Kein Snooze · täglich', en: 'No Snooze · daily', es: 'Sin posponer la alarma · a diario', fr: 'Pas de snooze · chaque jour', it: 'Niente snooze · ogni giorno' },
    'arc1.h7':   { de: 'Wasser trinken ≥ 2 l', en: 'Drink Water ≥ 2 l', es: 'Beber agua ≥ 2 l', fr: "Boire de l'eau ≥ 2 l", it: 'Bere acqua ≥ 2 l' },
    'arc1.h8':   { de: 'Lesen 10 → 25 Seiten', en: 'Read 10 → 25 pages', es: 'Leer 10 → 25 páginas', fr: 'Lire 10 → 25 pages', it: 'Leggere 10 → 25 pagine' },
    'arc1.h9':   { de: 'Meditation ≥ 10 min', en: 'Meditation ≥ 10 min', es: 'Meditación ≥ 10 min', fr: 'Méditation ≥ 10 min', it: 'Meditazione ≥ 10 min' },
    'arc1.h10':  { de: 'Atemübungen ≥ 15 min', en: 'Breathwork ≥ 15 min', es: 'Ejercicios de respiración ≥ 15 min', fr: 'Exercices de respiration ≥ 15 min', it: 'Esercizi di respirazione ≥ 15 min' },
    'arc1.h11':  { de: 'Tagebuch schreiben ≥ 10 min', en: 'Journaling ≥ 10 min', es: 'Escribir un diario ≥ 10 min', fr: 'Tenir un journal ≥ 10 min', it: 'Scrivere un diario ≥ 10 min' },
    'arc1.h12':  { de: 'Social-Media-Zeit ≤ 1 h', en: 'Social Media Time ≤ 1 h', es: 'Tiempo en redes sociales ≤ 1 h', fr: 'Temps sur les réseaux sociaux ≤ 1 h', it: 'Tempo sui social ≤ 1 h' },

    // ARC — Calm Mind (Mind, 6 weeks, Medium) — Supabase
    'arc2.area': { de: 'Geist', en: 'Mind', es: 'Mente', fr: 'Esprit', it: 'Mente' },
    'arc2.dur':  { de: '6 Wochen', en: '6 weeks', es: '6 semanas', fr: '6 semaines', it: '6 settimane' },
    'arc2.diff': { de: 'Mittel', en: 'Medium', es: 'Medio', fr: 'Moyen', it: 'Medio' },
    'arc2.h':    { de: 'Ruhiger Geist', en: 'Calm Mind', es: 'Mente en calma', fr: 'Esprit calme', it: 'Mente serena' },
    'arc2.b':    { de: 'Sechs Wochen tägliche Praxis aus Meditation, Atmung und Dankbarkeit — von zerstreut und gestresst zu klar und ruhig.', en: 'Six weeks of daily meditation, breathwork and gratitude — from scattered and stressed to clear and calm.', es: 'Seis semanas de meditación, respiración y gratitud a diario — del agobio a la claridad y la calma.', fr: 'Six semaines de méditation, respiration et gratitude au quotidien — du stress à la clarté et au calme.', it: 'Sei settimane di meditazione, respirazione e gratitudine ogni giorno — dallo stress alla lucidità e alla calma.' },
    'arc2.h1':   { de: 'Meditation 5 → 15 min', en: 'Meditation 5 → 15 min', es: 'Meditación 5 → 15 min', fr: 'Méditation 5 → 15 min', it: 'Meditazione 5 → 15 min' },
    'arc2.h2':   { de: 'Atemübungen ≥ 5 min', en: 'Breathwork ≥ 5 min', es: 'Ejercicios de respiración ≥ 5 min', fr: 'Exercices de respiration ≥ 5 min', it: 'Esercizi di respirazione ≥ 5 min' },
    'arc2.h3':   { de: 'Dankbarkeitstagebuch ≥ 5 min', en: 'Gratitude Journaling ≥ 5 min', es: 'Diario de gratitud ≥ 5 min', fr: 'Journal de gratitude ≥ 5 min', it: 'Diario della gratitudine ≥ 5 min' },
    'arc2.h4':   { de: 'Stimmungscheck · täglich', en: 'Mood Check-in · daily', es: 'Registro de ánimo · a diario', fr: "Point d'humeur · chaque jour", it: 'Check dell’umore · ogni giorno' },
    'arc2.h5':   { de: 'Zeit in der Natur ≥ 15 min', en: 'Time in Nature ≥ 15 min', es: 'Tiempo en la naturaleza ≥ 15 min', fr: 'Temps dans la nature ≥ 15 min', it: 'Tempo nella natura ≥ 15 min' },
    'arc2.h6':   { de: 'Yoga Nidra ≥ 20 min/Woche', en: 'Yoga Nidra ≥ 20 min/week', es: 'Yoga Nidra ≥ 20 min/semana', fr: 'Yoga Nidra ≥ 20 min/semaine', it: 'Yoga Nidra ≥ 20 min/settimana' },

    // ARC — Clean Eating Reset (Nutrition, 6 weeks, Medium) — Supabase
    'arc3.area': { de: 'Ernährung', en: 'Nutrition', es: 'Nutrición', fr: 'Nutrition', it: 'Alimentazione' },
    'arc3.dur':  { de: '6 Wochen', en: '6 weeks', es: '6 semanas', fr: '6 semaines', it: '6 settimane' },
    'arc3.diff': { de: 'Mittel', en: 'Medium', es: 'Medio', fr: 'Moyen', it: 'Medio' },
    'arc3.h':    { de: 'Ernährungs-Neustart', en: 'Clean Eating Reset', es: 'Reinicio de alimentación', fr: 'Nouveau départ alimentaire', it: 'Ripartenza alimentare' },
    'arc3.b':    { de: 'Sechs Wochen für bessere Standards — mehr Gemüse, Wasser und selbst kochen, weniger Zucker und Fertigkost.', en: 'Six weeks of better defaults — more vegetables, water and home cooking, less sugar and junk.', es: 'Seis semanas de mejores hábitos — más verduras, agua y cocina casera, menos azúcar y ultraprocesados.', fr: 'Six semaines de meilleures habitudes — plus de légumes, d’eau et de cuisine maison, moins de sucre et de malbouffe.', it: 'Sei settimane di abitudini migliori — più verdura, acqua e cucina casalinga, meno zucchero e cibo spazzatura.' },
    'arc3.h1':   { de: 'Gemüse 3 → 5 Portionen', en: 'Vegetables 3 → 5 servings', es: 'Verduras 3 → 5 raciones', fr: 'Légumes 3 → 5 portions', it: 'Verdura 3 → 5 porzioni' },
    'arc3.h2':   { de: 'Wasser trinken ≥ 2 l', en: 'Drink Water ≥ 2 l', es: 'Beber agua ≥ 2 l', fr: "Boire de l'eau ≥ 2 l", it: 'Bere acqua ≥ 2 l' },
    'arc3.h3':   { de: 'Proteinbedarf decken · täglich', en: 'Meet protein needs · daily', es: 'Cubrir proteínas · a diario', fr: 'Couvrir les protéines · chaque jour', it: 'Coprire le proteine · ogni giorno' },
    'arc3.h4':   { de: 'Zu Hause kochen · täglich', en: 'Cook at Home · daily', es: 'Cocinar en casa · a diario', fr: 'Cuisiner maison · chaque jour', it: 'Cucinare a casa · ogni giorno' },
    'arc3.h5':   { de: 'Zuckerhaltiges ≤ 1×/Tag', en: 'Sugary foods ≤ 1×/day', es: 'Azúcar ≤ 1×/día', fr: 'Sucre ≤ 1×/jour', it: 'Zuccheri ≤ 1×/giorno' },
    'arc3.h6':   { de: 'Kein Fast Food · täglich', en: 'No Fast Food · daily', es: 'Sin comida rápida · a diario', fr: 'Pas de fast-food · chaque jour', it: 'Niente fast food · ogni giorno' },

    // ARC — Morning Momentum (Lifestyle, 5 weeks, Medium, STAGED build-up) — Supabase arc id 42
    'arc4.area':  { de: 'Lebensstil', en: 'Lifestyle', es: 'Estilo de vida', fr: 'Style de vie', it: 'Stile di vita' },
    'arc4.badge': { de: 'Stufenmodell', en: 'Build-up', es: 'Progresión', fr: 'Progression', it: 'Progressione' },
    'arc4.dur':   { de: '5 Wochen', en: '5 weeks', es: '5 semanas', fr: '5 semaines', it: '5 settimane' },
    'arc4.diff':  { de: 'Mittel', en: 'Medium', es: 'Medio', fr: 'Moyen', it: 'Medio' },
    'arc4.h':     { de: 'Morgen-Momentum', en: 'Morning Momentum', es: 'Impulso Matutino', fr: 'Élan du Matin', it: 'Slancio del Mattino' },
    'arc4.b':     { de: 'Fünf Wochen für eine Morgenroutine, die bleibt. Du startest mit drei einfachen Ankern — neue Gewohnheiten kommen erst dazu, wenn du eine Woche stark abschließt.', en: 'Five weeks to a morning routine that sticks. You start with three simple anchors — new habits are added only once you finish a week strong.', es: 'Cinco semanas para una rutina matutina que perdura. Empiezas con tres anclas simples: los nuevos hábitos se añaden solo al cerrar una semana fuerte.', fr: "Cinq semaines pour une routine matinale qui tient. Tu commences avec trois ancres simples — de nouvelles habitudes s'ajoutent seulement après une semaine forte.", it: 'Cinque settimane per una routine mattutina che dura. Parti con tre ancore semplici: nuove abitudini si aggiungono solo dopo una settimana forte.' },
    'arc4.s1':    { de: 'Stufe 1 · Start', en: 'Stage 1 · start', es: 'Etapa 1 · inicio', fr: 'Niveau 1 · début', it: 'Livello 1 · inizio' },
    'arc4.s2':    { de: 'Stufe 2 · nach 1 starken Woche', en: 'Stage 2 · after 1 strong week', es: 'Etapa 2 · tras 1 semana fuerte', fr: 'Niveau 2 · après 1 semaine forte', it: 'Livello 2 · dopo 1 settimana forte' },
    'arc4.s3':    { de: 'Stufe 3 · nach 2 starken Wochen', en: 'Stage 3 · after 2 strong weeks', es: 'Etapa 3 · tras 2 semanas fuertes', fr: 'Niveau 3 · après 2 semaines fortes', it: 'Livello 3 · dopo 2 settimane forti' },
    'arc4.h1':    { de: 'Bett machen · täglich', en: 'Make Your Bed · daily', es: 'Hacer la cama · a diario', fr: 'Faire son lit · chaque jour', it: 'Rifare il letto · ogni giorno' },
    'arc4.h2':    { de: 'Kein Handy nach dem Aufwachen · täglich', en: 'No Phone After Waking · daily', es: 'Sin móvil al despertar · a diario', fr: 'Pas de téléphone au réveil · chaque jour', it: 'Niente telefono al risveglio · ogni giorno' },
    'arc4.h3':    { de: 'Meditation 5 → 10 min', en: 'Meditation 5 → 10 min', es: 'Meditación 5 → 10 min', fr: 'Méditation 5 → 10 min', it: 'Meditazione 5 → 10 min' },
    'arc4.h4':    { de: 'Dehnen ≥ 10 min', en: 'Stretching ≥ 10 min', es: 'Estiramientos ≥ 10 min', fr: 'Étirements ≥ 10 min', it: 'Stretching ≥ 10 min' },
    'arc4.h5':    { de: 'Sonnenlicht tanken ≥ 10 min', en: 'Sunlight Exposure ≥ 10 min', es: 'Luz solar ≥ 10 min', fr: 'Lumière du soleil ≥ 10 min', it: 'Luce del sole ≥ 10 min' },
    'arc4.h6':    { de: 'Dankbarkeitstagebuch · täglich', en: 'Gratitude Journaling · daily', es: 'Diario de gratitud · a diario', fr: 'Journal de gratitude · chaque jour', it: 'Diario della gratitudine · ogni giorno' },
    'arc4.h7':    { de: 'Lesen ≥ 5 Seiten', en: 'Read ≥ 5 pages', es: 'Leer ≥ 5 páginas', fr: 'Lire ≥ 5 pages', it: 'Leggere ≥ 5 pagine' },

    // ─── THE APP (4 showcases) ───────────────────────────
    'sys.overline': { de: 'In der App', en: 'Inside the app', es: 'Dentro de la app', fr: 'Dans l’app', it: 'Dentro l’app' },
    'sys.title':    { de: 'Vier Tabs. Eine klare Logik.', en: 'Four tabs. One clear logic.', es: 'Cuatro pestañas. Una lógica clara.', fr: 'Quatre onglets. Une logique claire.', it: 'Quattro tab. Una logica chiara.' },
    'sys.sub':      { de: 'Tracken, wählen, lernen, reflektieren — jeder Tab erfüllt genau eine Aufgabe.', en: 'Track, choose, learn, reflect — each tab does exactly one job.', es: 'Registrar, elegir, aprender, reflexionar — cada pestaña hace una sola cosa.', fr: 'Suivre, choisir, apprendre, réfléchir — chaque onglet a une seule tâche.', it: 'Tracciare, scegliere, imparare, riflettere — ogni tab fa una sola cosa.' },

    // 01 Home
    'sc1.num':   { de: '01 — Home', en: '01 — Home', es: '01 — Inicio', fr: '01 — Accueil', it: '01 — Home' },
    'sc1.h':     { de: 'Wo du heute stehst.', en: 'Where you stand today.', es: 'Dónde estás hoy.', fr: "Où tu en es aujourd'hui.", it: 'A che punto sei oggi.' },
    'sc1.b':     { de: 'Drei Ringe für Tag, Woche und Level. Eine Liste deiner heutigen Gewohnheiten — jede mit ihrem eigenen Maßstab, vom konkreten Zielwert bis zum klaren Ja/Nein. Aktive ARCs zeigen, wo du gerade stehst.', en: "Three rings for day, week and level. A list of today's habits — each with its own measure, from a concrete target value to a plain yes/no. Active ARCs show where you currently stand.", es: 'Tres anillos para día, semana y nivel. Una lista de tus hábitos de hoy — cada uno con su propio criterio, desde un valor objetivo concreto hasta un simple sí/no. Los ARCs activos muestran dónde estás.', fr: "Trois anneaux pour le jour, la semaine et le niveau. Une liste de vos habitudes du jour — chacune avec sa propre mesure, d'une valeur cible concrète à un simple oui/non. Les ARC actifs montrent où vous en êtes.", it: 'Tre anelli per giorno, settimana e livello. Una lista delle tue abitudini di oggi — ognuna con la propria misura, dal valore obiettivo concreto a un semplice sì/no. Gli ARC attivi mostrano dove sei.' },
    'sc1.li1':   { de: 'Tages- und Wochenerfüllung als Prozent, proportional zum Zielwert', en: 'Daily and weekly completion as a percentage, proportional to the target', es: 'Cumplimiento diario y semanal en porcentaje, proporcional al objetivo', fr: 'Complétion quotidienne et hebdomadaire en pourcentage, proportionnelle à la cible', it: 'Completamento giornaliero e settimanale in percentuale, proporzionale al target' },
    'sc1.li2':   { de: 'Level, Streak und aktive ARC-Karte', en: 'Level, streak and active-ARC card', es: 'Nivel, racha y tarjeta de ARC activo', fr: 'Niveau, série et carte d’ARC actif', it: 'Livello, streak e card di ARC attivo' },
    'sc1.li3':   { de: 'Logbuch in einem Tap — Tageswert je Gewohnheit per Schrittwähler oder Schieberegler', en: 'Logbook in one tap — each habit’s value via stepper or slider', es: 'Registro en un toque — el valor de cada hábito con selector numérico o control deslizante', fr: "Carnet en un tap — la valeur de chaque habitude au sélecteur numérique ou au curseur", it: 'Registro con un tap — il valore di ogni abitudine con selettore numerico o cursore' },
    'sc1.li4':   { de: 'Live-Timer (Stoppuhr oder Pomodoro) für alle Dauer-Gewohnheiten', en: 'Live timer (stopwatch or Pomodoro) for any duration-based habit', es: 'Timer en vivo (cronómetro o Pomodoro) para cualquier hábito de duración', fr: "Timer en direct (chrono ou Pomodoro) pour toute habitude de durée", it: 'Timer live (cronometro o Pomodoro) per ogni abitudine a durata' },
    'sc1.li5':   { de: 'Ruhetage und Urlaubsmodus — Auszeiten brechen deinen Streak nicht', en: 'Rest days and Vacation Mode — time off does not break your streak', es: 'Días de descanso y modo Vacaciones — las pausas no rompen tu racha', fr: 'Jours de repos et mode Vacances — les pauses ne cassent pas ta série', it: 'Giorni di riposo e modalità Vacanza — le pause non rompono il tuo streak' },
    'sc1.li6':   { de: 'Manche Gewohnheiten öffnen beim Eintragen eine geführte Aktion statt eines Zahlenfelds — Vision überprüfen, Wochenziele setzen oder einen Tagebucheintrag schreiben, direkt in der App. Erledigt heißt abgehakt.', en: 'Some habits open a guided in-app action instead of a number pad — review your vision, set weekly goals or write a journal entry, right in the app. Done means checked off.', es: 'Algunos hábitos abren una acción guiada en la app en lugar de un teclado numérico — revisa tu visión, fija metas semanales o escribe una entrada de diario, ahí mismo. Hecho es marcado.', fr: "Certaines habitudes ouvrent une action guidée dans l'app au lieu d'un pavé numérique — revoir ta vision, fixer des objectifs hebdomadaires ou écrire une entrée de journal, directement. Fait, c'est coché.", it: 'Alcune abitudini aprono un’azione guidata nell’app invece di un tastierino numerico — rivedi la tua visione, imposta obiettivi settimanali o scrivi una voce di diario, lì per lì. Fatto significa spuntato.' },
    'sc1.alt':   { de: 'ArcUp Home — Tages-, Wochen- und Level-Ringe mit aktivem Classic Winter ARC', en: 'ArcUp Home — daily, weekly and level rings with the active Classic Winter ARC', es: 'ArcUp Inicio — anillos de día, semana y nivel con el Classic Winter ARC activo', fr: "ArcUp Accueil — anneaux jour, semaine et niveau avec le Classic Winter ARC actif", it: 'ArcUp Home — anelli giorno, settimana e livello con il Classic Winter ARC attivo' },

    // 02 ARCademy
    'sc2.num': { de: '02 — ARCademy', en: '02 — ARCademy', es: '02 — ARCademy', fr: '02 — ARCademy', it: '02 — ARCademy' },
    'sc2.h':   { de: 'Wähle, baue oder lass generieren.', en: 'Pick one, build one, or have one generated.', es: 'Elige, crea o haz que se genere.', fr: 'Choisissez, créez ou laissez générer.', it: 'Scegli, crea o lascia generare.' },
    'sc2.b':   { de: 'Eine ausgewählte Sammlung an ARCs zwischen 1 und 12 Wochen. Schwierigkeit, Lebensbereich, Lerninhalt, Dauer — alles filterbar. Plus zwei Wege, deinen eigenen ARC zu bauen.', en: 'A selected library of ARCs from 1 to 12 weeks. Difficulty, life area, learning content, duration — all filterable. Plus two ways to build your own ARC.', es: 'Una biblioteca seleccionada de ARCs de 1 a 12 semanas. Dificultad, área, contenido de aprendizaje, duración — todo filtrable. Y dos vías para crear tu propio ARC.', fr: "Une bibliothèque sélectionnée d'ARC de 1 à 12 semaines. Difficulté, domaine, contenu d'apprentissage, durée — tout filtrable. Plus deux façons de construire votre propre ARC.", it: 'Una biblioteca selezionata di ARC da 1 a 12 settimane. Difficoltà, area, contenuto di apprendimento, durata — tutto filtrabile. E due modi per costruire il tuo ARC.' },
    'sc2.li1': { de: 'Ausgewählte ARCs mit Theorie, Tipps, Titelbild und primärem Lerninhalt', en: 'Selected ARCs with theory, tips, cover and primary learning content', es: 'ARCs seleccionados con teoría, consejos, portada y contenido de aprendizaje primario', fr: "ARC sélectionnés avec théorie, conseils, couverture et contenu d'apprentissage principal", it: 'ARC selezionati con teoria, consigli, copertina e contenuto di apprendimento primario' },
    'sc2.li2': { de: 'KI-Generator: Ziel in einem Satz beschreiben, fertigen ARC erhalten — editierbar', en: 'AI generator: describe your goal in one sentence, receive a ready ARC — editable', es: 'Generador IA: describe tu meta en una frase, recibe un ARC listo — editable', fr: "Générateur IA : décrivez votre objectif en une phrase, recevez un ARC prêt — éditable", it: "Generatore IA: descrivi il tuo obiettivo in una frase, ricevi un ARC pronto — modificabile" },
    'sc2.li3': { de: 'Selfmade-ARCs aus ausgewählten Gewohnheiten — Schritt für Schritt zusammengestellt <span class="pro-pill">Pro</span>', en: 'Self-made ARCs from selected habits — assembled step by step <span class="pro-pill">Pro</span>', es: 'ARCs propios a partir de hábitos seleccionados — montados paso a paso <span class="pro-pill">Pro</span>', fr: "ARC personnalisés à partir d'habitudes sélectionnées — assemblés étape par étape <span class=\"pro-pill\">Pro</span>", it: 'ARC personali da abitudini selezionate — assemblati passo dopo passo <span class="pro-pill">Pro</span>' },
    'sc2.li4': { de: 'Ständig neue ARCs, Gewohnheiten und Lerninhalte — dazu saisonale ARCs (z. B. zum Jahreswechsel oder Sommerstart)', en: 'New ARCs, habits and learning content all the time — plus seasonal ARCs (e.g. for New Year or the start of summer)', es: 'Nuevos ARCs, hábitos y contenidos de aprendizaje sin parar — más ARCs de temporada (p. ej. Año Nuevo o inicio del verano)', fr: "De nouveaux ARC, habitudes et contenus d'apprentissage en continu — plus des ARC saisonniers (p. ex. Nouvel An ou début d'été)", it: 'Sempre nuovi ARC, abitudini e contenuti di apprendimento — più ARC stagionali (es. Capodanno o inizio estate)' },
    'sc2.alt': { de: 'ARCademy — ARC-Bibliothek mit dem Classic Winter ARC, Suche und Filter', en: 'ARCademy — ARC library featuring the Classic Winter ARC, with search and filter', es: 'ARCademy — biblioteca de ARCs con el Classic Winter ARC, búsqueda y filtros', fr: "ARCademy — bibliothèque d'ARC avec le Classic Winter ARC, recherche et filtres", it: 'ARCademy — biblioteca di ARC con il Classic Winter ARC, ricerca e filtri' },

    // 03 Discover
    'sc3.num': { de: '03 — Discover · Lerninhalte', en: '03 — Discover · Learning Content', es: '03 — Discover · Contenidos de aprendizaje', fr: "03 — Discover · Contenus d'apprentissage", it: '03 — Discover · Contenuti di apprendimento' },
    'sc3.h':   { de: 'Wissen, kompakt aufbereitet.', en: 'Knowledge, distilled.', es: 'Conocimiento, destilado.', fr: 'Le savoir, condensé.', it: 'Conoscenza, distillata.' },
    'sc3.b':   { de: 'Discover hat zwei Tabs — Lerninhalte und Gewohnheiten. Im Lerninhalte-Tab steht hinter jeder Gewohnheit und jedem ARC ein eigener Lerninhalt: selbst geschrieben, in 4 bis 8 Minuten lesbar, direkt verknüpft.', en: 'Discover has two tabs — Learning Content and Habits. In the Learning Content tab, every habit and ARC is backed by its own lesson: written by us, readable in 4 to 8 minutes, directly linked.', es: 'Discover tiene dos pestañas — Contenidos de aprendizaje y Hábitos. En Contenidos de aprendizaje, detrás de cada hábito y cada ARC hay un contenido de aprendizaje propio: escrito por nosotros, legible en 4 a 8 minutos, directamente vinculado.', fr: "Discover a deux onglets — Contenus d'apprentissage et Habitudes. Dans Contenus d'apprentissage, chaque habitude et chaque ARC est appuyé par son propre contenu d'apprentissage : écrit par nous, lisible en 4 à 8 minutes, directement lié.", it: 'Discover ha due tab — Contenuti di apprendimento e Abitudini. Nel tab Contenuti di apprendimento, dietro ogni abitudine e ogni ARC c’è un contenuto di apprendimento proprio: scritto da noi, leggibile in 4–8 minuti, collegato direttamente.' },
    'sc3.li1': { de: 'Eigene Lerninhalte zu etablierten Konzepten: Trainingswissenschaft, Schlafhygiene, Atemtechniken, Lerntheorie, Fokus', en: 'Our own lessons on established concepts: training science, sleep hygiene, breath techniques, learning theory, focus', es: 'Contenidos de aprendizaje propios sobre conceptos establecidos: ciencia del entrenamiento, higiene del sueño, técnicas de respiración, teoría del aprendizaje, foco', fr: "Contenus d'apprentissage maison sur des concepts établis : science de l'entraînement, hygiène du sommeil, techniques de respiration, théorie de l'apprentissage, concentration", it: "Contenuti di apprendimento propri su concetti consolidati: scienza dell'allenamento, igiene del sonno, tecniche di respirazione, teoria dell'apprendimento, focus" },
    'sc3.li2': { de: 'Klare These pro Lerninhalt, direkt anwendbar — keine Reproduktion geschützter Inhalte', en: 'Clear thesis per piece of learning content, directly applicable — no reproduction of protected content', es: 'Una tesis clara por contenido de aprendizaje, directamente aplicable — sin reproducir contenido protegido', fr: "Une thèse claire par contenu d'apprentissage, directement applicable — pas de reproduction de contenu protégé", it: 'Una tesi chiara per contenuto di apprendimento, direttamente applicabile — nessuna riproduzione di contenuti protetti' }, // _x:'Kein „im Buch lernst du…" — die Kernideen direkt destilliert, 4–8 Minuten Lesedauer', en: 'No "you’ll learn in the book…" — core ideas distilled directly, 4–8 minutes to read', es: 'Nada de «en el libro aprenderás…» — ideas centrales destiladas, 4–8 minutos de lectura', fr: "Pas de « vous apprendrez dans le livre » — les idées clés distillées, 4–8 min de lecture", it: 'Niente «nel libro imparerai…» — idee chiave distillate, 4–8 minuti di lettura' },
    'sc3.li3': { de: 'Optionale Buch- und Talk-Empfehlungen mit *-Markierung als Affiliate-Links — ohne Mehrkosten für dich', en: 'Optional book and talk recommendations marked with * as affiliate links — at no extra cost to you', es: 'Recomendaciones opcionales de libros y charlas marcadas con * como enlaces de afiliado — sin coste adicional para ti', fr: "Recommandations optionnelles de livres et conférences marquées d’un * comme liens affiliés — sans surcoût pour vous", it: 'Consigli opzionali su libri e talk marcati con * come link affiliati — nessun costo aggiuntivo per te' },
    'sc3b.num': { de: '03 — Discover · Gewohnheiten', en: '03 — Discover · Habits', es: '03 — Discover · Hábitos', fr: '03 — Discover · Habitudes', it: '03 — Discover · Abitudini' },
    'sc3b.h':   { de: 'Gewohnheiten in einer klaren Hierarchie.', en: 'Habits in a clear hierarchy.', es: 'Hábitos en una jerarquía clara.', fr: 'Des habitudes dans une hiérarchie claire.', it: 'Abitudini in una gerarchia chiara.' },
    'sc3b.b':   { de: 'Der zweite Discover-Tab: eine ausgewählte Sammlung an Gewohnheiten, sauber in Ober- und Unterkategorien strukturiert. Du trackst „Zone 2 Laufen = 12 km" — die Insights summieren das automatisch unter <em>Laufen</em> und <em>Ausdauertraining</em> mit.', en: 'The second Discover tab: a selected set of habits, neatly structured into parent and child categories. You track "Zone 2 Run = 12 km" — your insights automatically roll it up under <em>Running</em> and <em>Endurance training</em>.', es: 'La segunda pestaña de Discover: una selección de hábitos, organizados con claridad en categorías padre e hija. Registras «Correr Zona 2 = 12 km» — los insights lo agregan automáticamente bajo <em>Correr</em> y <em>Entrenamiento de resistencia</em>.', fr: "Le second onglet Discover : une sélection d'habitudes, organisées proprement en catégories parentes et enfants. Tu suis « Course Zone 2 = 12 km » — les insights l'agrègent automatiquement sous <em>Course</em> et <em>Endurance</em>.", it: 'Il secondo tab di Discover: una selezione di abitudini, organizzate con chiarezza in categorie padre e figlie. Tracci «Corsa Zona 2 = 12 km» — gli insights lo aggregano automaticamente sotto <em>Corsa</em> e <em>Allenamento di resistenza</em>.' },
    'sc3b.li1': { de: 'Ausgewählte Gewohnheiten in einer Baum-Struktur — durchsuchbar und filterbar', en: 'Selected habits in a tree structure — searchable and filterable', es: 'Hábitos seleccionados en estructura de árbol — buscables y filtrables', fr: "Habitudes sélectionnées dans une arborescence — recherchables et filtrables", it: 'Abitudini selezionate in una struttura ad albero — ricercabili e filtrabili' },
    'sc3b.li2': { de: 'Hinter jeder Gewohnheit steht ein Lerninhalt — das Warum und Wie immer direkt verknüpft', en: 'Every habit is backed by its own lesson — the why and how always linked', es: 'Detrás de cada hábito hay un contenido de aprendizaje — el porqué y el cómo siempre vinculados', fr: "Derrière chaque habitude, un contenu d'apprentissage — le pourquoi et le comment toujours liés", it: 'Dietro ogni abitudine c’è un contenuto di apprendimento — il perché e il come sempre collegati' },
    'sc3b.li3': { de: 'Eigene Gewohnheiten selbst erstellen — Einheit, Richtung, Intervall frei wählen <span class="pro-pill">Pro</span>', en: 'Create your own habits — pick your own unit, direction and interval <span class="pro-pill">Pro</span>', es: 'Crear tus propios hábitos — elige unidad, dirección e intervalo <span class="pro-pill">Pro</span>', fr: "Créer tes propres habitudes — choisis l'unité, la direction et l'intervalle <span class=\"pro-pill\">Pro</span>", it: 'Creare le tue abitudini — scegli unità, direzione e intervallo <span class="pro-pill">Pro</span>' },
    'sc3b.alt': { de: 'Discover — Gewohnheiten-Sammlung mit ausgewählter Hierarchie (Screenshot folgt)', en: 'Discover — Habit library with structured hierarchy (screenshot pending)', es: 'Discover — Biblioteca de hábitos con jerarquía organizada (captura pendiente)', fr: 'Discover — Bibliothèque d’habitudes avec hiérarchie sélectionnée (capture à venir)', it: 'Discover — Biblioteca delle abitudini con gerarchia selezionata (screenshot in arrivo)' },

    'sc3.alt': { de: 'Discover — Lerninhalte mit eigenen redaktionellen ArcUp-Texten', en: 'Discover — Learning Content written in-house by ArcUp', es: 'Discover — Contenidos de aprendizaje propios de ArcUp', fr: "Discover — Contenus d'apprentissage rédigés par ArcUp", it: 'Discover — Contenuti di apprendimento scritti da ArcUp' },

    // 04 Compass
    'sc4.num': { de: '04 — Compass', en: '04 — Compass', es: '04 — Compass', fr: '04 — Compass', it: '04 — Compass' },
    'sc4.h':   { de: 'Deine Lebensbereiche im Blick.', en: 'Your life areas at a glance.', es: 'Tus áreas de vida de un vistazo.', fr: 'Tes domaines de vie en un coup d’œil.', it: 'Le tue aree di vita a colpo d’occhio.' }, // _x:'Der Compass. Dein Wheel of Life.', en: 'The Compass. Your Wheel of Life.', es: 'El Compass. Tu Wheel of Life.', fr: 'Le Compass. Votre Wheel of Life.', it: 'Il Compass. La tua Wheel of Life.' },
    'sc4.b':   { de: 'Bewerte deine sechs Lebensbereiche von 1 bis 10. Sieh, wo Balance fehlt. Schreibe Vision, Ziele und Tagebuch — paginiert, durchsuchbar, jederzeit editierbar.', en: 'Rate your six life areas from 1 to 10. See where balance is missing. Write vision, goals and journal — paginated, searchable, always editable.', es: 'Puntúa tus seis áreas de 1 a 10. Ve dónde falta equilibrio. Escribe visión, metas y diario — paginado, buscable, siempre editable.', fr: 'Notez vos six domaines de 1 à 10. Voyez où le déséquilibre se cache. Écrivez vision, objectifs et journal — paginé, cherchable, toujours éditable.', it: 'Valuta le tue sei aree da 1 a 10. Vedi dove manca equilibrio. Scrivi visione, obiettivi e diario — paginato, ricercabile, sempre modificabile.' },
    'sc4.li1': { de: 'Interaktiver Radar über Körper, Geist, Karriere, Beziehungen, Lebensstil, Ernährung', en: 'Interactive radar across Body, Mind, Career, Relationships, Lifestyle, Nutrition', es: 'Radar interactivo sobre Cuerpo, Mente, Carrera, Relaciones, Estilo de vida, Nutrición', fr: 'Radar interactif sur Corps, Esprit, Carrière, Relations, Style de vie, Nutrition', it: 'Radar interattivo su Corpo, Mente, Carriera, Relazioni, Stile di vita, Alimentazione' },
    'sc4.li2': { de: 'Vision-Statement pro Bereich <span class="pro-pill">Pro</span>', en: 'Vision statement per area <span class="pro-pill">Pro</span>', es: 'Declaración de visión por área <span class="pro-pill">Pro</span>', fr: "Énoncé de vision par domaine <span class=\"pro-pill\">Pro</span>", it: 'Dichiarazione di visione per area <span class="pro-pill">Pro</span>' },
    'sc4.liGoals': { de: 'Ziele mit Fälligkeit pro Bereich — wöchentlich, monatlich, jährlich <span class="pro-pill">Pro</span>', en: 'Goals with due dates per area — weekly, monthly, yearly <span class="pro-pill">Pro</span>', es: 'Objetivos con fecha por área — semanal, mensual, anual <span class="pro-pill">Pro</span>', fr: "Objectifs avec échéance par domaine — hebdo, mensuel, annuel <span class=\"pro-pill\">Pro</span>", it: 'Obiettivi con scadenza per area — settimanale, mensile, annuale <span class="pro-pill">Pro</span>' },
    'sc4.li3': { de: 'Tagebuch in vier Typen: Gedanke, Lernen, Dankbarkeit, Erfolge &amp; Verluste <span class="pro-pill">Pro</span>', en: 'Journal in four types: Thought, Learning, Gratitude, Wins &amp; Losses <span class="pro-pill">Pro</span>', es: 'Diario en cuatro tipos: Pensamiento, Aprendizaje, Gratitud, Logros y pérdidas <span class="pro-pill">Pro</span>', fr: "Journal en quatre types : Pensée, Apprentissage, Gratitude, Victoires et pertes <span class=\"pro-pill\">Pro</span>", it: 'Diario in quattro tipi: Pensiero, Apprendimento, Gratitudine, Vittorie e perdite <span class="pro-pill">Pro</span>' },
    'sc4.li4': { de: 'Insights mit Heatmaps, 90-Tage-Profil und Gewohnheits-Korrelationen <span class="pro-pill">Pro</span>', en: 'Insights with heatmaps, 90-day profile and habit correlations <span class="pro-pill">Pro</span>', es: 'Insights con heatmaps, perfil de 90 días y correlaciones entre hábitos <span class="pro-pill">Pro</span>', fr: 'Insights avec heatmaps, profil 90 jours et corrélations entre habitudes <span class="pro-pill">Pro</span>', it: 'Insights con heatmap, profilo 90 giorni e correlazioni tra abitudini <span class="pro-pill">Pro</span>' },
    'sc4.alt': { de: 'Compass — Lebensrad-Radar über deine Lebensbereiche', en: 'Compass — Wheel-of-Life radar across your life areas', es: 'Compass — radar Rueda de la vida sobre tus áreas de vida', fr: "Compass — radar Roue de la vie sur tes domaines de vie", it: 'Compass — radar Ruota della vita sulle tue aree di vita' },

    // ─── AREAS ───────────────────────────────────────────
    'areas.overline': { de: 'Der Rahmen', en: 'The framework', es: 'El marco', fr: 'Le cadre', it: 'La cornice' },
    'areas.title':    { de: 'Das große Ganze<br />im Blick.', en: 'The big picture,<br />in focus.', es: 'La imagen completa,<br />a la vista.', fr: "La vue d'ensemble,<br />toujours en vue.", it: 'Il quadro generale,<br />sempre in vista.' },
    'areas.sub':      { de: 'Jeder Lerninhalt, jede Gewohnheit und jeder ARC gehört zu genau einem Lebensbereich. Das hält den Fokus klar und verhindert „passt-überall"-Inhalte.', en: 'Every piece of learning content, habit and ARC belongs to exactly one life area. That keeps the focus sharp and prevents "fits anywhere" content.', es: 'Cada contenido de aprendizaje, cada hábito y cada ARC pertenece a exactamente una área de vida. Eso mantiene el foco nítido y evita el contenido «encaja en todas partes».', fr: "Chaque contenu d'apprentissage, chaque habitude et chaque ARC appartient à un seul domaine de vie. Cela garde le focus clair et évite le contenu « utile partout ».", it: 'Ogni contenuto di apprendimento, ogni abitudine e ogni ARC appartiene a una sola area di vita. Così il focus resta nitido e si evitano contenuti «buoni per tutto».' }, // _x:'...Das hält den Compass scharf...', en: 'Every source, habit and ARC belongs to exactly one area. That keeps the Compass sharp and prevents "fits anywhere" content.', es: 'Cada fuente, hábito y ARC pertenece a una sola área. Eso mantiene el Compass afilado y evita el contenido «encaja en todas partes».', fr: "Chaque source, habitude et ARC appartient à un seul domaine. Cela garde le Compass net et évite le contenu « utile partout ».", it: 'Ogni fonte, abitudine e ARC appartiene a una sola area. Così il Compass resta nitido e si evitano contenuti «buoni per tutto».' },

    'a1.h': { de: 'Körper', en: 'Body', es: 'Cuerpo', fr: 'Corps', it: 'Corpo' },
    'a1.d': { de: 'Ausdauer, Kraft, Beweglichkeit, Schlaf, Erholung.', en: 'Endurance, strength, mobility, sleep, recovery.', es: 'Resistencia, fuerza, movilidad, sueño, recuperación.', fr: 'Endurance, force, mobilité, sommeil, récupération.', it: 'Resistenza, forza, mobilità, sonno, recupero.' },
    'a1.q': { de: 'Was trägt dich durch dein Leben?', en: 'What carries you through your life?', es: '¿Qué te sostiene en tu vida?', fr: 'Qu’est-ce qui vous porte à travers la vie ?', it: 'Cosa ti porta avanti nella vita?' },

    'a2.h': { de: 'Geist', en: 'Mind', es: 'Mente', fr: 'Esprit', it: 'Mente' },
    'a2.d': { de: 'Meditation, Fokus, Stress-Regulation, Resilienz.', en: 'Meditation, focus, stress regulation, resilience.', es: 'Meditación, foco, regulación del estrés, resiliencia.', fr: 'Méditation, concentration, régulation du stress, résilience.', it: 'Meditazione, focus, regolazione dello stress, resilienza.' },
    'a2.q': { de: 'Wer bist du, wenn es leise wird?', en: 'Who are you when it gets quiet?', es: '¿Quién eres cuando se hace el silencio?', fr: 'Qui êtes-vous quand le silence se fait ?', it: 'Chi sei quando cala il silenzio?' },

    'a3.h': { de: 'Karriere', en: 'Career', es: 'Carrera', fr: 'Carrière', it: 'Carriera' },
    'a3.d': { de: 'Lesen, Lernen, konzentriertes Arbeiten, Karriere, Finanzen.', en: 'Reading, learning, deep work, career, finance.', es: 'Lectura, aprendizaje, trabajo profundo, carrera, finanzas.', fr: 'Lecture, apprentissage, travail en profondeur, carrière, finances.', it: 'Lettura, apprendimento, lavoro profondo, carriera, finanze.' },
    'a3.q': { de: 'Was lernst du, das dich verändert?', en: 'What are you learning that changes you?', es: '¿Qué aprendes que te transforma?', fr: "Qu'apprenez-vous qui vous transforme ?", it: 'Cosa stai imparando che ti trasforma?' },

    'a4.h': { de: 'Beziehungen', en: 'Relationships', es: 'Relaciones', fr: 'Relations', it: 'Relazioni' },
    'a4.d': { de: 'Partnerschaft, Familie, Freunde, Netzwerk, Versöhnung.', en: 'Partnership, family, friends, network, repair.', es: 'Pareja, familia, amigos, red, reparación.', fr: 'Couple, famille, amis, réseau, réparation.', it: 'Coppia, famiglia, amici, rete, riparazione.' },
    'a4.q': { de: 'Wer steht dir wirklich nahe?', en: 'Who is really close to you?', es: '¿Quién está realmente cerca de ti?', fr: 'Qui te tient vraiment à cœur ?', it: 'Chi ti è davvero vicino?' },

    'a5.h': { de: 'Lebensstil', en: 'Lifestyle', es: 'Estilo de vida', fr: 'Style de vie', it: 'Stile di vita' },
    'a5.d': { de: 'Hobbys, Natur, Kreativität, Spiel, digitale Auszeit.', en: 'Hobbies, nature, creativity, play, digital detox.', es: 'Aficiones, naturaleza, creatividad, juego, detox digital.', fr: 'Loisirs, nature, créativité, jeu, détox numérique.', it: 'Hobby, natura, creatività, gioco, detox digitale.' },
    'a5.q': { de: 'Was tust du, wenn niemand zusieht?', en: 'What do you do when nobody is watching?', es: '¿Qué haces cuando nadie mira?', fr: 'Que faites-vous quand personne ne regarde ?', it: 'Cosa fai quando nessuno guarda?' },

    'a6.h': { de: 'Ernährung', en: 'Nutrition', es: 'Nutrición', fr: 'Nutrition', it: 'Alimentazione' },
    'a6.d': { de: 'Ausgewogene Mahlzeiten, Protein, Hydration, Whole Foods.', en: 'Balanced meals, protein, hydration, whole foods.', es: 'Comidas equilibradas, proteína, hidratación, alimentos integrales.', fr: 'Repas équilibrés, protéines, hydratation, aliments complets.', it: 'Pasti equilibrati, proteine, idratazione, cibi integrali.' },
    'a6.q': { de: 'Was gibst du deinem Körper jeden Tag?', en: 'What do you feed your body every day?', es: '¿Qué le das a tu cuerpo cada día?', fr: 'Que donnes-tu à ton corps chaque jour ?', it: 'Cosa dai al tuo corpo ogni giorno?' },

    // ─── NOT THIS ────────────────────────────────────────
    'not.over': { de: 'Was wir bewusst weggelassen haben', en: 'What we deliberately left out', es: 'Lo que dejamos fuera a propósito', fr: 'Ce que nous avons volontairement laissé de côté', it: 'Ciò che abbiamo lasciato fuori di proposito' },
    'not.h':    { de: 'Was ArcUp <em>nicht</em> ist.', en: 'What ArcUp is <em>not</em>.', es: 'Lo que ArcUp <em>no</em> es.', fr: "Ce qu’ArcUp <em>n'est pas</em>.", it: 'Cosa ArcUp <em>non</em> è.' },
    'not.sub':  { de: 'Genauso wichtig wie die Features: was nicht in der App ist — und warum.', en: 'Just as important as the features: what is not in the app — and why.', es: 'Tan importante como las funciones: lo que no está en la app — y por qué.', fr: "Aussi important que les fonctionnalités : ce qui n'est pas dans l'app — et pourquoi.", it: 'Importante quanto le funzioni: ciò che non c’è nell’app — e perché.' },

    'not1.h': { de: 'Kein To-Do-Manager.', en: 'Not a to-do manager.', es: 'No es un gestor de tareas.', fr: 'Pas un gestionnaire de tâches.', it: 'Non è un gestore di to-do.' },
    'not1.b': { de: 'Gewohnheiten sind keine Aufgaben mit Deadline. Ziele haben einen eigenen Platz.', en: 'Habits are not deadlined tasks. Goals have their own place.', es: 'Los hábitos no son tareas con fecha. Las metas tienen su propio lugar.', fr: 'Les habitudes ne sont pas des tâches à échéance. Les objectifs ont leur propre espace.', it: 'Le abitudini non sono task con scadenza. Gli obiettivi hanno il loro spazio.' },

    'not2.h': { de: 'Kein generischer Gewohnheits-Tracker.', en: 'Not a generic habit tracker.', es: 'No es un tracker de hábitos genérico.', fr: 'Pas un tracker d’habitudes générique.', it: 'Non è un tracker di abitudini generico.' },
    'not2.b': { de: 'Ein generischer Tracker kennt nur „erledigt". ArcUp misst, wie viel — „5,2 km gelaufen" — und nutzt ein klares Ja/Nein nur dort, wo es der ehrlichere Maßstab ist.', en: 'Not "did sport today yes/no". But "ran 5.2 km today". Numeric, always.', es: 'No «hice deporte sí/no». Sino «corrí 5,2 km hoy». Numérico, siempre.', fr: "Pas « fait du sport oui/non ». Mais « couru 5,2 km aujourd'hui ». Chiffré, toujours.", it: 'Non «fatto sport sì/no». Ma «corsi 5,2 km oggi». Numerico, sempre.' },

    'not3.h': { de: 'Kein Social Network.', en: 'Not a social network.', es: 'No es una red social.', fr: 'Pas un réseau social.', it: 'Non è un social network.' },
    'not3.b': { de: 'Keine Follower, keine Likes, keine Posts. Deine Insights sind privat.', en: 'No followers, no likes, no posts. Your insights are private.', es: 'Sin seguidores, sin likes, sin publicaciones. Tus insights son privados.', fr: 'Pas de followers, de likes, ni de posts. Vos insights sont privés.', it: 'Niente follower, like o post. I tuoi insights sono privati.' },

    'not4.h': { de: 'Kein Streak um jeden Preis.', en: 'No streak at any cost.', es: 'No racha a cualquier precio.', fr: 'Pas de série à tout prix.', it: 'Niente streak a tutti i costi.' },
    'not4.b': { de: 'Streaks gibt es, aber Ruhetage sind eingebaut. Es gibt keinen Streak-Schutz.', en: 'Streaks exist, but rest days are built in. No streak shields.', es: 'Hay rachas, pero los días de descanso están integrados. Sin escudos de racha.', fr: 'Les séries existent, mais les jours de repos sont prévus. Pas de « boucliers de série ».', it: 'Le streak ci sono, ma i giorni di riposo sono integrati. Niente streak shield.' },

    'not5.h': { de: 'Keine Datenfalle.', en: 'No data trap.', es: 'Sin trampa de datos.', fr: 'Pas de piège à données.', it: 'Nessuna trappola dei dati.' },
    'not5.b': { de: 'Voller ZIP-Export deiner Daten jederzeit. Konto-Reset und -Löschung mit einem Tap. Deine Daten gehören dir.', en: 'Full ZIP export of your data any time. Account reset and deletion with one tap. Your data is yours.', es: 'Exportación ZIP completa de tus datos cuando quieras. Reset y eliminación de cuenta con un toque. Tus datos son tuyos.', fr: "Export ZIP complet de tes données à tout moment. Réinitialisation et suppression du compte en un tap. Tes données t’appartiennent.", it: 'Export ZIP completo dei tuoi dati in qualsiasi momento. Reset e cancellazione account con un tap. I tuoi dati sono tuoi.' },

    'not6.h': { de: 'Keine Tricks, keine Fallen.', en: 'No tricks, no traps.', es: 'Sin trucos, sin trampas.', fr: 'Pas d’astuces, pas de pièges.', it: 'Niente trucchi, niente trappole.' },
    'not6.b': { de: 'Keine Tracker, kein Notification-Spam, keine versteckten Fallen, die dich länger in der App halten. EU-Hosting nach DSGVO.', en: 'No trackers, no notification spam, no hidden tricks to keep you in the app longer. EU hosting under GDPR.', es: 'Sin rastreadores, sin spam de notificaciones, sin trampas ocultas para retenerte más en la app. Hosting UE conforme al RGPD.', fr: 'Pas de trackers, pas de spam de notifications, pas de pièges cachés pour te retenir plus longtemps. Hébergement UE conforme au RGPD.', it: 'Niente tracker, niente spam di notifiche, niente trappole nascoste per trattenerti più a lungo. Hosting UE conforme al GDPR.' },

    // ─── FOUNDER NOTE ────────────────────────────────────
    'founder.over': { de: 'Hinter ArcUp', en: 'Behind ArcUp', es: 'Detrás de ArcUp', fr: 'Derrière ArcUp', it: 'Dietro ad ArcUp' },
    'founder.h':    { de: 'Hi, ich bin Michael.', en: 'Hi, I’m Michael.', es: 'Hola, soy Michael.', fr: 'Salut, je suis Michael.', it: 'Ciao, sono Michael.' },
    'founder.b1':   { de: 'Ich bin überzeugt: persönliche Entwicklung verdient ein ehrliches System — strukturiert, durchdacht und messbar, statt dem Zufall überlassen. Genau das baue ich mit ArcUp: ein Werkzeug, das dir hilft, an deinen Zielen dranzubleiben und echten Fortschritt zu sehen.', en: 'I believe personal development deserves an honest system — structured, considered and measurable, not left to chance. That’s exactly what I’m building with ArcUp: a tool that helps you stick with your goals and see real progress.', es: 'Estoy convencido: el desarrollo personal merece un sistema honesto — estructurado, pensado y medible, no dejado al azar. Eso es justo lo que construyo con ArcUp: una herramienta que te ayuda a no abandonar tus objetivos y a ver progreso real.', fr: "J'en suis convaincu : le développement personnel mérite un système honnête — structuré, réfléchi et mesurable, pas laissé au hasard. C'est exactement ce que je construis avec ArcUp : un outil qui t'aide à tenir tes objectifs et à voir de vrais progrès.", it: 'Ne sono convinto: lo sviluppo personale merita un sistema onesto — strutturato, ragionato e misurabile, non lasciato al caso. È esattamente ciò che costruisco con ArcUp: uno strumento che ti aiuta a restare fedele ai tuoi obiettivi e a vedere progressi reali.' },
    'founder.b2':   { de: 'Ich entwickle ArcUp allein, in Österreich — ohne Investoren im Nacken und ohne Wachstumsdruck. So kann ich die App genau so bauen, wie ich sie selbst täglich nutzen will. Wenn dir etwas fehlt oder du einen Bug findest, schreib mir über das Feedback-Formular in der App — das landet direkt bei mir.', en: 'I build ArcUp on my own, in Austria — no investors breathing down my neck, no pressure to grow at all costs. That lets me build the app exactly the way I want to use it myself, every day. If something’s missing or you find a bug, write to me through the feedback form in the app — it lands straight in my inbox.', es: 'Desarrollo ArcUp yo solo, en Austria — sin inversores presionando ni obligación de crecer a toda costa. Eso me permite construir la app exactamente como quiero usarla yo mismo cada día. Si te falta algo o encuentras un bug, escríbeme desde el formulario de feedback de la app — me llega directamente.', fr: "Je développe ArcUp seul, en Autriche — sans investisseurs sur le dos ni pression de croissance à tout prix. Ça me permet de construire l'app exactement comme je veux l'utiliser moi-même, chaque jour. S'il te manque quelque chose ou si tu trouves un bug, écris-moi via le formulaire de feedback dans l'app — ça arrive directement chez moi.", it: 'Sviluppo ArcUp da solo, in Austria — senza investitori col fiato sul collo né pressione a crescere a tutti i costi. Così posso costruire l’app esattamente come voglio usarla io stesso, ogni giorno. Se ti manca qualcosa o trovi un bug, scrivimi dal modulo di feedback nell’app — arriva direttamente a me.' },

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
    'pf.advancedInsights': { de: 'Erweiterte Insights',          en: 'Advanced Insights',           es: 'Insights Avanzados',          fr: 'Insights Avancés',           it: 'Insights Avanzati' },
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
    'pr.pro.tag':             { de: 'Alle Features. Starte mit 7 Tagen gratis.', en: 'All features. Start with 7 days free.', es: 'Todas las funciones. Empieza con 7 días gratis.', fr: 'Toutes les fonctions. Commence avec 7 jours gratuits.', it: 'Tutte le funzioni. Inizia con 7 giorni gratis.' },
    'pr.pro.monthly.unit':    { de: '/ Monat', en: '/ month', es: '/ mes', fr: '/ mois', it: '/ mese' },
    'pr.pro.monthly.label':   { de: 'monatlich · jederzeit kündbar', en: 'monthly · cancel any time', es: 'mensual · cancela cuando quieras', fr: 'mensuel · résiliable à tout moment', it: 'mensile · cancellabile in qualsiasi momento' },
    'pr.pro.yearly.unit':     { de: '/ Jahr', en: '/ year', es: '/ año', fr: '/ an', it: '/ anno' },
    'pr.pro.yearly.label':    { de: 'jährlich · spart ca. 40 %', en: 'yearly · saves about 40%', es: 'anual · ahorra ~40 %', fr: 'annuel · économise environ 40 %', it: 'annuale · risparmia circa il 40 %' },
    'pr.pro.cta':             { de: 'Gratis testen', en: 'Start free trial', es: 'Probar gratis', fr: 'Essayer gratuitement', it: 'Prova gratis' },
    'pr.pro.trial':           { de: '7 Tage gratis testen — danach automatische Verlängerung, jederzeit kündbar.', en: '7 days free — then auto-renews, cancel anytime.', es: '7 días gratis — luego se renueva automáticamente, cancela cuando quieras.', fr: '7 jours gratuits — puis renouvellement automatique, résiliable à tout moment.', it: '7 giorni gratis — poi rinnovo automatico, disdici quando vuoi.' },


    // ─── FAQ ─────────────────────────────────────────────
    'faq.over': { de: 'FAQ', en: 'FAQ', es: 'FAQ', fr: 'FAQ', it: 'FAQ' },
    'faq.h':    { de: 'Häufige Fragen.', en: 'Frequently asked questions.', es: 'Preguntas frecuentes.', fr: 'Questions fréquentes.', it: 'Domande frequenti.' },
    // Old faq1–faq12 keys removed — replaced by faq01–faq40 (see FAQ v2 section below).

    // ─── CTA ─────────────────────────────────────────────
    'cta.h':   { de: 'Starte einen <em>ARC</em>,<br />keinen Vorsatz.', en: 'Start an <em>ARC</em>,<br />not a resolution.', es: 'Empieza un <em>ARC</em>,<br />no un propósito.', fr: 'Lancez un <em>ARC</em>,<br />pas une résolution.', it: 'Lancia un <em>ARC</em>,<br />non un buon proposito.' },
    'cta.sub': { de: 'Pick your ARC, lock in, and finish stronger.', en: 'Pick your ARC, lock in, and finish stronger.', es: 'Pick your ARC, lock in, and finish stronger.', fr: 'Pick your ARC, lock in, and finish stronger.', it: 'Pick your ARC, lock in, and finish stronger.' },
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
      de: 'Stand: 13. Juni 2026',
      en: 'Last updated: 13 June 2026',
      es: 'Última actualización: 13 de junio de 2026',
      fr: 'Dernière mise à jour : 13 juin 2026',
      it: 'Ultimo aggiornamento: 13 giugno 2026',
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
    'faqs.tracking':   { de: 'Tracking &amp; Logbuch', en: 'Tracking &amp; logging', es: 'Seguimiento y registro', fr: 'Suivi et journal', it: 'Tracciamento e log' },
    'faqs.streaks':    { de: 'Streaks &amp; Ruhetage', en: 'Streaks &amp; rest days', es: 'Rachas y días de descanso', fr: 'Streaks et jours de repos', it: 'Streak e giorni di riposo' },
    'faqs.library':    { de: 'Lerninhalte', en: 'Learning Content', es: 'Contenidos de aprendizaje', fr: "Contenus d'apprentissage", it: 'Contenuti di apprendimento' },
    'faqs.freePro':    { de: 'Free vs Pro', en: 'Free vs Pro', es: 'Free vs Pro', fr: 'Free vs Pro', it: 'Free vs Pro' },
    'faqs.insights':   { de: 'Insights &amp; Reflexion', en: 'Insights &amp; reflection', es: 'Insights y reflexión', fr: 'Insights et réflexion', it: 'Insights e riflessione' },
    'faqs.privacy':    { de: 'Daten &amp; Datenschutz', en: 'Data &amp; privacy', es: 'Datos y privacidad', fr: 'Données et confidentialité', it: 'Dati e privacy' },

    // ─── FAQ v2 — 01–10 (Basics, ARCs & Habits) ──────────
    'faq03.q': { de: 'Was ist ein ARC?', en: 'What is an ARC?', es: '¿Qué es un ARC?', fr: "Qu'est-ce qu'un ARC ?", it: "Cos'è un ARC?" },
    'faq03.a': {
      de: 'Ein ARC ist eine <strong>zeitlich begrenzte Challenge</strong> von 1 bis 12 Wochen, die mehrere Gewohnheiten zu einem fokussierten Vorhaben bündelt – zum Beispiel „Tiefer schlafen in 4 Wochen" oder „30 Tage Atem-Reset". Jeder ARC hat ein klares Versprechen, eine Theorie (das <em>Warum</em>), praktische Tipps (das <em>Wie</em>) und 3 bis 12 konkrete Gewohnheiten mit individuellen Zielen. ARCs haben einen Anfang und ein Ende – im Gegensatz zu endlosen Tracking-Streaks.',
      en: 'An ARC is a <strong>time-boxed challenge</strong> of 1 to 12 weeks that bundles several habits into one focused project — for example "Sleep deeper in 4 weeks" or "30-day breath reset". Every ARC has a clear promise, a theory (the <em>why</em>), practical tips (the <em>how</em>) and 3 to 12 concrete habits with individual targets. ARCs have a start and an end — unlike endless tracking streaks.',
      es: 'Un ARC es un <strong>reto limitado en el tiempo</strong> de 1 a 12 semanas que agrupa varios hábitos en un proyecto enfocado — por ejemplo «Dormir mejor en 4 semanas» o «30 días de reset de respiración». Cada ARC tiene una promesa clara, una teoría (el <em>porqué</em>), consejos prácticos (el <em>cómo</em>) y de 3 a 12 hábitos concretos con objetivos individuales. Los ARCs tienen inicio y final — a diferencia de las rachas infinitas.',
      fr: "Un ARC est un <strong>défi limité dans le temps</strong> de 1 à 12 semaines qui regroupe plusieurs habitudes dans un projet focalisé — par exemple « Mieux dormir en 4 semaines » ou « 30 jours de reset respiration ». Chaque ARC a une promesse claire, une théorie (le <em>pourquoi</em>), des conseils pratiques (le <em>comment</em>) et de 3 à 12 habitudes concrètes avec des objectifs individuels. Les ARC ont un début et une fin — contrairement aux séries infinies.",
      it: "Un ARC è una <strong>sfida a tempo limitato</strong> di 1 a 12 settimane che riunisce più abitudini in un progetto focalizzato — per esempio «Dormire meglio in 4 settimane» o «30 giorni di reset del respiro». Ogni ARC ha una promessa chiara, una teoria (il <em>perché</em>), consigli pratici (il <em>come</em>) e da 3 a 12 abitudini concrete con obiettivi individuali. Gli ARC hanno un inizio e una fine — a differenza degli streak infiniti.",
    },
    'faq04.q': { de: 'Was sind die sechs Lebensbereiche?', en: 'What are the six life areas?', es: '¿Cuáles son las seis áreas de vida?', fr: 'Quels sont les six domaines de vie ?', it: 'Quali sono le sei aree di vita?' },
    'faq04.a': {
      de: 'ArcUp arbeitet mit genau sechs Lebensbereichen:<ul><li><strong>Körper</strong> – Sport, Schlaf, Erholung</li><li><strong>Geist</strong> – Meditation, Achtsamkeit, Stress-Regulation</li><li><strong>Karriere</strong> – Lernen, Lesen, Projekte, Ziele</li><li><strong>Beziehungen</strong> – gemeinsame Zeit, aktives Zuhören, Familienrituale</li><li><strong>Lebensstil</strong> – Hobbys, Naturzeit, kreative Aktivitäten</li><li><strong>Ernährung</strong> – ausgewogene Mahlzeiten, Protein, Hydration, Whole Foods</li></ul>Du bewertest jeden Bereich regelmäßig auf einer Skala von 1–10 (Lebensrad), schreibst eine persönliche Vision dazu und siehst auf einen Blick, wo gerade die Balance fehlt.',
      en: 'ArcUp works with exactly six life areas:<ul><li><strong>Body</strong> — sport, sleep, recovery</li><li><strong>Mind</strong> — meditation, mindfulness, stress regulation</li><li><strong>Career</strong> — learning, reading, projects, goal setting</li><li><strong>Relationships</strong> — quality time, active listening, family rituals</li><li><strong>Lifestyle</strong> — hobbies, time in nature, creative activities</li><li><strong>Nutrition</strong> — balanced meals, protein, hydration, whole foods</li></ul>You rate each area regularly on a scale of 1–10 (Wheel of Life), write a personal vision and see at a glance where balance is missing.',
      es: 'ArcUp trabaja con exactamente seis áreas de vida:<ul><li><strong>Cuerpo</strong> — deporte, sueño, recuperación</li><li><strong>Mente</strong> — meditación, atención plena, regulación del estrés</li><li><strong>Carrera</strong> — aprendizaje, lectura, proyectos, metas</li><li><strong>Relaciones</strong> — tiempo de calidad, escucha activa, rituales familiares</li><li><strong>Estilo de vida</strong> — aficiones, naturaleza, actividades creativas</li><li><strong>Nutrición</strong> — comidas equilibradas, proteína, hidratación, alimentos integrales</li></ul>Puntúas cada área regularmente del 1 al 10 (Rueda de la vida), escribes una visión personal y ves de un vistazo dónde falta equilibrio.',
      fr: "ArcUp s'appuie sur exactement six domaines de vie :<ul><li><strong>Corps</strong> — sport, sommeil, récupération</li><li><strong>Esprit</strong> — méditation, pleine conscience, gestion du stress</li><li><strong>Carrière</strong> — apprentissage, lecture, projets, objectifs</li><li><strong>Relations</strong> — temps de qualité, écoute active, rituels familiaux</li><li><strong>Style de vie</strong> — passe-temps, nature, activités créatives</li><li><strong>Nutrition</strong> — repas équilibrés, protéines, hydratation, aliments complets</li></ul>Tu notes chaque domaine régulièrement de 1 à 10 (Roue de la vie), tu écris une vision personnelle et tu vois d'un coup d'œil où l'équilibre manque.",
      it: 'ArcUp lavora con esattamente sei aree di vita:<ul><li><strong>Corpo</strong> — sport, sonno, recupero</li><li><strong>Mente</strong> — meditazione, mindfulness, regolazione dello stress</li><li><strong>Carriera</strong> — apprendimento, lettura, progetti, obiettivi</li><li><strong>Relazioni</strong> — tempo di qualità, ascolto attivo, rituali familiari</li><li><strong>Stile di vita</strong> — hobby, natura, attività creative</li><li><strong>Alimentazione</strong> — pasti equilibrati, proteine, idratazione, cibi integrali</li></ul>Valuti ogni area regolarmente da 1 a 10 (Ruota della vita), scrivi una visione personale e vedi a colpo d’occhio dove manca equilibrio.',
    },
    'faq06.q': { de: 'Wie unterscheiden sich Gewohnheiten, ARCs und Ziele?', en: 'What is the difference between habits, ARCs and goals?', es: '¿En qué se diferencian hábitos, ARCs y objetivos?', fr: 'Quelle est la différence entre habitudes, ARC et objectifs ?', it: 'Qual è la differenza tra abitudini, ARC e obiettivi?' },
    'faq06.a': {
      de: '<ul><li><strong>Gewohnheiten</strong> sind die atomaren, messbaren Einheiten – z. B. „Laufen in km".</li><li><strong>ARCs</strong> bündeln Gewohnheiten zu einer zeitlich begrenzten Challenge mit konkreten Zielwerten.</li><li><strong>Ziele</strong> sind separate, einmalige Vorhaben mit Fälligkeitsdatum („Bis Ende Mai 5 km am Stück laufen") und gehören zum jeweiligen Lebensbereich.</li></ul>Ziele sind Aufgaben mit Deadline. Gewohnheiten sind die Messskala, auf der dein Verhalten sichtbar wird.',
      en: '<ul><li><strong>Habits</strong> are the atomic, measurable units — e.g. "running in km".</li><li><strong>ARCs</strong> bundle habits into a time-boxed challenge with concrete targets.</li><li><strong>Goals</strong> are separate, one-off projects with a due date ("Run 5 km in one go by end of May") and live inside their life area.</li></ul>Goals are tasks with deadlines. Habits are the scale on which your behaviour becomes visible.',
      es: '<ul><li><strong>Hábitos</strong> son las unidades atómicas medibles — por ejemplo «correr en km».</li><li><strong>ARCs</strong> agrupan hábitos en un reto limitado en el tiempo con objetivos concretos.</li><li><strong>Objetivos</strong> son proyectos separados, únicos, con fecha límite («Correr 5 km de un tirón antes de fin de mayo») y pertenecen a su área de vida.</li></ul>Los objetivos son tareas con fecha. Los hábitos son la escala en la que se hace visible tu comportamiento.',
      fr: "<ul><li><strong>Habitudes</strong> sont les unités atomiques, mesurables — par exemple « course en km ».</li><li><strong>ARC</strong> regroupent des habitudes dans un défi limité dans le temps avec des objectifs concrets.</li><li><strong>Objectifs</strong> sont des projets séparés et ponctuels avec une échéance (« Courir 5 km d'une traite d'ici fin mai ») et vivent dans leur domaine de vie.</li></ul>Les objectifs sont des tâches avec date butoir. Les habitudes sont l'échelle sur laquelle ton comportement devient visible.",
      it: '<ul><li><strong>Abitudini</strong> sono le unità atomiche misurabili — es. «corsa in km».</li><li><strong>ARC</strong> riuniscono abitudini in una sfida a tempo limitato con obiettivi concreti.</li><li><strong>Obiettivi</strong> sono progetti separati e una tantum con scadenza («Correre 5 km filati entro fine maggio») e vivono nella loro area di vita.</li></ul>Gli obiettivi sono compiti con scadenza. Le abitudini sono la scala su cui il tuo comportamento diventa visibile.',
    },
    'faq08.q': { de: 'Was bedeutet „Mindestens" und „Höchstens" bei einer Gewohnheit?', en: 'What do "Above" and "Below" mean for a habit?', es: '¿Qué significan «Mínimo» y «Máximo» en un hábito?', fr: 'Que signifient « Minimum » et « Maximum » pour une habitude ?', it: 'Cosa significano «Minimo» e «Massimo» per un’abitudine?' },
    'faq08.a': {
      de: '<ul><li><strong>≥ (Mindestens):</strong> Der Zielwert ist eine Untergrenze – du erreichst ihn, wenn dein Wert ihn trifft oder überschreitet. Beispiel: 10.000 Schritte.</li><li><strong>≤ (Höchstens):</strong> Der Zielwert ist eine Obergrenze – du erreichst ihn, wenn dein Wert ihn nicht überschreitet. Beispiel: maximal 2 Stunden Bildschirmzeit.</li></ul>',
      en: '<ul><li><strong>≥ (Above):</strong> the target is a lower bound — you hit it when your value meets or exceeds it. Example: 10,000 steps.</li><li><strong>≤ (Below):</strong> the target is an upper bound — you hit it when your value doesn’t exceed it. Example: max. 2 hours of screen time.</li></ul>',
      es: '<ul><li><strong>≥ (Mínimo):</strong> el objetivo es un límite inferior — lo alcanzas si tu valor lo iguala o supera. Ejemplo: 10.000 pasos.</li><li><strong>≤ (Máximo):</strong> el objetivo es un límite superior — lo alcanzas si tu valor no lo supera. Ejemplo: máximo 2 horas de pantalla.</li></ul>',
      fr: "<ul><li><strong>≥ (Minimum) :</strong> la cible est une limite basse — tu l'atteins si ta valeur l'égale ou la dépasse. Exemple : 10 000 pas.</li><li><strong>≤ (Maximum) :</strong> la cible est une limite haute — tu l'atteins si ta valeur ne la dépasse pas. Exemple : max. 2 h d'écran.</li></ul>",
      it: "<ul><li><strong>≥ (Minimo):</strong> l'obiettivo è un limite inferiore — lo raggiungi se il tuo valore lo eguaglia o lo supera. Esempio: 10.000 passi.</li><li><strong>≤ (Massimo):</strong> l'obiettivo è un limite superiore — lo raggiungi se il tuo valore non lo supera. Esempio: max. 2 ore di schermo.</li></ul>",
    },
    'faq09.q': { de: 'Was ist der Unterschied zwischen täglichen und wöchentlichen Gewohnheiten?', en: 'What is the difference between daily and weekly habits?', es: '¿Cuál es la diferencia entre hábitos diarios y semanales?', fr: 'Quelle est la différence entre habitudes quotidiennes et hebdomadaires ?', it: "Qual è la differenza tra abitudini giornaliere e settimanali?" },
    'faq09.a': {
      de: 'Tägliche Gewohnheiten werden <strong>pro Tag</strong> geprüft (z. B. 10 min Meditation täglich). Wöchentliche Gewohnheiten akkumulieren <strong>über die ganze ARC-Woche</strong> (z. B. 3 Krafttrainings pro Woche). Bei wöchentlichen Gewohnheiten zählt jede Eintragung in die Wochensumme; das Ziel ist erreicht, sobald die Summe es trifft.',
      en: 'Daily habits are checked <strong>per day</strong> (e.g. 10 min meditation daily). Weekly habits accumulate <strong>over the whole ARC week</strong> (e.g. 3 strength sessions per week). With weekly habits, every entry adds to the weekly sum; the target is hit as soon as the sum reaches it.',
      es: 'Los hábitos diarios se evalúan <strong>por día</strong> (p. ej. 10 min de meditación al día). Los semanales se acumulan <strong>durante toda la semana del ARC</strong> (p. ej. 3 sesiones de fuerza por semana). En los semanales cada entrada suma al total; el objetivo se cumple cuando la suma lo alcanza.',
      fr: "Les habitudes quotidiennes sont vérifiées <strong>par jour</strong> (par ex. 10 min de méditation par jour). Les hebdomadaires s'accumulent <strong>sur toute la semaine de l'ARC</strong> (par ex. 3 séances de musculation par semaine). Pour les hebdomadaires, chaque saisie compte dans la somme hebdo ; la cible est atteinte dès que la somme l'atteint.",
      it: "Le abitudini giornaliere si verificano <strong>per giorno</strong> (es. 10 min di meditazione al giorno). Le settimanali si accumulano <strong>sull'intera settimana dell'ARC</strong> (es. 3 sessioni di forza a settimana). Nelle settimanali ogni inserimento conta nella somma; l'obiettivo è raggiunto appena la somma lo tocca.",
    },
    'faq10.q': { de: 'Was ist der Stufenaufbau bei einem ARC?', en: 'What is the Build-up (staged ARC)?', es: '¿Qué es la Progresión por etapas de un ARC?', fr: "Qu'est-ce que la Progression par niveaux d'un ARC ?", it: "Cos'è la Progressione a livelli di un ARC?" },
    'faq10.a': {
      de: '<p>Der <strong>Stufenaufbau</strong> ist ein optionaler Modus: Statt sofort mit allen Gewohnheiten zu starten, beginnt dein ARC <strong>schlank</strong> und wächst in <strong>Stufen</strong>. Neue Gewohnheiten schaltest du erst frei, wenn du eine Woche <strong>stark</strong> abschließt – also deine Gewohnheiten im Wochenschnitt den gesetzten Schwellenwert (z. B. ≥ 80 %) erreichen.</p><p>So baust du zuerst Beständigkeit mit wenigen Gewohnheiten auf, bevor mehr dazukommt. Gewohnheiten kommen dabei <strong>nur dazu, nie weg</strong>. Lässt du beim Erstellen alle Gewohnheiten in Stufe 1, ist es ein ganz normaler ARC ohne Freischaltung.</p>',
      en: '<p>The <strong>Build-up</strong> is an optional mode: instead of starting with every habit at once, your ARC begins <strong>lean</strong> and grows in <strong>stages</strong>. You unlock new habits only once you finish a week <strong>strong</strong> — i.e. your habits reach the set threshold on weekly average (e.g. ≥ 80%).</p><p>That way you build consistency with a few habits first, before adding more. Habits are <strong>only added, never removed</strong>. Leave every habit in stage 1 when creating the ARC and it stays a normal ARC with no unlocking.</p>',
      es: '<p>La <strong>Progresión</strong> es un modo opcional: en lugar de empezar con todos los hábitos a la vez, tu ARC arranca <strong>ligero</strong> y crece por <strong>etapas</strong>. Desbloqueas nuevos hábitos solo al terminar una semana con <strong>fuerza</strong>, es decir, cuando tus hábitos alcanzan el umbral fijado en promedio semanal (p. ej. ≥ 80 %).</p><p>Así afianzas primero la constancia con pocos hábitos antes de añadir más. Los hábitos <strong>solo se añaden, nunca se quitan</strong>. Si al crear el ARC dejas todos los hábitos en la etapa 1, es un ARC normal, sin desbloqueo.</p>',
      fr: "<p>La <strong>Progression</strong> est un mode optionnel : au lieu de démarrer avec toutes les habitudes d'un coup, ton ARC commence <strong>léger</strong> et grandit par <strong>niveaux</strong>. Tu débloques de nouvelles habitudes seulement en réussissant une semaine <strong>forte</strong> — c'est-à-dire quand tes habitudes atteignent en moyenne hebdomadaire le seuil fixé (par ex. ≥ 80 %).</p><p>Tu installes ainsi d'abord la régularité avec quelques habitudes avant d'en ajouter. Les habitudes sont <strong>uniquement ajoutées, jamais retirées</strong>. Si tu laisses toutes les habitudes au niveau 1 à la création, l'ARC reste normal, sans déblocage.</p>",
      it: "<p>La <strong>Progressione</strong> è una modalità opzionale: invece di partire con tutte le abitudini insieme, il tuo ARC inizia <strong>snello</strong> e cresce per <strong>livelli</strong>. Sblocchi nuove abitudini solo completando una settimana <strong>forte</strong> — cioè quando le tue abitudini raggiungono in media settimanale la soglia impostata (es. ≥ 80 %).</p><p>Così costruisci prima la costanza con poche abitudini, prima di aggiungerne altre. Le abitudini vengono <strong>solo aggiunte, mai rimosse</strong>. Se alla creazione lasci tutte le abitudini al livello 1, resta un ARC normale, senza sblocco.</p>",
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
      de: 'Du tippst auf den <strong>+ Eintragen</strong>-Button auf dem Home-Screen und öffnest dein Logbuch. Dort trägst du für jede aktive Gewohnheit den Wert des Tages ein – per Schrittwähler oder Schieberegler. Zusätzlich gibt es einen <strong>Timer</strong> (Stoppuhr oder Pomodoro), mit dem du Zeit-basierte Gewohnheiten live mitlaufen lassen kannst.',
      en: 'Tap the <strong>+ Track</strong> button on the Home screen to open your logbook. Enter today’s value for every active habit — via stepper or slider. There’s also a <strong>timer</strong> (stopwatch or Pomodoro) for time-based habits, which you can run live.',
      es: 'Toca el botón <strong>+ Registrar</strong> en la pantalla Home para abrir tu registro. Ahí registras el valor de hoy para cada hábito activo — con selector numérico o control deslizante. También hay un <strong>timer</strong> (cronómetro o Pomodoro) para hábitos basados en tiempo.',
      fr: "Touche le bouton <strong>+ Saisir</strong> sur l'écran d'accueil pour ouvrir ton carnet. Tu y saisis la valeur du jour pour chaque habitude active — via sélecteur numérique ou curseur. Il y a aussi un <strong>timer</strong> (chrono ou Pomodoro) pour les habitudes basées sur le temps, à faire tourner en direct.",
      it: 'Tocca il pulsante <strong>+ Registra</strong> nella Home per aprire il tuo registro. Lì inserisci il valore di oggi per ogni abitudine attiva — con selettore numerico o cursore. C’è anche un <strong>timer</strong> (cronometro o Pomodoro) per abitudini basate sul tempo, da far girare live.',
    },
    'faq13.q': { de: 'Kann ich auch vergangene Tage nachtragen?', en: 'Can I back-fill past days?', es: '¿Puedo registrar días pasados?', fr: 'Puis-je remplir des jours passés ?', it: 'Posso compilare giorni passati?' },
    'faq13.a': {
      de: 'Nur <strong>heute und gestern</strong> sind beschreibbar. Alles davor ist bewusst schreibgeschützt. Das ist ein Designprinzip: kein nachträgliches Eintragen, keine geschönten Streaks. Jeder Streak, den du baust, ist ehrlich verdient.',
      en: 'Only <strong>today and yesterday</strong> are writable. Everything before that is deliberately read-only. This is a design principle: no back-filling, no fabricated streaks. Every streak you build is honestly earned.',
      es: 'Solo <strong>hoy y ayer</strong> son editables. Todo lo anterior es deliberadamente de solo lectura. Es un principio de diseño: nada de rellenar a posteriori, nada de rachas maquilladas. Cada racha que construyes es honesta.',
      fr: "Seuls <strong>aujourd'hui et hier</strong> sont modifiables. Tout ce qui précède est volontairement en lecture seule. C'est un principe de design : pas de remplissage rétroactif, pas de séries embellies. Chaque série que tu bâtis est honnêtement gagnée.",
      it: 'Solo <strong>oggi e ieri</strong> sono modificabili. Tutto il resto è volutamente in sola lettura. È un principio di design: niente backfilling, niente streak abbellite. Ogni streak che costruisci è onesta.',
    },
    'faq14.q': { de: 'Was bedeutet die Prozentzahl bei jeder Gewohnheit?', en: 'What does the percentage on each habit mean?', es: '¿Qué significa el porcentaje en cada hábito?', fr: 'Que signifie le pourcentage sur chaque habitude ?', it: 'Cosa significa la percentuale su ogni abitudine?' },
    'faq14.a': {
      de: 'Das ist deine <strong>proportionale Erfüllung</strong> für diesen Tag. Bei Mindestens-Gewohnheiten: <code>Wert ÷ Ziel × 100</code>, gekappt bei 100 %. Hast du 7 von 10 Gläsern Wasser getrunken, sind das 70 %. Bei Höchstens-Gewohnheiten ist die Logik binär – entweder unter dem Limit (100 %) oder darüber (0 %). Die Prozente der Gewohnheiten werden zur <strong>Tageserfüllung</strong> gemittelt.',
      en: 'That’s your <strong>proportional completion</strong> for the day. For Above habits: <code>value ÷ target × 100</code>, capped at 100 %. Drink 7 of 10 glasses of water → 70 %. For Below habits the logic is binary — either under the limit (100 %) or over it (0 %). The habit percentages average into your <strong>Daily Completion</strong>.',
      es: 'Es tu <strong>cumplimiento proporcional</strong> del día. Para hábitos Mínimo: <code>valor ÷ objetivo × 100</code>, con tope al 100 %. Si bebiste 7 de 10 vasos de agua → 70 %. En hábitos Máximo la lógica es binaria — por debajo del límite (100 %) o por encima (0 %). Los porcentajes se promedian en el <strong>cumplimiento diario</strong>.',
      fr: "C'est ton <strong>achèvement proportionnel</strong> pour la journée. Pour les habitudes Minimum : <code>valeur ÷ cible × 100</code>, plafonné à 100 %. 7 verres d'eau sur 10 → 70 %. Pour les habitudes Maximum, la logique est binaire — soit sous la limite (100 %), soit au-dessus (0 %). Les pourcentages sont moyennés dans ta <strong>complétion quotidienne</strong>.",
      it: 'È il tuo <strong>completamento proporzionale</strong> della giornata. Per Minimo: <code>valore ÷ obiettivo × 100</code>, fino a 100 %. 7 bicchieri d’acqua su 10 → 70 %. Per Massimo la logica è binaria — sotto al limite (100 %) o sopra (0 %). Le percentuali si mediano nel <strong>completamento giornaliero</strong>.',
    },
    'faq16.q': { de: 'Was ist der Streak?', en: 'What is the streak?', es: '¿Qué es la racha?', fr: 'Qu’est-ce que la série ?', it: 'Cos’è lo streak?' },
    'faq16.a': {
      de: 'Dein <strong>Tages-Streak</strong> zählt aufeinanderfolgende perfekte Tage. Ein Tag ohne Logs zählt als 0 % und bricht den Streak – es sei denn, er ist durch einen Ruhetag oder einen geplanten Urlaub abgedeckt. Es gibt <strong>keinen Streak-Schutz</strong> – ein gebrochener Streak ist kein Drama, sondern ein Datenpunkt.',
      en: 'Your <strong>day streak</strong> counts consecutive perfect days. A day without logs counts as 0 % and breaks the streak — unless covered by a rest day or planned vacation. There are <strong>no streak shields</strong> — a broken streak is not a drama, it’s a data point.',
      es: 'Tu <strong>day streak</strong> cuenta días perfectos consecutivos. Un día sin logs cuenta como 0 % y rompe la racha — salvo que esté cubierto por un día de descanso o vacaciones planificadas. <strong>No hay escudos de racha</strong> — una racha rota no es un drama, es un dato.',
      fr: "Ton <strong>day streak</strong> compte les journées parfaites consécutives. Une journée sans saisie compte 0 % et casse la série — sauf si couverte par un jour de repos ou des vacances planifiées. <strong>Aucun bouclier de série</strong> — une série cassée n'est pas un drame, c'est une donnée.",
      it: 'Il tuo <strong>day streak</strong> conta i giorni perfetti consecutivi. Un giorno senza log conta 0 % e rompe lo streak — a meno che sia coperto da un giorno di riposo o vacanza pianificata. <strong>Niente streak shield</strong> — uno streak rotto non è un dramma, è un dato.',
    },
    'faq17.q': { de: 'Was sind Ruhetage?', en: 'What are rest days?', es: '¿Qué son los días de descanso?', fr: 'Que sont les jours de repos ?', it: 'Cosa sono i giorni di riposo?' },
    'faq17.a': {
      de: 'Ruhetage <strong>frieren deinen Streak ein</strong>, ohne ihn zu brechen. Du bekommst pro Woche ein selbst gewähltes Budget (z. B. 1–2 Tage). Du kannst sie manuell setzen oder sie werden automatisch verbraucht, wenn du nach einer Tracking-Pause wieder einsteigst. Nicht verbrauchte Ruhetage verfallen am Wochenende – sie sind kein Konto, das du ansparst.',
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
      de: 'Der <strong>Free-Tarif</strong> umfasst:<ul><li>Tracking aller Gewohnheiten aus der ausgewählten Sammlung</li><li>Einen aktiven ARC gleichzeitig</li><li>Lebensbereiche mit Lebensrad und Vision-Texten</li><li>Zugriff auf die Lerninhalte</li><li>Selbstbewertung (regelmäßige Updates pro Lebensbereich)</li><li>Basis-Insights: Gesamtfortschritt, Streak und ARC-Verlauf</li></ul>',
      en: 'The <strong>Free plan</strong> includes:<ul><li>Tracking of all habits from the selected library</li><li>One active ARC at a time</li><li>Life areas with Wheel of Life and vision texts</li><li>Access to Learning Content</li><li>Self-assessments (rating updates per life area)</li><li>Basic insights: overall progress, streak and ARC history</li></ul>',
      es: 'El plan <strong>Free</strong> incluye:<ul><li>Tracking de todos los hábitos de la biblioteca seleccionada</li><li>Un ARC activo a la vez</li><li>Áreas de vida con Rueda de la vida y textos de visión</li><li>Acceso a los contenidos de aprendizaje</li><li>Autoevaluaciones (actualizar puntuación por área)</li><li>Insights básicos: progreso general, racha e historial de ARCs</li></ul>',
      fr: "Le plan <strong>Free</strong> comprend :<ul><li>Le suivi de toutes les habitudes de la bibliothèque sélectionnée</li><li>Un ARC actif à la fois</li><li>Les domaines de vie avec Roue de la vie et textes de vision</li><li>L'accès aux contenus d'apprentissage</li><li>Les auto-évaluations (mise à jour des notes par domaine de vie)</li><li>Insights de base : progression globale, série et historique des ARC</li></ul>",
      it: 'Il piano <strong>Free</strong> include:<ul><li>Tracciamento di tutte le abitudini della biblioteca selezionata</li><li>Un ARC attivo alla volta</li><li>Aree di vita con Ruota della vita e testi di visione</li><li>Accesso ai contenuti di apprendimento</li><li>Autovalutazioni (aggiornamento punteggi per area di vita)</li><li>Insights di base: progresso generale, streak e cronologia ARC</li></ul>',
    },
    'faq23.q': { de: 'Was bekomme ich zusätzlich mit Pro?', en: 'What do I additionally get with Pro?', es: '¿Qué obtengo además con Pro?', fr: 'Que m’apporte Pro en plus ?', it: 'Cosa ottengo in più con Pro?' },
    'faq23.a': {
      de: 'Mit <strong>Pro</strong> schaltest du frei:<ul><li>Mehrere ARCs parallel</li><li>Selbst erstellte ARCs und Gewohnheiten</li><li><strong>KI-ARC-Generator</strong> – aus einem Satz baut die KI einen kompletten ARC für dich</li><li>Ziel-Tracking und Tagebuch</li><li>Erweiterte Insights mit Heatmaps, Trends, Korrelationen und 90-Tage-Profilen</li><li>Premium-Inhalte bei den Lerninhalten</li></ul>',
      en: 'With <strong>Pro</strong> you unlock:<ul><li>Multiple parallel ARCs</li><li>Self-made ARCs (wizard) and habits</li><li><strong>AI ARC generator</strong> — from one sentence the AI builds a complete ARC for you</li><li>Goal tracking and journaling</li><li>Advanced insights with heatmaps, trends, correlations and 90-day profiles</li><li>Premium Learning Content</li></ul>',
      es: 'Con <strong>Pro</strong> desbloqueas:<ul><li>Varios ARCs en paralelo</li><li>ARCs y hábitos propios (asistente)</li><li><strong>Generador IA de ARCs</strong> — desde una frase la IA construye un ARC completo</li><li>Seguimiento de objetivos y diario</li><li>Insights avanzados con heatmaps, tendencias, correlaciones y perfiles de 90 días</li><li>Contenido premium en los contenidos de aprendizaje</li></ul>',
      fr: "Avec <strong>Pro</strong> tu débloques :<ul><li>Plusieurs ARC en parallèle</li><li>ARC et habitudes personnalisés (assistant)</li><li><strong>Générateur IA d'ARCs</strong> — à partir d'une phrase, l'IA construit un ARC complet pour toi</li><li>Suivi d'objectifs et journal</li><li>Insights avancés avec heatmaps, tendances, corrélations et profils 90 jours</li><li>Contenus premium dans les contenus d'apprentissage</li></ul>",
      it: 'Con <strong>Pro</strong> sblocchi:<ul><li>Più ARC in parallelo</li><li>ARC e abitudini personali (wizard)</li><li><strong>Generatore IA di ARC</strong> — da una frase l’IA costruisce un ARC completo</li><li>Tracciamento obiettivi e diario</li><li>Insights avanzati con heatmap, trend, correlazioni e profili 90 giorni</li><li>Contenuti premium nei contenuti di apprendimento</li></ul>',
    },
    'faq24.q': { de: 'Was kostet Pro?', en: 'How much does Pro cost?', es: '¿Cuánto cuesta Pro?', fr: 'Combien coûte Pro ?', it: 'Quanto costa Pro?' },
    'faq24.a': {
      de: 'Stand bei Vertragserstellung der AGB:<ul><li><strong>Pro Monat</strong> – € 6,99 (monatliche automatische Verlängerung)</li><li><strong>Pro Jahr</strong> – € 49,99 (jährliche Verlängerung, bester Preis)</li></ul><strong>Neue Nutzer: 7 Tage gratis testen</strong> – danach automatische Verlängerung, jederzeit kündbar. Die jeweils aktuellen Preise findest du in der App im Bildschirm „Abonnement".',
      en: 'As of the date the terms were drafted:<ul><li><strong>Pro Monthly</strong> — € 6.99 (auto-renews monthly)</li><li><strong>Pro Yearly</strong> — € 49.99 (annual renewal, best price)</li></ul><strong>New users get a 7-day free trial</strong> — then it auto-renews, cancel anytime. The current prices are shown in the app on the "Subscription" screen.',
      es: 'A fecha de redacción de los términos:<ul><li><strong>Pro Mensual</strong> — € 6,99 (renovación mensual automática)</li><li><strong>Pro Anual</strong> — € 49,99 (renovación anual, mejor precio)</li></ul><strong>Los nuevos usuarios tienen 7 días gratis</strong> — luego se renueva automáticamente, cancela cuando quieras. Los precios actuales aparecen en la app, pantalla «Suscripción».',
      fr: "À la date de rédaction des CGU :<ul><li><strong>Pro Mensuel</strong> — € 6,99 (renouvellement mensuel automatique)</li><li><strong>Pro Annuel</strong> — € 49,99 (renouvellement annuel, meilleur prix)</li></ul><strong>Les nouveaux utilisateurs profitent de 7 jours gratuits</strong> — puis renouvellement automatique, résiliable à tout moment. Les prix actuels sont visibles dans l'app, écran « Abonnement ».",
      it: 'Alla data di stesura delle Condizioni:<ul><li><strong>Pro Mensile</strong> — € 6,99 (rinnovo mensile automatico)</li><li><strong>Pro Annuale</strong> — € 49,99 (rinnovo annuale, miglior prezzo)</li></ul><strong>I nuovi utenti hanno 7 giorni gratis</strong> — poi rinnovo automatico, disdici quando vuoi. I prezzi correnti sono nell’app, schermata «Abbonamento».',
    },
    'faq25.q': { de: 'Kann ich mein Pro-Abo jederzeit kündigen?', en: 'Can I cancel my Pro subscription at any time?', es: '¿Puedo cancelar Pro en cualquier momento?', fr: 'Puis-je résilier Pro à tout moment ?', it: 'Posso cancellare Pro in qualsiasi momento?' },
    'faq25.a': {
      de: 'Ja. Monats- und Jahresabos kündigst du in den Abo-Einstellungen deines App Stores (Apple App Store bzw. Google Play) – spätestens 24 Stunden vor Ende der laufenden Periode; die App verlinkt dorthin. Du behältst den Pro-Zugang bis zum Ende der bereits bezahlten Periode.',
      en: 'Yes. Cancel monthly and yearly subscriptions in your app store’s subscription settings (Apple App Store or Google Play) — at the latest 24 hours before the end of the current period; the app links there. You keep Pro access until the end of the already paid period.',
      es: 'Sí. Las suscripciones mensuales y anuales se cancelan en los ajustes de suscripciones de tu App Store (Apple App Store o Google Play) — como máximo 24 horas antes del fin del período actual; la app enlaza ahí. Conservas el acceso Pro hasta el final del período ya pagado.',
      fr: "Oui. Tu résilies les abonnements mensuels et annuels dans les réglages d'abonnement de ton App Store (Apple App Store ou Google Play) — au plus tard 24 h avant la fin de la période en cours ; l'app y renvoie. Tu conserves l'accès Pro jusqu'à la fin de la période déjà payée.",
      it: 'Sì. Cancelli gli abbonamenti mensili e annuali nelle impostazioni degli abbonamenti del tuo App Store (Apple App Store o Google Play) — al più tardi 24 ore prima della fine del periodo in corso; l’app rimanda lì. Mantieni l’accesso Pro fino al termine del periodo già pagato.',
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

    'faq27.q': { de: 'Wie funktioniert der KI-ARC-Generator?', en: 'How does the AI ARC Generator work?', es: '¿Cómo funciona el Generador IA de ARCs?', fr: 'Comment fonctionne le Générateur IA d’ARCs ?', it: 'Come funziona il Generatore IA di ARC?' },
    'faq27.a': {
      de: 'Im Pro-Tarif beschreibst du dein Ziel in einem Satz – zum Beispiel <em>„Ich will über 6 Wochen eine Morgenroutine etablieren und besser schlafen."</em> Die KI (Claude von Anthropic) baut daraus einen vollständigen ARC-Entwurf inklusive passender Gewohnheiten, Zielwerte, Theorie und Tipps. Du kannst alles vor dem Speichern frei bearbeiten. Übertragen werden dabei nur dein Prompt sowie die zur Erstellung nötigen Stammdaten (Sprache, Maßeinheit und unser integrierter Gewohnheits-Katalog). Optional kannst du per Schalter zusätzlich die <strong>Bezeichnungen deiner selbst erstellten Gewohnheiten</strong> mitsenden – standardmäßig ist das <strong>deaktiviert</strong>. <strong>Keine</strong> Profil-, Konto- oder Verlaufsdaten (E-Mail, Logs, Statistiken) werden übertragen.',
      en: 'On Pro you describe your goal in one sentence — e.g. <em>"I want to build a morning routine and sleep better over 6 weeks."</em> The AI (Claude by Anthropic) creates a complete ARC draft for you, including matching habits, targets, theory and tips. You can edit everything freely before saving. Only your prompt plus the data needed to build it (your language, units and our built-in habit catalogue) is transmitted. You can optionally enable a toggle to also send the <strong>names of your self-created habits</strong> — this is <strong>off by default</strong>. <strong>No</strong> profile, account or history data (email, logs, statistics) is shared.',
      es: 'En Pro describes tu objetivo en una frase — p. ej. <em>«Quiero construir una rutina matutina y dormir mejor en 6 semanas.»</em> La IA (Claude de Anthropic) crea un borrador completo de ARC con hábitos, objetivos, teoría y consejos. Puedes editarlo todo antes de guardar. Solo se transmite tu prompt junto con los datos necesarios para generarlo (idioma, unidades y nuestro catálogo de hábitos integrado). De forma opcional puedes activar un interruptor para enviar también los <strong>nombres de los hábitos que has creado</strong> — está <strong>desactivado por defecto</strong>. <strong>No</strong> se comparten datos de perfil, cuenta o historial (correo, registros, estadísticas).',
      fr: "Sur Pro tu décris ton objectif en une phrase — par ex. <em>« Je veux construire une routine matinale et mieux dormir sur 6 semaines. »</em> L'IA (Claude d'Anthropic) crée un brouillon d'ARC complet avec habitudes, cibles, théorie et conseils. Tu peux tout modifier avant d'enregistrer. Seuls ton prompt et les données nécessaires à la génération (langue, unités et notre catalogue d'habitudes intégré) sont transmis. Tu peux éventuellement activer une option pour envoyer aussi les <strong>noms des habitudes que tu as créées</strong> — c'est <strong>désactivé par défaut</strong>. <strong>Aucune</strong> donnée de profil, de compte ou d'historique (e-mail, journaux, statistiques) n'est partagée.",
      it: 'Su Pro descrivi il tuo obiettivo in una frase — es. <em>«Voglio costruire una routine mattutina e dormire meglio in 6 settimane.»</em> L’IA (Claude di Anthropic) crea una bozza completa di ARC con abitudini, target, teoria e consigli. Puoi modificare tutto prima di salvare. Vengono trasmessi solo il tuo prompt e i dati necessari per generarlo (lingua, unità e il nostro catalogo di abitudini integrato). Puoi facoltativamente attivare un interruttore per inviare anche i <strong>nomi delle abitudini che hai creato</strong> — è <strong>disattivato per impostazione predefinita</strong>. <strong>Nessun</strong> dato di profilo, account o cronologia (email, log, statistiche) viene condiviso.',
    },

    'faq28.q': { de: 'Welche Insights bekomme ich?', en: 'What insights do I get?', es: '¿Qué insights obtengo?', fr: 'Quels insights ai-je ?', it: 'Quali insights ottengo?' },
    'faq28.a': {
      de: 'ArcUp zeigt dir drei Bereiche:<ul><li><strong>Gesamt-Tab</strong> – dein 90-Tage-Profil mit perfekten Tagen, aktiver Zeit, Lebensbalance und Top-Gewohnheiten <em>(kostenlos)</em></li><li><strong>ARCs-Tab</strong> – Erfolgsrate, durchschnittliche Erfüllung und Verteilung auf Lebensbereiche über alle ARCs <em>(kostenlos)</em></li><li><strong>Gewohnheiten-Tab</strong> – Erfüllungs-Heatmap, Werteverlauf, Streaks, automatisch mitgezählte Untergewohnheiten und Gewohnheits-Korrelationen pro Gewohnheit <em>(Pro)</em></li></ul>Alle Zahlen entstehen aus deinen echten Logs – keine geschönten Statistiken.',
      en: 'ArcUp shows you three areas:<ul><li><strong>Overall tab</strong> — your 90-day profile with perfect days, active time, life balance and top habits <em>(free)</em></li><li><strong>ARCs tab</strong> — success rate, average completion and life-area distribution across all ARCs <em>(free)</em></li><li><strong>Habits tab</strong> — completion heatmap, value history, streaks, automatically aggregated sub-habits and habit correlations per habit <em>(Pro)</em></li></ul>All numbers come from your real logs — no embellished stats.',
      es: 'ArcUp te muestra tres áreas:<ul><li><strong>Pestaña General</strong> — tu perfil de 90 días con días perfectos, tiempo activo, life balance y top hábitos <em>(gratis)</em></li><li><strong>Pestaña ARCs</strong> — tasa de éxito, cumplimiento medio y distribución por life area <em>(gratis)</em></li><li><strong>Pestaña Hábitos</strong> — heatmap de cumplimiento, evolución, rachas, subhábitos agregados automáticamente y correlaciones por hábito <em>(Pro)</em></li></ul>Todos los números vienen de tus logs reales — sin estadísticas maquilladas.',
      fr: "Avec ArcUp tu vois trois zones :<ul><li><strong>Onglet Général</strong> — ton profil 90 jours avec jours parfaits, temps actif, life balance et top habitudes <em>(gratuit)</em></li><li><strong>Onglet ARCs</strong> — taux de succès, complétion moyenne et répartition par life area <em>(gratuit)</em></li><li><strong>Onglet Habitudes</strong> — heatmap de complétion, historique, séries, sous-habitudes agrégées automatiquement et corrélations par habitude <em>(Pro)</em></li></ul>Tous les chiffres viennent de tes logs réels — pas de stats embellies.",
      it: 'Con ArcUp vedi tre aree:<ul><li><strong>Tab Generale</strong> — il tuo profilo 90 giorni con giorni perfetti, tempo attivo, life balance e top abitudini <em>(gratis)</em></li><li><strong>Tab ARCs</strong> — tasso di successo, completamento medio e distribuzione per life area <em>(gratis)</em></li><li><strong>Tab Abitudini</strong> — heatmap di completamento, andamento, streak, sotto-abitudini sommate automaticamente e correlazioni per abitudine <em>(Pro)</em></li></ul>Tutti i numeri vengono dai tuoi log reali — niente statistiche abbellite.',
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
      de: 'Ja. Im Profil unter <strong>„Meine Daten exportieren"</strong> bekommst du ein <strong>vollständiges ZIP-Archiv</strong> aller deiner Daten – Gewohnheiten, ARCs, Logs, Ziele, Tagebuch-Einträge und Titelbilder. Aus Performance-Gründen ist der Export auf einmal pro 24 Stunden begrenzt.',
      en: 'Yes. In your profile under <strong>"Export My Data"</strong> you get a <strong>full ZIP archive</strong> of all your data — habits, ARCs, logs, goals, journal entries and cover images. For performance reasons the export is limited to once per 24 hours.',
      es: 'Sí. En el perfil, en <strong>«Exportar mis datos»</strong>, obtienes un <strong>archivo ZIP completo</strong> con todos tus datos — hábitos, ARCs, logs, objetivos, entradas de diario e imágenes de portada. Por rendimiento el export está limitado a una vez cada 24 horas.',
      fr: "Oui. Dans ton profil, sous <strong>« Exporter mes données »</strong>, tu obtiens une <strong>archive ZIP complète</strong> de toutes tes données — habitudes, ARC, logs, objectifs, entrées de journal et images de couverture. Pour des raisons de performance, l'export est limité à une fois toutes les 24 heures.",
      it: 'Sì. Nel profilo, in <strong>«Esporta i miei dati»</strong>, ottieni un <strong>archivio ZIP completo</strong> di tutti i tuoi dati — abitudini, ARC, log, obiettivi, voci di diario e immagini di copertina. Per motivi di performance l’export è limitato a una volta ogni 24 ore.',
    },
    'faq36.q': { de: 'Kann ich mein Konto zurücksetzen oder löschen?', en: 'Can I reset or delete my account?', es: '¿Puedo restablecer o eliminar mi cuenta?', fr: 'Puis-je réinitialiser ou supprimer mon compte ?', it: 'Posso resettare o eliminare il mio account?' },
    'faq36.a': {
      de: 'Zwei Optionen in den Account-Einstellungen:<ul><li><strong>Konto zurücksetzen</strong> – setzt deinen Fortschritt zurück (Gewohnheiten, Streaks, XP, ARCs, Tagebücher), behält Profil und Pro-Abo</li><li><strong>Konto löschen</strong> – löscht dein Konto und sämtliche Daten unwiderruflich</li></ul>Beide Aktionen erfordern eine explizite Bestätigung (Tippen von „RESET" bzw. „DELETE").',
      en: 'Two options in the account settings:<ul><li><strong>Reset Account</strong> — resets your progress (habits, streaks, XP, ARCs, journals), keeps profile and Pro subscription</li><li><strong>Delete Account</strong> — irreversibly deletes your account and all data</li></ul>Both actions require explicit confirmation (typing "RESET" or "DELETE").',
      es: 'Dos opciones en los ajustes de cuenta:<ul><li><strong>Restablecer cuenta</strong> — restablece tu progreso (hábitos, rachas, XP, ARCs, diarios), mantiene perfil y suscripción Pro</li><li><strong>Eliminar cuenta</strong> — elimina tu cuenta y todos los datos de forma irreversible</li></ul>Ambas requieren confirmación explícita (escribir «RESET» o «DELETE»).',
      fr: "Deux options dans les paramètres du compte :<ul><li><strong>Réinitialiser le compte</strong> — réinitialise ta progression (habitudes, séries, XP, ARC, journaux), conserve le profil et l'abonnement Pro</li><li><strong>Supprimer le compte</strong> — supprime ton compte et toutes les données de manière irréversible</li></ul>Les deux actions exigent une confirmation explicite (saisie de « RESET » ou « DELETE »).",
      it: 'Due opzioni nelle impostazioni account:<ul><li><strong>Reimposta account</strong> — resetta i tuoi progressi (abitudini, streak, XP, ARC, diario), mantiene profilo e abbonamento Pro</li><li><strong>Elimina account</strong> — cancella account e tutti i dati in modo irreversibile</li></ul>Entrambe richiedono conferma esplicita (digitare «RESET» o «DELETE»).',
    },
    'faq37.q': { de: 'Ist ArcUp DSGVO-konform?', en: 'Is ArcUp GDPR-compliant?', es: '¿ArcUp cumple el RGPD?', fr: 'ArcUp est-il conforme au RGPD ?', it: 'ArcUp è conforme al GDPR?' },
    'faq37.a': {
      de: 'ArcUp ist nach europäischem Recht aufgebaut: Anbieter mit Sitz in Österreich, Datenhaltung in der EU, Auftragsverarbeitungs­vereinbarungen mit allen Dienstleistern (Supabase, Apple/Google, RevenueCat, Anthropic), klar getrennte Drittlandsübermittlungs­garantien. Die vollständige Datenschutzerklärung erläutert Datenkategorien, Rechtsgrundlagen, Empfänger, Speicherdauern und deine Betroffenenrechte (Auskunft, Berichtigung, Löschung, Widerspruch, Datenübertragbarkeit).',
      en: 'ArcUp is built under European law: provider based in Austria, data hosted in the EU, data processing agreements with all providers (Supabase, Apple/Google, RevenueCat, Anthropic), clearly separated third-country transfer safeguards. The full privacy policy explains data categories, legal bases, recipients, retention periods and your data-subject rights (access, rectification, erasure, objection, portability).',
      es: 'ArcUp está construido bajo derecho europeo: proveedor con sede en Austria, datos alojados en la UE, contratos de encargado del tratamiento con todos los proveedores (Supabase, Apple/Google, RevenueCat, Anthropic), garantías de transferencia a terceros países claramente separadas. La política de privacidad completa explica categorías de datos, bases jurídicas, destinatarios, plazos y tus derechos como interesado (acceso, rectificación, supresión, oposición, portabilidad).',
      fr: "ArcUp est construit sous le droit européen : fournisseur basé en Autriche, données hébergées dans l'UE, accords de sous-traitance avec tous les prestataires (Supabase, Apple/Google, RevenueCat, Anthropic), garanties de transfert hors UE clairement séparées. La politique de confidentialité complète explique les catégories de données, bases légales, destinataires, durées et tes droits (accès, rectification, effacement, opposition, portabilité).",
      it: 'ArcUp è costruito sul diritto europeo: fornitore con sede in Austria, dati ospitati in UE, accordi di responsabile del trattamento con tutti i fornitori (Supabase, Apple/Google, RevenueCat, Anthropic), garanzie di trasferimento extra-UE chiaramente separate. L’informativa completa spiega categorie di dati, basi giuridiche, destinatari, tempi di conservazione e i tuoi diritti (accesso, rettifica, cancellazione, opposizione, portabilità).',
    },
    'faq38.q': { de: 'Werden meine Daten für KI-Training verwendet?', en: 'Is my data used for AI training?', es: '¿Mis datos se usan para entrenar IA?', fr: 'Mes données sont-elles utilisées pour entraîner l’IA ?', it: 'I miei dati vengono usati per l’addestramento dell’IA?' },
    'faq38.a': {
      de: 'Nein. Anthropic verwendet die über die API übermittelten Eingaben laut eigener Richtlinie <strong>nicht</strong> zum Training seiner Modelle. Inhalte vom Typ „ArcUp Original" werden <strong>vorab und redaktionell</strong> mit KI-Unterstützung erstellt – ohne Bezug zu individuellen Nutzerprofilen. Wenn du den KI-ARC-Generator nutzt, werden dein Prompt sowie die zur Erstellung nötigen Stammdaten (Sprache, Maßeinheit, integrierter Gewohnheits-Katalog) an Anthropic übermittelt – und nur falls du es per Schalter aktivierst (standardmäßig aus) zusätzlich die Bezeichnungen deiner selbst erstellten Gewohnheiten. <strong>Profildaten, E-Mail, Logs, Statistiken oder Streaks werden nie übertragen.</strong>',
      en: 'No. Anthropic, per its own policy, does <strong>not</strong> use inputs sent via the API to train its models. "ArcUp Original" content is created <strong>in advance and editorially</strong> with AI support — independent of individual user profiles. When you use the AI ARC Generator, your prompt plus the data needed to build the draft (language, units, built-in habit catalogue) is sent to Anthropic — and only if you enable the toggle (off by default) the names of your self-created habits as well. <strong>Profile data, email, logs, statistics or streaks are never transmitted.</strong>',
      es: 'No. Anthropic, según su propia política, <strong>no</strong> usa las entradas enviadas por la API para entrenar sus modelos. Los contenidos «ArcUp Original» se crean <strong>de antemano y de forma editorial</strong> con apoyo de IA — sin relación con perfiles de usuario individuales. Cuando usas el Generador IA de ARCs, se envía a Anthropic tu prompt junto con los datos necesarios para generarlo (idioma, unidades, catálogo de hábitos integrado) — y solo si lo activas con el interruptor (desactivado por defecto) también los nombres de los hábitos que has creado. <strong>Los datos de perfil, correo, registros, estadísticas o rachas nunca se transmiten.</strong>',
      fr: "Non. Anthropic, selon sa propre politique, n'utilise <strong>pas</strong> les entrées envoyées via l'API pour entraîner ses modèles. Les contenus « ArcUp Original » sont créés <strong>en amont et de manière éditoriale</strong> avec assistance IA — indépendamment des profils utilisateurs individuels. Quand tu utilises le Générateur IA d'ARCs, ton prompt ainsi que les données nécessaires à la génération (langue, unités, catalogue d'habitudes intégré) sont envoyés à Anthropic — et seulement si tu actives l'option (désactivée par défaut) les noms des habitudes que tu as créées. <strong>Les données de profil, e-mail, journaux, statistiques ou séries ne sont jamais transmis.</strong>",
      it: 'No. Anthropic, secondo la propria policy, <strong>non</strong> utilizza gli input inviati tramite API per addestrare i suoi modelli. I contenuti «ArcUp Original» sono creati <strong>in anticipo e in modo editoriale</strong> con supporto IA — indipendentemente dai profili utente. Quando usi il Generatore IA di ARC, ad Anthropic vengono inviati il tuo prompt e i dati necessari per generarlo (lingua, unità, catalogo di abitudini integrato) — e solo se lo attivi con l’interruttore (disattivato per impostazione predefinita) anche i nomi delle abitudini che hai creato. <strong>Dati di profilo, email, log, statistiche o streak non vengono mai trasmessi.</strong>',
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
