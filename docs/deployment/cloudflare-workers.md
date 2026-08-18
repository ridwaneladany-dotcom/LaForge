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

Aucun nom de domaine acheté n’est nécessaire. La production est disponible sur `https://laforge.lfos.workers.dev/`. Un domaine personnel pourra être relié plus tard sans modifier l’application.

## Fichiers de déploiement

- `wrangler.jsonc` configure le nom du Worker, le dossier statique et le routage SPA.
- `public/_headers` ajoute des en-têtes de sécurité et met en cache les ressources versionnées.

Vite copie le fichier public dans `dist` pendant le build. Aucune règle `_redirects` n’est ajoutée : elle ferait doublon avec `not_found_handling` et provoquerait une boucle de redirection sur Workers.

## Vérification après déploiement

1. Ouvrir l’adresse `*.workers.dev` fournie par Cloudflare.
2. Terminer l’onboarding puis créer une tâche.
3. Lancer un sprint, écrire quelques caractères et recharger la page.
4. Vérifier que le texte et le temps restant sont conservés.
5. Vérifier le tic-tac, sa coupure et le bilan sur ordinateur et mobile.
6. Ouvrir une route inexistante et confirmer que l’application répond sans erreur 404.

La persistance reste locale au navigateur : un autre appareil ou un autre navigateur ne retrouve pas encore les textes du MVP.

## Retour arrière

Chaque déploiement Cloudflare crée une version distincte du Worker. Si un déploiement introduit une régression :

1. Ouvrir **Workers & Pages**, sélectionner `laforge`, puis **Deployments**.
2. Repérer la dernière version qui a passé le parcours de vérification ci-dessus.
3. Ouvrir le menu à trois points de cette version et choisir **Rollback**.
4. Confirmer que cette version reçoit de nouveau 100 % du trafic.
5. Rejouer le parcours critique sur `https://laforge.lfos.workers.dev/` avant de corriger `main`.

Le même retour arrière peut être lancé en terminal avec `npx wrangler rollback`, mais le tableau de bord reste la procédure privilégiée afin de sélectionner explicitement la version connue comme stable. La procédure officielle Cloudflare est décrite dans [Rollbacks](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).
