# Phase 0 — Cadrage produit

## Décision fondatrice

LaForge n'est ni un gestionnaire de tâches généraliste, ni un traitement de texte complet, ni un bloqueur de distractions système. C'est un instrument d'engagement pour produire un premier jet quand la difficulté principale est de commencer ou d'arrêter de se corriger.

## Proposition de valeur

> LaForge transforme une intention en premier jet : choisis jusqu'à trois résultats, engage-toi sur l'un d'eux, puis avance sans retour en arrière jusqu'à la fin du sprint.

## Cible primaire

La cible primaire est une personne qui doit produire régulièrement du texte exigeant mais qui perd du temps devant la page blanche ou dans la correction prématurée :

- étudiant ou doctorant rédigeant un mémoire, une dissertation ou des notes de recherche ;
- professionnel préparant un rapport, une proposition, une documentation ou une présentation ;
- créateur rédigeant un article, un script, une newsletter ou un chapitre.

Le niveau technique n'est pas discriminant. La personne sait ce qu'elle veut produire, mais a besoin d'un cadre pour convertir son intention en matière écrite.

## Situations d'usage prioritaires

1. **Commencer une section intimidante.** La personne sait ce qu'elle doit écrire mais repousse le premier paragraphe.
2. **Débloquer un passage.** Elle tourne autour d'une formulation et a besoin d'avancer avant de juger.
3. **Progresser pendant une fenêtre courte.** Elle dispose de 10 à 25 minutes et veut en tirer un résultat visible.
4. **Reprendre un projet.** Elle revient après une interruption et veut retrouver immédiatement la prochaine action utile.

## Job to be done

> Quand je dois produire un texte mais que j'hésite ou que je me corrige trop tôt, je veux m'engager sur un résultat limité et écrire sans pouvoir revenir en arrière, afin de terminer une première matière que je pourrai améliorer ensuite.

## Limites explicites

- Une application web ne peut pas empêcher de manière fiable le changement d'onglet ou d'application. LaForge verrouille son propre espace de travail, pas l'ordinateur.
- L'utilisateur peut toujours interrompre une session. La sortie est claire et assumée ; elle ne détruit jamais le texte.
- Le MVP ne juge pas la qualité du texte et ne propose pas de génération par IA.
- LaForge ne remplace pas un éditeur long format. La révision existe, mais reste volontairement simple.
- La liste de trois tâches est une rampe de lancement, pas un backlog.
- Aucun mécanisme de fidélisation ne doit culpabiliser, masquer une sortie ou manipuler une perte artificielle.

## Vocabulaire produit

| Terme | Définition | Règle d'interface |
| --- | --- | --- |
| **Projet** | Ensemble durable de textes orientés vers un même résultat, par exemple « Mémoire de master ». | Toujours nommé par l'utilisateur. |
| **Tâche** | Résultat concret qui peut recevoir un jet, par exemple « Rédiger l'ouverture du chapitre 2 ». | Trois tâches actives maximum. |
| **Jet** | Matière écrite produite pendant un sprint et conservée comme unité d'historique. | Un jet n'est jamais écrasé par une révision. |
| **Sprint** | Intervalle temporel pendant lequel l'écriture avance uniquement vers l'avant. | Une seule tâche active ; durée connue avant le départ. |
| **Série** | Continuité de pratique constatée sur plusieurs jours. | Ne remet jamais la valeur passée à zéro. Le terme visible privilégié est « rythme ». |
| **Texte forgé** | Texte déverrouillé à la fin d'un sprint, prêt à être relu ou exporté. | Présenté comme une matière obtenue, pas comme un texte « terminé ». |

## Règles des trois tâches

Une tâche actionnable respecte les règles suivantes :

- elle commence idéalement par un verbe de production : rédiger, expliquer, résumer, comparer, décrire ;
- elle produit un résultat visible en une ou quelques sessions ;
- elle ne contient qu'un seul résultat principal ;
- elle tient en une phrase courte, comprise hors contexte ;
- elle peut recevoir une amorce optionnelle, mais pas une sous-liste infinie ;
- elle reste modifiable avant le sprint et devient verrouillée pendant celui-ci.

### Exemples

| Trop vague | Actionnable |
| --- | --- |
| Travailler sur mon mémoire | Rédiger l'ouverture du chapitre sur la confiance numérique |
| Avancer le rapport | Expliquer les trois causes du retard du projet |
| Newsletter | Écrire une introduction qui présente le problème de la semaine |

## Promesse de contrôle

LaForge impose une contrainte à l'écriture, jamais à la propriété du travail. Le texte est sauvegardé, récupérable, exportable et supprimable par son auteur. Une interruption volontaire est possible à tout moment après une explication concise de ses conséquences.

