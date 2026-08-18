# LaForge — feuille de route de développement

> Statut actuel : phase 0 matérialisée et en attente de validation produit.
>
> Règle de démarrage : ne pas commencer la phase 0 avant le premier push et l'aval explicite du propriétaire du projet.

## Principes produit

- LaForge est une application d'écriture focalisée : préparer au maximum trois résultats, s'engager sur l'un d'eux, puis écrire sans retour en arrière pendant un sprint.
- Le produit doit favoriser une habitude forte sans dark patterns : progression visible, récompenses sobres, maîtrise des données et possibilité de quitter clairement expliquée.
- Le MVP doit rester centré sur la production d'un premier jet. Toute fonctionnalité qui ne renforce ni le démarrage, ni l'élan, ni l'achèvement est reportée.
- Le fonctionnement essentiel doit rester fiable même après un rechargement de page ou une perte momentanée de connexion.

## Pré-phase — Préparer le dépôt

- [x] Choisir l'une des trois propositions de configuration du dépôt.
- [x] Initialiser ou rattacher le dépôt local au dépôt GitHub `ridwaneladany-dotcom/LaForge`.
- [x] Installer les skills tiers demandés dans le périmètre local retenu.
- [x] Ajouter les fichiers de base retenus (`README.md`, règles Git, consignes agent et attribution des dépendances tierces).
- [x] Vérifier l'état Git, le contenu suivi et l'absence de secrets.
- [x] Créer les commits atomiques de préparation.
- [x] Effectuer le premier push.
- [x] Attendre l'aval explicite avant de commencer la phase 0.

## Phase 0 — Cadrage produit et expérience

Objectif : figer le problème, la promesse et la boucle comportementale avant de choisir l'architecture ou de produire l'interface finale.

- [x] Définir la cible primaire et ses situations d'usage prioritaires.
- [x] Rédiger la proposition de valeur en une phrase et les limites explicites du produit.
- [x] Définir le vocabulaire de LaForge : projet, tâche, jet, sprint, série et texte forgé.
- [x] Détailler le parcours complet : arrivée, préparation, engagement, sprint, sortie, révision et reprise.
- [x] Définir les règles des trois tâches maximum et les critères d'une tâche actionnable.
- [x] Concevoir la boucle d'engagement éthique : déclencheur, action, retour immédiat, récompense et investissement.
- [x] Choisir les indicateurs MVP : activation, premier sprint terminé, mots produits, retour à J1/J7 et taux d'abandon.
- [x] Réaliser les wireflows desktop et mobile des états critiques.
- [x] Définir la direction visuelle, les principes d'animation et le ton rédactionnel.
- [x] Rédiger les critères d'acceptation du MVP et la liste explicite des éléments hors périmètre.

### Validation de phase 0

- [x] Le parcours peut être expliqué et testé sans ambiguïté.
- [x] Chaque mécanisme d'engagement sert la production et respecte le contrôle de l'utilisateur.
- [ ] Les décisions produit structurantes sont approuvées avant le développement.

## Phase 1 — Fondation technique

Objectif : disposer d'une base web rapide, accessible, testable et déployable.

- [ ] Choisir et documenter la stack à partir des besoins validés en phase 0.
- [ ] Initialiser l'application, le typage, le linting, le formatage et les tests.
- [ ] Définir les modèles de données : préférences, projets, tâches, jets et séries.
- [ ] Installer le design system minimal : tokens, typographie, couleurs, espacements et composants essentiels.
- [ ] Mettre en place la navigation, les erreurs globales et les états de chargement.
- [ ] Ajouter une intégration continue minimale pour les vérifications bloquantes.

## Phase 2 — Préparation d'un jet

Objectif : permettre de transformer une intention vague en session immédiatement actionnable.

- [ ] Créer, modifier, ordonner et supprimer jusqu'à trois tâches.
- [ ] Aider à reformuler une tâche vague en résultat concret sans imposer d'IA au MVP.
- [ ] Sélectionner la tâche active et conserver les autres comme file d'attente verrouillée.
- [ ] Choisir une durée prédéfinie ou personnalisée.
- [ ] Définir un objectif optionnel de mots et une amorce de rédaction.
- [ ] Présenter un récapitulatif d'engagement avant le lancement.
- [ ] Optimiser le parcours clavier, mobile et lecteur d'écran.

## Phase 3 — Cœur du sprint d'écriture

Objectif : créer un tunnel d'exécution fiable qui maintient l'élan sans perdre le travail.

