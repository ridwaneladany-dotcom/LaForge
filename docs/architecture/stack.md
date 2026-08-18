# Architecture — choix de stack

## Décision

LaForge utilise une application monopage React écrite en TypeScript et construite avec Vite.

| Besoin | Choix | Raison |
| --- | --- | --- |
| Interface | React | Composer les états préparation, sprint et bilan sans imposer de framework serveur. |
| Langage | TypeScript strict | Protéger les modèles de tâches, jets et sprints ainsi que leurs migrations. |
| Build | Vite | Démarrage rapide, sortie statique et déploiement simple sur un hébergeur comme Vercel. |
| Styles | CSS natif + tokens | Préserver la direction papier et machine à écrire sans dépendre d'une bibliothèque de composants. |
| Tests | Vitest + Testing Library | Tester la logique et les parcours avec le même environnement de modules que l'application. |
| Qualité | ESLint + Prettier | Bloquer les erreurs courantes et maintenir des fichiers homogènes. |
| Persistance MVP | Stockage local versionné | Fonctionner sans compte ni backend et garder les textes sous le contrôle de leur auteur. |

## Pourquoi pas un framework serveur

Le MVP ne demande ni rendu serveur, ni compte, ni synchronisation, ni données distantes. Ajouter ces capacités maintenant augmenterait la surface de panne et ralentirait l'expérimentation sur le cœur du produit : préparer trois résultats et produire un jet.

Une migration vers une architecture avec serveur restera possible si les usages validés exigent plus tard une synchronisation multi-appareils ou une collaboration. Elle ne doit pas influencer les modèles du MVP avant ce besoin.

## Structure retenue

```text
src/
├── app/          composition et états globaux de l'application
├── components/   composants d'interface réutilisés
├── data/         persistance locale et migrations
├── domain/       modèles et règles métier sans dépendance React
├── features/     parcours produit organisés par capacité
└── styles/       tokens et styles globaux
```

## Garde-fous

- Aucun contenu rédigé n'est envoyé à un service distant ou à une analytique.
- Le build doit échouer si le typage, le linting ou les tests échouent.
- Le stockage porte un numéro de version et ne remplace jamais silencieusement un jet existant.
- Les composants essentiels fonctionnent au clavier et respectent les préférences de mouvement.
- Le prototype de phase 0 reste conservé dans `docs/phase-0/prototype` comme référence d'expérience, pas comme code de production.

## Critères de réévaluation

Reconsidérer la stack uniquement si un besoin validé exige au moins l'un des éléments suivants : rendu serveur, comptes, synchronisation distante, collaboration ou contenu public indexable.
