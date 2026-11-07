/**
 * ============================================================
 * PROJECTS DATA — ajouter un projet = ajouter un objet ici.
 * ============================================================
 * Rien d'autre à toucher : index.html et app.js lisent ce tableau
 * et génèrent automatiquement une page (slide), le point de
 * navigation à gauche, le panneau visuel à droite et les boutons
 * "Détails", "Captures" (si utilisé) et les liens.
 *
 * SCHÉMA D'UN PROJET :
 * {
 *   id:        'slug-unique',            // utilisé en interne (data-id)
 *   index:     '01',                     // numéro affiché
 *   status:    'Projet phare · ...',     // petite étiquette de statut
 *   title:     'Nom du projet',
 *   tags:      ['Domaine 1', 'Domaine 2'],
 *   summary:   'Paragraphe d'explication (1 à 3 phrases).',
 *   points:    ['Point clé 1', 'Point clé 2'],   // facultatif, [] si vide
 *   note:      'Limite connue ou remarque honnête', // facultatif, '' si aucune
 *   links:     [{ label:'Voir sur GitHub', href:'https://...' }], // facultatif
 *
 *   // Panneau visuel à droite. Un seul type à la fois :
 *   visual: {
 *     kind: 'gallery' | 'schema' | 'image' | 'placeholder',
 *
 *     // kind === 'gallery' : images ET/OU PDF, avec flèches de navigation
 *     images: [
 *       { src:'demos/xxx/1.png', caption:'Ce que montre l'image.' },
 *       { type:'pdf', src:'demos/xxx/rapport.pdf', caption:'Titre du document.' }
 *     ],
 *
 *     // kind === 'schema' : SVG inline
 *     svg: '<svg>...</svg>',
 *
 *     // kind === 'image' : une seule image
 *     img: 'demos/xxx/yyy.jpg',
 *   },
 *   // Un schéma (svg) peut aussi accompagner une galerie : il n'est
 *   // affiché que si kind === 'schema'.
 *
 *   // Démo. Mettre demo:null s'il n'y en a pas.
 *   //  - { type:'video', src, poster? } : le panneau visuel est REMPLACÉ
 *   //    par la vidéo (muette, en boucle, lue seulement quand visible)
 *   //    avec un overlay "▶ Voir la démo" ; un clic ouvre la vidéo nette
 *   //    avec contrôles. Les images/PDF de visual.images restent
 *   //    disponibles dans le bouton "Détails".
 *   //  - { type:'pdf', src, caption? } : ajouté au volet PDF de "Détails".
 *   demo: { type:'video', src:'demos/xxx/demo.mp4', poster:'demos/xxx/poster.png' } | null,
 *
 *   // Facultatif : bouton "Captures (n)" -> galerie séparée. [] pour le cacher.
 *   // Pour du contenu récent, préférer visual.images + "Détails".
 *   captures: [{ src:'demos/xxx/1.jpg', caption:'Ce que montre l'image.' }]
 * }
 *
 * BOUTON "DÉTAILS" : affiché dès qu'il y a au moins une image, un PDF
 * (dans visual.images ou demo) ou une vidéo. Disposition automatique :
 * images à gauche + PDF à droite si les deux existent, sinon une colonne.
 * ============================================================
 */

