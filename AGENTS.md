# Repository Guidelines

## Project Structure & Module Organization

JobView is an Angular application for recording interviews and comparing offers. Read `design-doc.md` for business rules and `README.md` for setup.

- `src/main.ts`: application bootstrap.
- `src/app/`: standalone components, templates, configuration, and future business types and storage service. Colocate tests with their implementation.
- `src/styles.css`: global CSS; `src/index.html`: French-language document shell.
- `public/`: static assets.
- Root configuration: `angular.json`, `tsconfig*.json`, and pnpm files.
- `dist/jobview/browser/`: generated production site; never commit build output or caches.

## Build, Test, and Development Commands

Use Node.js **24.18.1** and pnpm **10.15.1**.

- `pnpm install --frozen-lockfile`: install locked dependencies.
- `pnpm dev`: start development at `http://localhost:4200`.
- `pnpm test`: run unit tests once, without watch mode.
- `pnpm build`: compile the production site for the planned Vercel deployment.

Keep dependency versions exact and update `pnpm-lock.yaml` with dependency changes. Preserve `.npmrc` installation settings.

## Coding Style & Naming Conventions

Follow `.editorconfig`: two-space indentation, UTF-8, final newlines, and single quotes in TypeScript. Respect strict TypeScript and Angular template checking. Use PascalCase class names and descriptive kebab-case filenames such as `interview-storage.ts`; retain existing root filenames. Keep user-facing text in French.

Prefer small components and plain business functions. Avoid shared packages or extra abstraction layers without a concrete need. No formatter or lint command is currently configured.

## Testing Guidelines

Tests use Angular TestBed, Vitest, and jsdom. Name files `*.spec.ts`; the existing `app.spec.ts` checks startup and the title. No numeric coverage threshold is configured.

For feature changes, cover validation, missing versus zero ratings, and relevant persistence failures using fictional data. Verify mobile behavior and persistence in a browser. Run `pnpm test` and `pnpm build` before submitting code changes.

## Commit & Pull Request Guidelines

Use concise, imperative messages, consistent with the existing Git history, for example `Add interview form validation`. Keep commits focused and stage files selectively.

Pull requests should explain behavior changes, link relevant issues, report verification results, and include screenshots for visual changes. Identify incomplete acceptance checks.

## Data Safety & Scope

V1 keeps business data in the browser. Route all localStorage operations through one service with a versioned format. Never overwrite unreadable or unknown-version data; show save failures. Confirm deletions and clear only JobView data. Render input as text. Never commit secrets or real personal data.

## Agent Instructions

When the user invokes `/graphify`, read and follow `~/.agents/skills/graphify/SKILL.md` before other work.

### Suivi des interventions par phase et par issue GitHub

Une demande d'analyse seule reste en lecture seule. Pour une intervention rattachée à une issue :

1. Lire l'issue et ses commentaires via le MCP GitHub, les consignes applicables et les documents de la phase indiqués dans [l'index des phases](docs/phases/README.md) : `spec.md`, `plan-implementation.md` et `validation.md`, ainsi que les preuves liées. Si le MCP est indisponible, signaler cette limite et distinguer le contenu fourni par l'utilisateur d'une lecture GitHub vérifiée.
2. Inspecter le code, la branche, le commit et les modifications Git existantes avant d'agir. Comparer cet état aux documents ; un statut documentaire ne prouve pas l'état du dépôt. Signaler chaque contradiction avec les fichiers concernés et les faits observés. Ne pas modifier silencieusement une règle ou déclarer une gate validée pour résoudre un désaccord. Si le désaccord affecte le périmètre, les critères ou l'autorisation, demander un arbitrage et suspendre uniquement le travail qui en dépend ; poursuivre les tâches indépendantes autorisées.
3. Identifier le périmètre, les exclusions, les critères d'acceptation, les gates préalables et la trace de l'approbation du plan (message utilisateur ou commentaire GitHub). Un fichier de plan ou une issue ouverte ne vaut pas approbation. Réutiliser une approbation existante si elle couvre le travail demandé ; sinon préparer ou actualiser le plan et obtenir son approbation avant l'implémentation de la phase.
4. Réaliser uniquement le travail autorisé, en préservant les modifications existantes. Les règles métier restent dans le [design-doc](design-doc.md), la [tranche verticale](tranche-verticale.md) et les spécifications liées ; les référencer sans les recopier ici.
5. Consigner les contrôles réellement exécutés et leurs preuves dans le `validation.md` de la phase concernée, avec date, branche, commit ou modifications locales et environnement. Distinguer **réussi**, **échoué** et **non vérifié**. Séparer les tests (`pnpm test`, sortie et cas couverts), la compilation (`pnpm build`, sortie) et les observations navigateur (adresse, navigateur, tailles d'écran, scénarios, résultats et captures pertinentes). Une compilation ou un test jsdom ne prouve pas un parcours navigateur. Tout contrôle non exécuté reste **non vérifié** ; préciser les limites et anomalies bloquantes.
6. Dans les mises à jour GitHub autorisées, résumer les changements, les résultats, les liens vers les preuves et les limites, en distinguant travail local et publié. Ne pas publier de commentaire sans autorisation, ni déduire une autorisation de commit, push ou clôture de la seule demande d'implémentation. Ne pas clôturer l'issue si un critère obligatoire reste échoué ou non vérifié, ni déclarer une gate validée dans ce cas.

### Exemple : préparer une intervention de phase 3

Lire l'issue concernée, la [spécification de phase 3](docs/phases/03-interface-angular/spec.md), son [plan](docs/phases/03-interface-angular/plan-implementation.md) et sa [validation](docs/phases/03-interface-angular/validation.md). Vérifier les preuves des phases 1 et 2 depuis l'index et inspecter les composants et contrats réellement disponibles.

Lors de la revue du 19 octobre 2026, le plan de phase 3 est un support non détaillé et non approuvé. La conclusion de sa validation mentionne encore des phases préalables non validées, alors que l'index et leurs validations annoncent des gates locales validées. Signaler ce décalage avec les chemins concernés, vérifier les preuves et proposer la correction documentaire avant de s'appuyer sur ces statuts ; ne pas assimiler les gates locales à une recette navigateur. La présence d'un historique Git a également conduit à corriger ici l'ancienne affirmation selon laquelle aucun commit n'existait.

Pour une future demande d'implémentation de phase 3, préparer le plan à partir du dépôt réel, rappeler les exclusions de sa spécification et retrouver ou obtenir l'approbation avant de toucher aux composants. Consigner ensuite séparément tests, compilation et parcours navigateur dans sa validation. Cet exemple n'approuve aucun plan, ne valide aucune gate et n'implémente pas la phase 3.
