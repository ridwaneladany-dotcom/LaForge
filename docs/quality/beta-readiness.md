# Préparation de la bêta

État vérifié le 18 août 2026. Ce document sépare les contrôles déjà reproductibles des validations qui demandent encore un appareil, un lecteur d’écran ou de vrais utilisateurs.

## Contrôles automatisés

| Contrôle | Résultat |
| --- | --- |
| Formatage et lint | OK |
| Tests unitaires et d’intégration | 14 fichiers, 35 tests réussis |
| Build TypeScript et Vite | OK |
| Taille du build | JavaScript 75,37 kB gzip ; CSS 8,05 kB gzip |
| Audit npm, production et développement | 0 vulnérabilité connue |
| Recherche de secrets et fichiers `.env` suivis | aucun résultat |
| Déploiement public | HTTPS, fallback SPA et en-têtes de sécurité vérifiés |

La commande reproductible est `npm run check`. L’audit des dépendances utilise `npm audit`.

## Accessibilité

Déjà vérifié ou couvert :

- structure sémantique et noms accessibles des parcours principaux ;
- focus visible des boutons, champs et deux éditeurs ;
- ouverture, boucle de tabulation, touche Échap et restitution du focus du dialogue de sortie ;
- libellés lecteur d’écran pour la semaine d’activité et le palier de maîtrise ;
- contraste d’au moins 4,5:1 pour les petits textes sur papier et le bouton principal ;
- désactivation ou réduction des animations avec `prefers-reduced-motion` ;
- absence de débordement horizontal à 390 px de large.

Restent à valider avant de déclarer l’audit terminé : un parcours réel avec VoiceOver ou NVDA, le zoom navigateur à 200 % sur chaque écran et le mode de contraste renforcé sur un système compatible.

## PWA et hors connexion

Le manifeste fournit des icônes standard et maskable, un démarrage à la racine et le mode `standalone`. Le service worker met en cache la coquille applicative, actualise la navigation quand le réseau répond et retombe sur la dernière page d’accueil conservée en cas d’échec réseau.

Le manifeste est servi en production avec le type `application/manifest+json`. Le parcours public vérifié couvre l’onboarding, la création d’une tâche, le lancement d’un sprint, la frappe, la sauvegarde locale, la sortie anticipée et le bilan final.

Une installation réelle et un redémarrage en mode avion restent à rejouer sur iOS, Android et un navigateur de bureau après chaque modification du service worker ou des icônes.

## Sécurité et confidentialité

- aucun secret ou identifiant d’API n’est attendu dans le client ;
- aucun contenu rédigé n’est envoyé par l’application ;
- les permissions caméra, microphone et géolocalisation sont désactivées par en-tête ;
- l’intégration en iframe est bloquée et le reniflage de type MIME est désactivé ;
- les diagnostics d’erreur excluent le message d’erreur et le contenu rédigé.

## Contrôles de sortie bêta encore ouverts

- automatiser un parcours de bout en bout dans un vrai navigateur ;
- mesurer le démarrage et la frappe sur un téléphone ou ordinateur modeste ;
- valider l’installation et le hors-ligne sur les trois familles d’appareils ;
- conserver l’identifiant Cloudflare de chaque version déclarée stable.
