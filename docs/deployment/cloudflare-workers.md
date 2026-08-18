# Déployer LaForge sur Cloudflare Workers

LaForge est une application Vite entièrement statique. Cloudflare Workers Static Assets sert donc directement le dossier de production, sans Worker applicatif ni fonction exécutée pour chaque page.

## Configuration du build connecté

Le projet Cloudflare est relié au dépôt public `ridwaneladany-dotcom/LaForge`.

| Réglage Cloudflare | Valeur |
| --- | --- |
| Branche de production | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Version Node minimale | `22.12.0` |

Le fichier `wrangler.jsonc` indique à Cloudflare que les fichiers à publier se trouvent dans `dist`. Le mode `single-page-application` renvoie `index.html` pour les futures routes qui ne correspondent pas à un fichier statique.

Chaque push sur `main` déclenche automatiquement un nouveau build et un nouveau déploiement de production.

## Adresse publique

Aucun nom de domaine acheté n’est nécessaire. Cloudflare attribue une adresse en `*.workers.dev`. Un domaine personnel pourra être relié plus tard sans modifier l’application.

## Fichiers de déploiement

- `wrangler.jsonc` configure le nom du Worker, le dossier statique et le routage SPA.
- `public/_headers` ajoute des en-têtes de sécurité et met en cache les ressources versionnées.
- `public/_redirects` conserve une redirection SPA explicite pour les plateformes qui la prennent en charge.

Vite copie les deux fichiers publics dans `dist` pendant le build.

## Vérification après déploiement

1. Ouvrir l’adresse `*.workers.dev` fournie par Cloudflare.
2. Terminer l’onboarding puis créer une tâche.
3. Lancer un sprint, écrire quelques caractères et recharger la page.
4. Vérifier que le texte et le temps restant sont conservés.
5. Vérifier le tic-tac, sa coupure et le bilan sur ordinateur et mobile.
6. Ouvrir une route inexistante et confirmer que l’application répond sans erreur 404.

La persistance reste locale au navigateur : un autre appareil ou un autre navigateur ne retrouve pas encore les textes du MVP.
