# Architecture — données locales et portabilité

## Principe

LaForge reste local-first pendant le MVP. Les projets, tâches, jets, sprints, préférences et données de pratique sont enregistrés dans `localStorage` sous la clé versionnée `laforge:state`. Aucun contenu rédigé n’est transmis à un serveur ou à une analytique.

## Version et migration

Le schéma courant est la version 4. Le chargement accepte directement cette version et migre automatiquement la version 3 en ajoutant le projet actif, choisi parmi les projets existants selon leur dernière mise à jour.

Une valeur illisible ou d’une version inconnue n’est jamais écrasée pendant le chargement. L’application repart dans un état vide, afin de laisser la source intacte pour une récupération manuelle.

Toute évolution future du schéma doit :

1. reconnaître explicitement la version source ;
2. produire un nouvel état sans modifier la valeur source ;
3. conserver projets, tâches et jets avant d’ajouter des valeurs par défaut ;
4. disposer d’un test de migration avant la mise en production.

## Sauvegarde

Les modifications sont regroupées pendant 250 ms afin d’éviter une écriture synchrone à chaque caractère. L’interface distingue les états `sauvegarde`, `enregistré` et `erreur`. Une dernière écriture est tentée lors de l’événement `pagehide`.

## Import et export

- Un jet peut être exporté en texte brut ou Markdown.
- Un projet exporte tous ses jets conservés, dans leur ordre de création.
- Les fichiers `.txt`, `.md` et `.markdown` de 2 Mo maximum peuvent être importés dans le projet actif, uniquement hors sprint verrouillé.
- Une sauvegarde JSON contient l’intégralité de l’état versionné.
- La suppression complète demande une seconde confirmation explicite et remet l’application dans son état initial.

## Décision sur le PDF

L’export PDF est reporté après les premiers retours bêta. Le MVP ne possède pas de mise en page riche : générer un PDF ajouterait une dépendance et des choix de composition sans signal d’usage. Le texte brut et Markdown couvrent la portabilité immédiate et permettent déjà une conversion vers le format final choisi par l’utilisateur.

