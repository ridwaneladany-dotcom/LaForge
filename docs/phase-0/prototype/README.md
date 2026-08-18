# Prototype interactif de phase 0

Ce prototype matérialise les décisions de cadrage de LaForge sans choisir la future stack applicative.

## Parcours disponibles

1. Choisir une tâche et une durée.
2. Lancer un sprint avec `Forger 15 min`.
3. Tester la saisie uniquement vers l'avant et la récupération après rechargement.
4. Ouvrir la sortie volontaire qui conserve le texte.
5. Utiliser `Aperçu du bilan` pour atteindre immédiatement l'écran de fin.
6. Réviser le texte ou préparer la tâche suivante.

## Lancement local

Depuis ce dossier :

```powershell
python -m http.server 41763 --bind 127.0.0.1
```

Puis ouvrir <http://127.0.0.1:41763/>.

Le prototype utilise uniquement HTML, CSS et JavaScript natifs. Son code n'est pas la fondation technique de l'application finale.