window.PROJECTS = [

  // ---------------------------------------------------------
  // 01 — Terraform Studio (flagship, PFE)
  // ---------------------------------------------------------
  {
    id: 'terraform-studio',
    index: '01',
    status: 'Projet phare · PFE Talan Tunisie · complété et soutenu',
    title: 'Terraform Studio',
    tags: ['Cloud AWS', 'IaC', 'Multi-Agents', 'Kafka'],
    summary: "Plateforme intelligente de génération et de gestion d'Iac, développée comme projet de fin d'études chez Talan Tunisie. Un backend en microservices orchestre un système multi-agents (LangGraph) — Architecte, Développeur, Auditeur — appuyé sur un graphe de connaissances construit à partir de 62 modules Terraform AWS.",
    points: [
      "Authentification AWS STS éphémère et automatisation CloudFormation",
      "Deux modes de visualisation : graphe interactif AntV X6 (déterministe) et diagrammes générés par IA (librairie Python diagrams)",
      "Évaluation par G-Eval / LLM-as-Judge : AWS Bedrock vs Ollama (DeepSeek, Mistral) sur 50 projets de test",
      "Infrastructure conteneurisée : 13 à 14 conteneurs Docker (PostgreSQL, MongoDB, Neo4j, Kafka, Zookeeper, microservices Spring Boot / Python / Angular)"
    ],
    note: '',
    links: [{ label: 'Voir sur GitHub', href: 'https://github.com/Safwen707/Terraformstudio' }],
    visual: {
      kind: 'gallery',
      images: [
        { src: 'demos/TerraformStudio/archMultiAgent.png', caption: 'Architecture multi-agents de Terraform Studio.' },
        { src: 'demos/TerraformStudio/authentificationephemerAWSSTS.png', caption: 'Authentification AWS STS éphémère.' },
        { src: 'demos/TerraformStudio/autumatisationavecCloudFormation.png', caption: 'Automatisation avec AWS CloudFormation.' }
      ],
      svg: `
        <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="IBM Plex Mono, monospace">
          <style>
            .box{ fill:#161D2B; stroke:#232B3A; }
            .accentbox{ fill:rgba(57,214,180,0.08); stroke:rgba(57,214,180,0.4); }
            .lbl{ fill:#8993A6; font-size:11px; }
            .lbl-accent{ fill:#39D6B4; font-size:11px; }
            .edge{ stroke:#2C3547; stroke-width:1; }
          </style>
          <rect x="24" y="24" width="140" height="34" rx="7" class="accentbox"/>
          <text x="94" y="45" text-anchor="middle" class="lbl-accent">Architecte</text>
          <rect x="190" y="24" width="140" height="34" rx="7" class="accentbox"/>
          <text x="260" y="45" text-anchor="middle" class="lbl-accent">Développeur</text>
          <rect x="356" y="24" width="140" height="34" rx="7" class="accentbox"/>
          <text x="426" y="45" text-anchor="middle" class="lbl-accent">Auditeur</text>
          <text x="260" y="82" text-anchor="middle" class="lbl">agents LangGraph</text>

          <line x1="94" y1="58" x2="220" y2="120" class="edge"/>
          <line x1="260" y1="58" x2="220" y2="120" class="edge"/>
          <line x1="426" y1="58" x2="220" y2="120" class="edge"/>

          <rect x="120" y="120" width="200" height="46" rx="7" class="box"/>
          <text x="220" y="140" text-anchor="middle" class="lbl">Graphe de connaissances</text>
          <text x="220" y="155" text-anchor="middle" class="lbl">Neo4j · 62 modules Terraform AWS</text>

          <line x1="220" y1="166" x2="220" y2="206" class="edge"/>
          <rect x="70" y="206" width="300" height="46" rx="7" class="box"/>
          <text x="220" y="226" text-anchor="middle" class="lbl">Backend microservices</text>
          <text x="220" y="241" text-anchor="middle" class="lbl">Spring Cloud · Eureka · Gateway · Kafka</text>

          <line x1="220" y1="252" x2="220" y2="292" class="edge"/>
          <rect x="90" y="292" width="260" height="46" rx="7" class="accentbox"/>
          <text x="220" y="312" text-anchor="middle" class="lbl-accent">AWS (STS éphémère)</text>
          <text x="220" y="327" text-anchor="middle" class="lbl-accent">CloudFormation</text>

          <line x1="220" y1="338" x2="220" y2="366" class="edge"/>
          <rect x="60" y="366" width="150" height="38" rx="7" class="box"/>
          <text x="135" y="389" text-anchor="middle" class="lbl">Graphe AntV X6</text>
          <rect x="230" y="366" width="230" height="38" rx="7" class="box"/>
          <text x="345" y="389" text-anchor="middle" class="lbl">Diagrammes IA (Python diagrams)</text>
        </svg>`
    },
    demo: {
      type: 'video',
      src: 'https://pub-d2be4d3c672a4a60aa75997ad2c000ff.r2.dev/R2/TerraformStudio.mp4'
    },
    captures: []
  },

  // ---------------------------------------------------------
  // 02 — RFP Agentic RAG Platform (flagship, Talan)
  // ---------------------------------------------------------
  {
    id: 'rfp-agentic-rag',
    index: '02',
    status: 'Projet phare · Talan Tunisie',
    title: 'RFP Agentic RAG Platform',
    tags: ['IA Agentique', 'NLP', 'RAG'],
    summary: "Plateforme d'agents IA pour la réponse aux appels d'offres (RFP), développée au sein du département innovation de Talan Tunisie. Un pipeline RAG automatisé traite les documents métier, les indexe dans une base vectorielle et permet à des agents orchestrés par LangGraph de produire une proposition de réponse à un appel d'offres.",
    points: [
      "Pipeline RAG automatisé : traitement de documents métier, indexation vectorielle (FAISS) et recherche sémantique",
      "Agents orchestrés avec LangGraph ; résultat final : une proposition de réponse à l'appel d'offres",
      "Industrialisation et déploiement du pipeline, exposé via des APIs REST (Python)",
      "Temps de réponse accéléré d'un facteur 7 à 10"
    ],
    note: '',
    links: [{ label: 'Voir sur GitHub', href: 'https://github.com/Safwen707/Module-Library-Creation-from-RFP-Analysis-Put-On-the-shelf-' }],
    visual: {
      kind: 'gallery',
      images: [
        { src: 'demos/AuraStageTalan/aura.png', caption: 'Aperçu de la plateforme Aura Stage Talan.' }
      ]
    },
    demo: {
      type: 'video',
      src: 'https://pub-d2be4d3c672a4a60aa75997ad2c000ff.r2.dev/R2/aura.mp4',
      poster: 'demos/AuraStageTalan/aura.png'
    },
    captures: []
  },

  // ---------------------------------------------------------
  // 03 — AMS Spring CI/CD (flagship)
  // ---------------------------------------------------------
  {
    id: 'ams-spring-cicd',
    index: '03',
    status: 'Projet phare · DevOps',
    title: 'AMS Spring CI/CD',
    tags: ['DevOps', 'Kubernetes', 'Jenkins', 'Azure'],
    summary: "Pipeline CI/CD pour une application Spring : intégration continue avec Jenkins, orchestration Kubernetes et déploiement sur Azure. Le rapport de déploiement complet documente la mise en place de bout en bout.",
    points: [
      "Intégration continue de l'application Spring avec Jenkins",
      "Orchestration de l'application sur Kubernetes",
      "Déploiement sur Azure",
      "Rapport de déploiement ) consultable directement dans « Détails »"
    ],
    note: '',
    links: [{ label: 'Voir sur GitHub', href: 'https://github.com/Safwen707/ams_spring_cicd' }],
    visual: {
      kind: 'gallery',
      images: [
        { type: 'pdf', src: 'demos/amsSpringDep.pdf', caption: 'Rapport de déploiement AMS Spring CI/CD.' }
      ]
    },
    demo: null,
    captures: []
  },

  // ---------------------------------------------------------
  // 04 — Smart Guardian (spécialisé sécurité, perso)
  // ---------------------------------------------------------
  {
    id: 'smart-guardian',
    index: '04',
    status: 'Spécialisé · Sécurité IoT · Projet personnel',
    title: 'Smart Guardian',
    tags: ['Cryptographie (ASCON-128)', 'ESP32 / C++', 'MQTT', 'Zero-Trust'],
    summary: "Système de surveillance IoT : un ESP32 lit trois capteurs (son, porte, choc), chiffre les données avec ASCON-128 (AEAD, implémenté à la main) avant de les publier sur un broker MQTT Mosquitto, qui ne voit jamais que du texte chiffré. Un client Python sous Termux s'abonne, vérifie le tag d'authenticité et déchiffre pour afficher l'état en clair.",
    points: [
      "Score de menace = somme pondérée des capteurs déclenchés (son +25, porte +40, choc +35, max 100)",
      "Enveloppe MQTT { nonce, ad, cipher, tag } : nonce aléatoire à chaque message, associated data authentifiée mais en clair, tag d'intégrité recalculé côté client",
      "Test de rejeu : un message authentique republié avec 1 bit modifié dans le tag est rejeté par le client (Auth failed)"
    ],
    note: "",
    links: [{ label: 'Voir sur GitHub', href: 'https://github.com/Safwen707/iot-security' }],
    visual: {
      kind: 'gallery',
      images: [
        { src: 'demos/SmartGuardian/son-detecte.jpg', caption: 'Détection sonore côté client.' },
        { src: 'demos/SmartGuardian/choc-detecte.jpg', caption: 'Détection d’un choc ou d’une vibration.' },
        { src: 'demos/SmartGuardian/porte-ouvert-ferme.jpg', caption: 'Transition porte ouverte / porte fermée.' },
        { src: 'demos/SmartGuardian/cipher-txt.png', caption: 'Chiffrement ASCON-128 et publication MQTT.' },
        { src: 'demos/SmartGuardian/rejeu.png', caption: 'Test de rejeu avec tag modifié.' },
        { src: 'demos/SmartGuardian/authfailed.jpg', caption: 'Message altéré rejeté : Auth failed.' }
      ]
    },
    demo: {
      type: 'video',
      src: 'https://pub-d2be4d3c672a4a60aa75997ad2c000ff.r2.dev/R2/demo.mp4'
    },
    captures: []
  },

  // ---------------------------------------------------------
  // 05 — SecureSQLi (spécialité ML/Data)
  // ---------------------------------------------------------
  {
    id: 'securesqli',
    index: '05',
    status: 'Spécialité · ML / Data',
    title: 'SecureSQLi',
    tags: ['ML / Data'],
    summary: "Application de sensibilisation et de prévention des injections SQL (SQLi). Elle simule des requêtes dans un environnement contrôlé, puis utilise un modèle de machine learning pour identifier automatiquement les requêtes potentiellement dangereuses.",
    points: [
      "Interface vulnérable contrôlée pour simuler des requêtes légitimes et malveillantes",
      "Classification des requêtes SQL avec  XGBoost et TF-IDF vectorizer",
      "Backend Flask connecté à une application Node.js / Express et une base MySQL",
      "Visualisation des performances avec précision, F1-score et matrice de confusion"
    ],
    note: "Les fichiers sqlInjection.txt, tfidf_vectorizer.pkl et xgboost_best_model.pkl servent respectivement aux exemples annotés, à la vectorisation et à la prédiction.",
    links: [{ label: 'Voir sur GitHub', href: 'https://github.com/Safwen707/Projet-SecureSQLi-D-tection-et-pr-vention-des-injections-SQL-par-l-intelligence-artificielle' }],
    visual: { kind: 'placeholder' },
    demo: {
      type: 'video',
      src: 'https://pub-d2be4d3c672a4a60aa75997ad2c000ff.r2.dev/R2/SequreSqli.mp4'
    },
    captures: []
  },

  // ---------------------------------------------------------
  // 06 — Deep Elderly Activity (spécialité ML/Data)
  // ---------------------------------------------------------
  {
    id: 'deep-elderly-activity',
    index: '06',
    status: 'Spécialité · ML / Data',
    title: 'Deep Elderly Activity Recognition',
    tags: ['ML / Data'],
    summary: "Système de reconnaissance d'activités dans un environnement domotique, basé sur des données de capteurs et un modèle LSTM. Le projet couvre la préparation des données, l'étiquetage des activités, l'extraction de caractéristiques et la prédiction.",
    points: [
      "Prétraitement des données : nettoyage, gestion des valeurs manquantes, détection des valeurs aberrantes et normalisation",
      "Étiquetage des séquences entre activités à partir des changements brusques des capteurs et des fichiers de référence",
      "Extraction de caractéristiques temporelles et préparation des vecteurs X et y pour l'entraînement LSTM",
      "API /predict : traitement par lots, prédiction d'activité, score de confiance, timestamps et gestion des erreurs",
      "Chargement réutilisable du modèle LSTM, du scaler et des labels au démarrage du serveur"
    ],
    note: "",
    links: [{ label: 'Voir sur GitHub', href: 'https://github.com/Safwen707/Deep-Elderly-Activity-Recognition-in-smart-home' }],
    visual: {
      kind: 'gallery',
      images: [
        { src: 'demos/deep/deep.png', caption: 'Aperçu du projet Deep Elderly Activity Recognition.' },
        { src: 'demos/deep/NumberOfLinesPerActivityBeforeLabeling.png', caption: 'Nombre de lignes par activité avant labellisation.' },
        { src: 'demos/deep/arubaData.png', caption: 'Données d’activité Aruba.' },
        { src: 'demos/deep/aruba.jpg', caption: 'Exemple de données Aruba.' }
      ]
    },
    demo: {
      type: 'video',
      src: 'https://pub-d2be4d3c672a4a60aa75997ad2c000ff.r2.dev/R2/-DeepElderlyActivityDetection.mp4'
    },
    captures: []
  },

  // ---------------------------------------------------------
  // 07 — TRVL Code Scrapper (stage full-stack, TRVL CODE)
  // ---------------------------------------------------------
  {
    id: 'trvl-code-scrapper',
    index: '07',
    status: 'Stage full-stack · TRVL CODE',
    title: 'TRVL Code Scrapper',
    tags: ['Full-stack', 'Scraping'],
    summary: "Application de contrôle d'accès basée sur le modèle RBAC, combinée à un système de web scraping des tarifs hôteliers. Les prix récupérés sont recalculés en fonction de la date des feedbacks afin de fournir une information tarifaire contextualisée.",
    points: [
      "Gestion des utilisateurs, rôles et permissions selon une logique RBAC",
      "Collecte des tarifs hôteliers par web scraping",
      "Recalcul des prix en fonction des dates associées aux feedbacks",
      "Organisation des données et des traitements dans une application web full-stack"
    ],
    note: "",
    links: [{ label: 'Voir sur GitHub', href: 'https://github.com/Safwen707/booking' }],
    visual: {
      kind: 'gallery',
      images: [
        { src: 'demos/TrvlcodeScrapper/view.png', caption: 'Aperçu du projet TRVL Code Scrapper.' },
        { type: 'pdf', src: 'demos/TrvlcodeScrapper/TrvlCodeScrapper.pdf', caption: 'Rapport de stage TRVL Code Scrapper.' }
      ]
    },
    demo: null,
    captures: []
  },

  // ---------------------------------------------------------
  // 08 — Déploiement d'Infrastructure Azure
  // ---------------------------------------------------------
  {
    id: 'azure-infrastructure-deployment',
    index: '08',
    status: 'Projet personnel · Infrastructure as Code',
    title: 'Déploiement d’Infrastructure Azure',
    tags: ['Azure', 'Terraform', 'Linux', 'Docker'],
    summary: "Déploiement automatisé d'une petite infrastructure Microsoft Azure avec Terraform : groupe de ressources, réseau virtuel, sous-réseau, règles de sécurité, adresse IP publique, interface réseau et VM Ubuntu 22.04. La VM est provisionnée au premier démarrage avec cloud-init pour installer Docker automatiquement.",
    points: [
      "Infrastructure réseau Azure complète : VNet, subnet, NSG et association des règles de sécurité",
      "Création automatisée d'une adresse IP publique, d'une interface réseau et d'une VM Linux",
      "Bootstrap cloud-init pour installer Docker dès le premier démarrage",
      "Connexion SSH simplifiée avec une configuration compatible VS Code Remote"
    ],
    note: "",
    links: [{ label: 'Voir sur GitHub', href: 'https://github.com/Safwen707/terraforme--azure' }],
    visual: {
      kind: 'gallery',
      images: [
        { src: 'demos/terraformAzure/1762196690993.jpeg', caption: 'Connexion SSH à la VM Ubuntu déployée sur Azure.' },
        { src: 'demos/terraformAzure/1762196692300.jpeg', caption: 'Ressources réseau Azure créées par Terraform.' }
      ]
    },
    demo: null,
    captures: []
  }

];

/**
 * ------------------------------------------------------------
 * NOTE — hébergement des médias
 *
 * Les vidéos de `demos/` sont lourdes. Une URL absolue
 * (par ex. un bucket Cloudflare R2 : https://...) fonctionne
 * exactement comme un chemin relatif dans les champs "src" et
 * "poster" — aucun autre changement de code n'est nécessaire.
 * ------------------------------------------------------------
 */