- [ ] Construire l'éditeur d'écriture uniquement vers l'avant.
- [ ] Bloquer le déplacement du curseur, la sélection rétroactive, la suppression antérieure et l'annulation pendant le sprint.
- [ ] Prévoir un marqueur rapide comme `[À REVOIR]` pour ne pas interrompre le flux.
- [ ] Afficher la tâche active, le temps restant et la progression avec une hiérarchie visuelle calme.
- [ ] Estomper progressivement le texte antérieur sans nuire à l'accessibilité.
- [ ] Verrouiller les fonctions secondaires pendant le sprint.
- [ ] Persister le texte, la tâche et l'échéance afin de résister au rechargement.
- [ ] Gérer clairement la sortie anticipée, la reprise après incident et la fin du temps.
- [ ] Tester les raccourcis, le collage, les méthodes de saisie, le tactile et les cas limites de l'éditeur.

## Phase 4 — Fin de sprint et révision

Objectif : transformer l'effort en résultat visible et préparer naturellement l'action suivante.

- [ ] Déverrouiller sans délai l'intégralité du texte à la fin.
- [ ] Afficher un bilan sobre : durée, mots produits, objectif et tâche associée.
- [ ] Permettre de valider, prolonger ou replanifier la tâche.
- [ ] Fournir un mode de révision normal sans contrainte d'écriture vers l'avant.
- [ ] Permettre de lancer la tâche suivante en peu d'actions.
- [ ] Préserver l'historique des jets sans écraser les versions antérieures.

## Phase 5 — Persistance, projets et export

Objectif : rendre LaForge utile au-delà d'une session isolée.

- [ ] Créer et retrouver des projets localement.
- [ ] Ajouter une sauvegarde automatique avec indicateur d'état fiable.
- [ ] Prévoir une stratégie de migration des données locales.
- [ ] Exporter un jet ou un projet en texte brut et Markdown.
- [ ] Évaluer l'export PDF après validation des usages réels.
- [ ] Ajouter l'import de texte sans compromettre le mode verrouillé.
- [ ] Fournir un moyen simple d'exporter ou supprimer toutes les données.

## Phase 6 — Boucle d'engagement du MVP

Objectif : donner envie de revenir grâce au sentiment de progression, pas à la culpabilité.

- [ ] Mettre en scène le lancement et l'achèvement d'un jet avec des animations rapides et cohérentes.
- [ ] Afficher une série de jours avec un mode de récupération non punitif.
- [ ] Visualiser les jets terminés, le temps investi et les mots produits.
- [ ] Concevoir des paliers de maîtrise ou de chaleur de forge sans économie virtuelle complexe.
- [ ] Ajouter des micro-retours sonores et haptiques optionnels, désactivables et respectueux des préférences système.
- [ ] Tester plusieurs intensités de feedback sans ralentir le démarrage d'un sprint.
- [ ] Vérifier que chaque mécanisme de rétention améliore l'activation ou l'achèvement.

## Phase 7 — Qualité et préparation bêta

Objectif : livrer une bêta utilisable quotidiennement sans compromettre les données ni l'accessibilité.

- [ ] Couvrir les parcours critiques par des tests unitaires, d'intégration et end-to-end.
- [ ] Tester l'accessibilité clavier, lecteur d'écran, contraste, mouvement réduit et zoom.
- [ ] Vérifier les performances sur mobile et ordinateur modestes.
- [ ] Auditer la sécurité, la confidentialité, les dépendances et l'absence de secrets.
- [ ] Ajouter une gestion des erreurs observable sans collecter le contenu des textes.
- [ ] Rédiger la politique de données et les limites du verrouillage dans une application web.
- [ ] Tester l'installation PWA et le fonctionnement hors connexion si retenus.
- [ ] Préparer le déploiement de préproduction et la procédure de retour arrière.

## Phase 8 — Bêta, mesure et décision de lancement

Objectif : confronter la promesse à de vrais usages avant d'élargir le produit.

- [ ] Recruter un petit groupe de bêta-testeurs correspondant à la cible primaire.
- [ ] Mesurer l'activation, l'achèvement, les abandons et le retour sans analyser le contenu écrit.
- [ ] Organiser les retours par problème observé plutôt que par fonctionnalité demandée.
- [ ] Corriger les blocages critiques et simplifier les étapes qui retardent le premier jet.
- [ ] Comparer les résultats aux critères MVP définis en phase 0.
- [ ] Décider : lancer, itérer ou réduire le périmètre.

## Après le MVP — À ne pas anticiper

- Synchronisation multi-appareils et comptes utilisateurs.
- Collaboration ou partage de projets.
- Assistance rédactionnelle par IA.
- Bibliothèque de modèles de tâches et de projets.
- Mode desktop natif et blocage système renforcé.
- Monétisation, équipes et fonctionnalités professionnelles.
