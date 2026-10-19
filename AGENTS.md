# Consignes du dépôt

JobView est une application Angular de suivi des entretiens et de comparaison des offres d'emploi.

## Références

- [design-doc.md](design-doc.md) et [tranche-verticale.md](tranche-verticale.md) : périmètre et règles métier.
- [README.md](README.md) : installation ; [index des phases](docs/phases/README.md) : spécifications, plans et preuves.
- [src/app/AGENTS.md](src/app/AGENTS.md) : organisation, logique métier et sécurité du stockage. Lire ces consignes avant de modifier l'application.

## Commandes et conventions

Utiliser Node.js **24.18.1** et pnpm **10.15.1**.

- `pnpm install --frozen-lockfile` : installer les dépendances verrouillées.
- `pnpm dev` : démarrer sur `http://localhost:4200`.
- `pnpm test` : tests unitaires sans surveillance.
- `pnpm build` : compilation de production dans `dist/jobview/browser/`.

Respecter `.editorconfig`, les vérifications strictes TypeScript/Angular et les textes d'interface en français. Préférer de petits composants, des fonctions métier pures et des noms de fichiers descriptifs en kebab-case. Éviter les abstractions et dépendances sans besoin concret.

Conserver les versions exactes, actualiser `pnpm-lock.yaml` si les dépendances changent et préserver `.npmrc`. Ne jamais commiter de secrets, de données personnelles réelles, de sorties de compilation ou de caches.

## Vérification et livraison

Après une modification du code, exécuter `pnpm test` et `pnpm build`. Couvrir les comportements modifiés et les cas limites avec des tests `*.spec.ts` colocalisés (TestBed, Vitest, jsdom) et des données fictives. Vérifier les parcours d'interface concernés dans un navigateur, sur mobile et PC ; jsdom ne remplace pas cette recette.

Pour les commits autorisés, sélectionner les fichiers et employer un message impératif concis. Les PR décrivent le comportement, l'issue liée, les vérifications et leurs limites, avec captures pour les changements visuels.

## Suivi des interventions par phase et par issue GitHub

Une demande d'analyse seule reste en lecture seule. Avant toute modification, inspecter le code et l'état Git ; préserver le travail existant.

1. Lire l'issue et ses commentaires via le MCP GitHub, les consignes applicables et les `spec.md`, `plan-implementation.md`, `validation.md` et preuves de la phase. Si le MCP est indisponible, le signaler sans présenter le contenu fourni comme une lecture GitHub vérifiée.
2. Comparer les documents au code, à la branche, au commit et aux modifications locales. Signaler les contradictions avec les fichiers et faits concernés. Demander un arbitrage si elles affectent le périmètre, les critères ou l'autorisation ; suspendre seulement le travail qui en dépend.
3. Identifier périmètre, exclusions, critères, gates préalables et approbation du plan. Réutiliser une approbation existante couvrant le travail ; sinon préparer le plan et obtenir son approbation avant l'implémentation. Un plan rédigé ou une issue ouverte ne vaut pas approbation.
4. Réaliser uniquement le travail autorisé. Référencer les règles métier dans les documents ci-dessus sans les recopier ici.
5. Consigner les contrôles et preuves dans le `validation.md` concerné : date, branche, commit ou modifications locales, environnement. Distinguer **réussi**, **échoué**, **non vérifié** et séparer tests, compilation et observations navigateur (adresse, navigateur, tailles, scénarios et captures utiles). Un contrôle obligatoire échoué ou non exécuté bloque la gate et la clôture de l'issue.
6. Commentaire GitHub, commit, push et clôture nécessitent une autorisation explicite. Dans les mises à jour autorisées, résumer changements, résultats, preuves et limites en distinguant local et publié.

### Exemple : préparer une intervention de phase 3

Lire l'issue et les [documents de phase 3](docs/phases/03-interface-angular/spec.md), vérifier les preuves des phases 1 et 2 et les contrats disponibles dans le code. Préparer ou actualiser le plan avec ses exclusions, retrouver ou obtenir son approbation avant de modifier les composants, puis consigner les contrôles dans sa validation. Cet exemple n'autorise aucune implémentation.

## Graphify

Sur `/graphify`, lire et suivre `~/.agents/skills/graphify/SKILL.md` avant toute autre action.
