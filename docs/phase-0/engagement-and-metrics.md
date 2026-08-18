# Phase 0 — Engagement éthique et mesure

## Position

LaForge doit devenir une habitude parce que l'utilisateur associe l'application à un résultat concret et à une sensation de progression. La rétention recherchée vient de la compétence acquise, pas de la peur de perdre une récompense.

## Boucle comportementale

### 1. Déclencheur

- **Externe :** le projet et les trois prochaines tâches restent prêts à la réouverture.
- **Interne :** la personne ressent une résistance devant une page blanche ou une fenêtre de temps disponible.

La page d'arrivée doit répondre en moins de cinq secondes à trois questions : sur quoi travailler, pendant combien de temps et que se passera-t-il au démarrage.

### 2. Action minimale

1. Choisir l'une des trois tâches déjà préparées.
2. Conserver ou modifier la durée proposée.
3. Appuyer sur `Forger 15 min`.

Au retour, le dernier projet et la prochaine tâche sont présélectionnés sans déclencher automatiquement une session.

### 3. Retour immédiat

- Le bouton répond au pointer-down et devient le point d'origine de la transition vers le sprint.
- Le chrome secondaire disparaît en moins de 240 ms.
- Le curseur est immédiatement prêt dans l'éditeur ; aucun compte à rebours ne retarde la première phrase.
- Le temps, la sauvegarde et l'état « vers l'avant » restent visibles mais silencieux.

### 4. Récompense

La récompense est déterministe et liée à l'effort :

- quantité de matière produite ;
- tâche visiblement avancée ou terminée ;
- carte de jet ajoutée à l'historique ;
- augmentation de la **braise**, représentation douce de la pratique récente.

La fin naturelle du temps est signalée par une montre mécanique plein écran pendant 4,2 secondes. Elle bloque uniquement la poursuite de la saisie déjà arrivée à son terme, conserve le texte et respecte le réglage sonore. La célébration du bilan qui suit dure moins de 300 ms et perd ses translations avec `prefers-reduced-motion`.

### 5. Investissement

Après le bilan, l'utilisateur peut :

- marquer la tâche comme accomplie ;
- conserver la tâche et lancer un jet supplémentaire ;
- préparer la prochaine tâche ;
- réviser le texte forgé.

Chaque fin de sprint réduit donc la friction du prochain démarrage.

## La braise plutôt qu'une série punitive

La **braise** représente le rythme des sept derniers jours : elle chauffe à chaque sprint terminé et refroidit progressivement sans effacer l'historique.

- Un jour manqué ne remet jamais un compteur à zéro.
- Aucun message rouge, alerte anxiogène ou notification culpabilisante.
- Le record peut exister dans l'historique, mais ne domine pas l'écran d'accueil.
- La reprise utilise un langage positif : `La braise est encore là. Un jet suffit pour repartir.`

## Mécanismes retenus pour le MVP

| Mécanisme | Valeur utilisateur | Garde-fou |
| --- | --- | --- |
| Trois tâches prêtes | Réduit la décision au moment d'agir | Maximum strict, pas de backlog caché |
| Durée présélectionnée | Réduit la friction de lancement | Toujours modifiable avant le sprint |
| Écriture vers l'avant | Empêche la correction prématurée | Sortie visible, texte toujours sauvegardé |
| Bilan de jet | Rend l'effort tangible | Pas de note de qualité ni classement |
| Braise sur sept jours | Donne envie de maintenir un rythme | Pas de remise à zéro punitive |
| Historique des jets | Montre l'investissement cumulé | Mesure privée, jamais comparée à autrui |

## Mécanismes rejetés

- monnaie virtuelle et boutique ;
- coffres, récompenses aléatoires ou suspense artificiel ;
- classement social ;
- notifications trompeuses ou urgentes ;
- mascotte triste lorsque l'utilisateur ne revient pas ;
- perte définitive d'une série ou d'un avantage ;
- objectifs quotidiens imposés ;
- analyse du contenu écrit.

## Indicateurs MVP

### Indicateur principal

**Taux de jets terminés parmi les jets commencés.** Il mesure si la contrainte aide réellement à aller jusqu'au bout de l'engagement choisi.

### Activation

Un utilisateur est activé lorsqu'il a :

1. créé ou accepté une tâche actionnable ;
2. commencé un premier sprint ;
3. écrit au moins un caractère ;
4. atteint la fin ou effectué une sortie volontaire avec texte conservé.

### Événements autorisés

| Événement | Propriétés autorisées |
| --- | --- |
| `task_created` | longueur catégorisée, position 1–3 |
| `sprint_started` | durée choisie, présence d'un objectif de mots |
| `first_character_typed` | délai depuis le lancement |
| `sprint_completed` | durée prévue, durée réelle, nombre de mots agrégé |
| `sprint_exited` | durée écoulée, présence de texte, motif choisi |
| `review_opened` | délai depuis la fin du sprint |
| `return_visit` | nombre de jours depuis la dernière visite |

Le titre des projets, le texte des tâches, les amorces et le contenu rédigé sont toujours exclus de l'analytique.

### Tableau de lecture

- activation lors de la première visite ;
- délai médian avant le premier caractère ;
- taux de jets terminés ;
- mots médians par jet terminé ;
- retour à J1 et J7 ;
- part des sorties volontaires avec texte récupéré ;
- part des utilisateurs qui lancent une deuxième session.

## Hypothèses à tester

1. Trois tâches maximum réduisent le temps de décision sans créer de frustration.
2. Une durée par défaut de 15 minutes produit plus de premiers jets terminés que 25 minutes.
3. La braise sur sept jours motive mieux la reprise qu'une série remise à zéro.
4. Montrer le nombre de mots seulement à la fin réduit l'auto-jugement pendant le sprint.
5. Une sortie claire augmente la confiance sans augmenter significativement les abandons.
