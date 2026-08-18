<p align="center">
  <img src="assets/laforge-mark.svg" width="112" height="112" alt="Logo LaForge" />
</p>

<h1 align="center">LaForge</h1>

<p align="center">
  <strong>Transforme une intention en matière.</strong><br />
  Une application d’écriture focalisée pour avancer avant de corriger.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/statut-phase%203-d95632?style=flat-square" alt="Statut : phase 3" />
  <img src="https://github.com/ridwaneladany-dotcom/LaForge/actions/workflows/ci.yml/badge.svg" alt="Qualité du projet" />
  <img src="https://img.shields.io/badge/licence-MIT-292521?style=flat-square" alt="Licence MIT" />
  <img src="https://img.shields.io/badge/open%20source-oui-567a5e?style=flat-square" alt="Projet open source" />
</p>

---

LaForge aide à franchir le moment le plus difficile d’un projet d’écriture : commencer et continuer malgré l’envie de corriger chaque phrase.

L’utilisateur prépare jusqu’à trois résultats concrets, en choisit un, puis entre dans un sprint où le texte avance uniquement vers l’avant. La révision complète s’ouvre à la fin, une fois qu’il existe enfin de la matière à façonner.

## L’expérience

1. **Préparer** — formuler trois résultats maximum et choisir la priorité du moment.
2. **S’engager** — sélectionner une durée et entrer dans un sprint sans distraction.
3. **Avancer** — écrire vers l’avant, avec une sauvegarde continue et une sortie explicite.
4. **Façonner** — retrouver un éditeur libre, mesurer la matière produite et poursuivre le projet.

## Les principes du produit

- **L’élan avant la perfection** — le premier jet sert à créer, pas à juger.
- **Une seule attention à la fois** — une tâche active, les autres restent en attente.
- **Une contrainte réversible** — sortir ne détruit jamais le texte et la révision reste toujours disponible.
- **Une progression sans culpabilité** — les retours visuels valorisent le travail produit, sans dark pattern.
- **Des données sous contrôle** — le fonctionnement essentiel doit rester fiable, exportable et compréhensible.

## État du projet

LaForge est actuellement en **phase 3 : cœur du sprint d’écriture**. Les fondations techniques et le préparateur de tâches sont terminés. Le tunnel d’écriture vers l’avant fonctionne, résiste au rechargement et fait maintenant l’objet d’un durcissement progressif sur les méthodes de saisie et les cas limites.

L’application comprend déjà :

- l’onboarding de première visite ;
- la préparation de trois résultats maximum ;
- le sprint d’écriture vers l’avant ;
- la sortie volontaire sans perte du texte ;
- une minuterie persistante et une sortie volontaire sans perte du texte.

## Lancer LaForge

Prérequis : une version maintenue de Node.js et npm.

```bash
npm install
npm run dev
```

Le terminal affiche l’adresse locale choisie par Vite. Pour exécuter l’ensemble des contrôles avant un commit :

```bash
npm run check
```

Cette commande vérifie le formatage, le linting, les tests et le build de production.

## Parcourir le dépôt

| Ressource | Contenu |
| --- | --- |
| [`docs/phase-0/product-brief.md`](docs/phase-0/product-brief.md) | Cible, promesse, vocabulaire et limites du MVP |
| [`docs/phase-0/engagement-and-metrics.md`](docs/phase-0/engagement-and-metrics.md) | Boucle d’engagement éthique et indicateurs |
| [`docs/phase-0/experience-spec.md`](docs/phase-0/experience-spec.md) | Parcours, wireflows et critères d’acceptation |
| [`docs/phase-0/prototype`](docs/phase-0/prototype) | Prototype interactif autonome de la phase 0 |
| [`docs/architecture/stack.md`](docs/architecture/stack.md) | Stack, stockage local et stratégie de qualité |

L’application est développée avec React, TypeScript et Vite. Le MVP reste local-first : aucune création de compte n’est nécessaire pour écrire.

## Open source

LaForge est le premier projet open source de **Ridwane Ladany**. Le dépôt est public dès sa fondation pour rendre visibles les décisions produit et techniques au fil du développement.

Les contributions externes ne sont pas encore ouvertes. Les règles de contribution et de gouvernance seront publiées avant la première bêta.

## Licence

LaForge est distribué sous [licence MIT](LICENSE). Les composants tiers conservent leurs auteurs et licences respectifs ; voir [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
