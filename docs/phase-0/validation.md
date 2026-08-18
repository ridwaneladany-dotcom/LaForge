# Phase 0 — Validation du prototype

## Périmètre vérifié

Le prototype a été servi avec un serveur statique local et contrôlé dans le navigateur intégré.

## Parcours fonctionnels

| Vérification | Résultat |
| --- | --- |
| Affichage de l'onboarding à la première visite | Réussite |
| Navigation, retour et passage des trois étapes | Réussite |
| Interaction avec l'exemple de tâche | Réussite |
| Sélection d'une tâche parmi trois | Réussite |
| Sélection d'une durée rapide | Réussite |
| Lancement immédiat d'un sprint | Réussite |
| Focus automatique dans l'éditeur | Réussite |
| Saisie exacte de 125 caractères avec accents, `œ`, chiffres et ponctuation | Réussite |
| Blocage de la flèche gauche et du retour arrière | Réussite |
| Blocage de l'annulation clavier | Réussite |
| Conservation du texte après rechargement | Réussite |
| Conservation du temps après rechargement | Réussite |
| Ouverture et fermeture de la sortie volontaire | Réussite |
| Passage au bilan de jet | Réussite |
| Calcul du nombre de mots | Réussite |
| Passage en révision libre | Réussite |
| Suppression autorisée pendant la révision | Réussite |
| Préparation de la tâche suivante | Réussite |

## Responsive

### Desktop

- La préparation utilise une composition éditoriale en deux colonnes.
- La hiérarchie conserve une action principale unique.
- Le sprint utilise toute la largeur disponible sans distraire de l'éditeur.
- Le bilan reste centré et lisible sans défilement au viewport de test.

### Mobile — 390 × 844

- Aucun débordement horizontal n'a été détecté.
- Les tâches passent en pile et conservent des cibles tactiles confortables.
- Le bouton principal occupe toute la largeur utile.
- Le sprint conserve le minuteur, la tâche et la sortie dans une barre compacte.
- Le bilan passe en une colonne et les actions restent accessibles.

## Accessibilité vérifiée

- structure sémantique avec titres, régions, boutons et groupes radio ;
- libellés accessibles pour l'éditeur, la braise et les contrôles sans texte ;
- focus visible ;
- navigation et activation clavier des actions principales ;
- dialogue natif pour la sortie volontaire ;
- contenu essentiel absent des seules représentations colorées ;
- alternative `prefers-reduced-motion` sans translation ;
- variante `prefers-contrast: more` avec surfaces opaques et bordures renforcées.

## Incidents détectés et corrigés

1. Le badge flottant du prototype recouvrait une action en bas du viewport mobile. Il est désormais masqué dans les états sprint et bilan.
2. La révision libre n'était pas persistée comme un état distinct. Elle possède désormais son propre état, ses libellés et son comportement déverrouillé après rechargement.
3. L'éditeur relisait sa mise en page et écrivait dans le stockage local à chaque caractère. La lecture utilise désormais `textContent`, la persistance est différée et vidée avant la fermeture, et la composition de caractères est prise en charge.
4. Un masque graphique donnait l'impression que certaines lettres disparaissaient. Il a été supprimé : tous les caractères restent visibles avec un contraste constant.
5. Le badge du prototype pouvait masquer l'action principale de l'onboarding. Il est désormais absent de cet état.

## Limites volontaires

- Les trois tâches sont des données de démonstration et ne sont pas encore éditables.
- Le prototype utilise `localStorage` uniquement pour simuler la récupération.
- Le bouton `Aperçu du bilan` raccourcit volontairement le minuteur pour les revues.
- Le code du prototype ne détermine pas la stack ni l'architecture de production.
- Une validation avec de vrais utilisateurs reste nécessaire avant de considérer les décisions produit comme approuvées.
