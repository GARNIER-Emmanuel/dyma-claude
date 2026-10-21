# JobView

<p align="center">
  <img src="./assets/certification-claude-code.png" alt="Certificat de réussite Claude Code" width="800" />
</p>
<p align="center">
  📄 <a href="./assets/certification-claude-code.pdf">Consulter le certificat officiel au format PDF</a>
</p>

> **Formation Claude Code validée le 21 octobre 2026 (25 heures de formation).**

Une application Angular pour conserver ses entretiens et comparer les propositions d’emploi. Le périmètre est décrit dans [design-doc.md](design-doc.md).

## Prérequis et commandes

- Node.js **24.18.1**, indiqué dans `.node-version` (minimum 24.15, branche 24).
- pnpm **10.15.1**, indiqué dans `package.json`.

Avec Corepack disponible, exécuter `corepack enable` si nécessaire. Sinon, installer pnpm 10.15.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
```

`pnpm dev` lance le serveur sur `http://localhost:4200`. Les tests s’exécutent sans surveillance. La compilation de production génère le site statique dans `dist/jobview/browser/`.

## Organisation

Une seule application, avec ses sources dans `src/` et sa configuration à la racine. Aucun CLI ni package partagé n’est nécessaire.

Les écrans, types métier, validations et tests sont regroupés dans `src/app/profile/` et `src/app/interviews/`. Le service unique `JobViewStorage` et le format de stockage versionné sont dans `src/app/storage/`. Le composant racine relie les formulaires, la liste et le détail à ce service.

Les versions directes sont exactes et `pnpm-lock.yaml` verrouille les dépendances transitives. `.npmrc` conserve une installation à plat adaptée aux contraintes Windows et un cache local ignoré par Git. Seul le script d’installation d’esbuild est autorisé, dans la configuration `pnpm` de `package.json`.

## Périmètre et preuves

L'application permet d'enregistrer le profil, de créer un entretien sans profil préalable, puis de le retrouver dans la liste et de consulter son détail. Les limites de ce parcours sont décrites dans [tranche-verticale.md](tranche-verticale.md). La modification et la suppression des entretiens, l'effacement global, les tris, la recherche et les filtres sont reportés.

Les résultats datés des tests, de la compilation et des recettes locales sont conservés dans les [validations par phase](docs/phases/README.md). Ils décrivent les états du code et les environnements testés ; ils ne valent pas une nouvelle exécution sur le dépôt courant.

## Déploiement Vercel

Pour Vercel, utiliser la racine du projet, Node.js 24 compatible avec les moteurs déclarés, pnpm 10.15.1, la commande `pnpm build` et le répertoire de sortie `dist/jobview/browser/`. Le déploiement et le maintien d’une adresse stable restent à valider. La licence reste à choisir avant diffusion.
