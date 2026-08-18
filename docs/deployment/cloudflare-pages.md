# Déployer LaForge sur Cloudflare Pages

LaForge est une application Vite entièrement statique. Cloudflare Pages peut donc servir le dossier de production sans serveur applicatif ni fonction facturée à chaque requête.

## Configuration recommandée

Créer un projet Pages avec l’option **Connect to Git**, puis sélectionner le dépôt public `ridwaneladany-dotcom/LaForge`.

| Réglage Cloudflare | Valeur |
| --- | --- |
| Branche de production | `main` |
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Variable `NODE_VERSION` | `22.12.0` |

Chaque push sur `main` déclenchera ensuite un nouveau build de production. Les autres branches pourront recevoir une URL de prévisualisation sans remplacer la production.

## Adresse publique

Aucun nom de domaine acheté n’est nécessaire. Cloudflare attribue une adresse en `*.pages.dev` à la création du projet. Un domaine personnel pourra être relié plus tard sans modifier l’application.

## Fichiers propres à Pages

- `public/_headers` ajoute des en-têtes de sécurité et met en cache les ressources versionnées.
- `public/_redirects` renvoie les futures routes de l’application vers `index.html`.

Vite copie ces deux fichiers dans `dist` pendant le build. Leur présence est vérifiable avec `npm run build`.

## Vérification après déploiement

1. Ouvrir l’adresse `*.pages.dev` fournie par Cloudflare.
2. Terminer l’onboarding puis créer une tâche.
3. Lancer un sprint, écrire quelques caractères et recharger la page.
4. Vérifier que le texte et le temps restant sont conservés.
5. Vérifier le tic-tac, sa coupure et le bilan sur ordinateur et mobile.

La persistance reste locale au navigateur : un autre appareil ou un autre navigateur ne retrouve pas encore les textes du MVP.
