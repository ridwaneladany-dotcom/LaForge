# Données, confidentialité et limites du verrouillage

LaForge est conçu pour rester utile sans compte utilisateur ni collecte du texte rédigé. Cette note décrit le comportement du MVP tel qu’il est implémenté.

## Ce qui reste sur l’appareil

Les projets, tâches, brouillons, préférences et statistiques de pratique sont enregistrés dans le stockage local du navigateur. LaForge n’envoie pas ce contenu à un serveur et n’intègre aucun outil d’analytique.

L’utilisateur peut :

- exporter un texte en TXT ou Markdown ;
- créer une sauvegarde JSON de toutes ses données ;
- importer un fichier TXT ou Markdown dans le projet actif ;
- supprimer toutes les données LaForge de ce navigateur après une double confirmation.

Une navigation privée, un nettoyage du navigateur, un changement de navigateur ou un changement d’appareil peut rendre les données locales indisponibles. La sauvegarde JSON est donc recommandée pour les écrits importants.

## Requêtes réseau

L’application ne demande ni microphone, ni caméra, ni position. Le tic-tac est produit localement par le navigateur. Les seules requêtes nécessaires servent les fichiers statiques de l’application depuis Cloudflare ; Cloudflare peut traiter les métadonnées techniques habituelles d’une requête web, mais le texte saisi n’est jamais inclus dans ces requêtes.

## Erreurs

Une erreur d’affichage produit un code de diagnostic local contenant uniquement un identifiant, une date et un type d’erreur. Le message d’erreur et le contenu écrit ne sont ni conservés ni transmis.

## Limites du mode focalisé

Le verrouillage est une contrainte d’interface, pas un verrouillage du système. Une application web ne peut pas empêcher de fermer l’onglet, quitter le navigateur, changer d’application, couper l’appareil ou utiliser les contrôles du système. Elle ne doit pas non plus rendre un texte inaccessible en cas de panne.

Pendant un jet, LaForge bloque volontairement l’édition rétroactive dans sa zone d’écriture. L’utilisateur garde toutefois une sortie transparente : il peut quitter la page et retrouver le brouillon local lors de son retour. Le texte complet devient révisable une fois le minuteur terminé.

## Évolutions nécessitant une nouvelle décision

La synchronisation entre appareils, les comptes, la télémétrie et tout service tiers sont hors du MVP. Leur ajout demanderait une politique de données mise à jour, un consentement explicite lorsque nécessaire et la garantie que le contenu rédigé reste exclu des mesures produit.
